import type { Express, RequestHandler } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { config } from "./config";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const PgSession = connectPg(session);

export async function setupAuth(app: Express) {
  if (!config.databaseUrl) {
    console.warn("[Auth] DATABASE_URL not set - authentication disabled");
    return;
  }

  if (!config.googleClientId || !config.googleClientSecret) {
    console.warn("[Auth] Google OAuth credentials not set - authentication disabled");
    return;
  }

  app.use(
    session({
      store: new PgSession({
        conString: config.databaseUrl,
        tableName: "sessions",
        createTableIfMissing: true,
      }),
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: `${config.baseUrl}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const googleId = profile.id;

          if (!email) {
            return done(new Error("No email found in Google profile"));
          }

          let user = await db.query.users.findFirst({
            where: eq(users.googleId, googleId),
          });

          if (!user) {
            user = await db.query.users.findFirst({
              where: eq(users.email, email),
            });

            if (user) {
              await db
                .update(users)
                .set({
                  googleId,
                  updatedAt: new Date(),
                })
                .where(eq(users.id, user.id));
            } else {
              const [newUser] = await db
                .insert(users)
                .values({
                  email,
                  googleId,
                  firstName: profile.name?.givenName || null,
                  lastName: profile.name?.familyName || null,
                  profileImageUrl: profile.photos?.[0]?.value || null,
                  hasCompletedOnboarding: "false",
                })
                .returning();
              user = newUser;
            }
          }

          return done(null, user);
        } catch (error) {
          console.error("[Auth] Error in Google OAuth strategy:", error);
          return done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.get("/api/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
  }));

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/?error=auth_failed" }),
    (_req, res) => {
      res.redirect("/");
    }
  );

  app.get("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json({
        user: req.user,
        isAuthenticated: true,
      });
    }
    return res.json({
      user: null,
      isAuthenticated: false,
    });
  });

  app.post("/api/auth/onboarding", isAuthenticated, async (req: any, res) => {
    try {
      const { whatsappNumber, marketingConsent } = req.body;
      const userId = req.user.id;

      await db
        .update(users)
        .set({
          whatsappNumber: whatsappNumber || null,
          marketingConsent: marketingConsent ? "true" : "false",
          hasCompletedOnboarding: "true",
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      const updatedUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("[Auth] Onboarding error:", error);
      res.status(500).json({ error: "Failed to complete onboarding" });
    }
  });

  console.log("[Auth] Google OAuth configured successfully");
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};
