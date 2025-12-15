import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from project root
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Define Zod schema for environment variables
const envSchema = z.object({
  PERPLEXITY_API_KEY: z.string().optional(),
  TMDB_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  LYRICS_API_KEY: z.string().optional(),
  LYRICS_PROVIDER: z.string().optional(),
  MAKE_WEBHOOK_URL: z.string().optional(),
  PORT: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  SESSION_SECRET: z.string().optional(),
  BASE_URL: z.string().optional(),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("[Config] Failed to parse environment variables:", parsedEnv.error);
  throw new Error("Invalid environment variables");
}

// Export typed config object
export const config = {
  perplexityApiKey: parsedEnv.data.PERPLEXITY_API_KEY || null,
  tmdbApiKey: parsedEnv.data.TMDB_API_KEY || null,
  databaseUrl: parsedEnv.data.DATABASE_URL || null,
  lyricsApiKey: parsedEnv.data.LYRICS_API_KEY || null,
  lyricsProvider: parsedEnv.data.LYRICS_PROVIDER || null,
  makeWebhookUrl: parsedEnv.data.MAKE_WEBHOOK_URL || null,
  port: parsedEnv.data.PORT || '5000',
  googleClientId: parsedEnv.data.GOOGLE_CLIENT_ID || null,
  googleClientSecret: parsedEnv.data.GOOGLE_CLIENT_SECRET || null,
  sessionSecret: parsedEnv.data.SESSION_SECRET || 'development-secret-change-in-production',
  baseUrl: parsedEnv.data.BASE_URL || 'http://localhost:5000',
};

// Log configuration summary
console.log("[Config] Loaded env:", {
  hasPerplexity: !!config.perplexityApiKey,
  hasTMDB: !!config.tmdbApiKey,
  hasDatabase: !!config.databaseUrl,
  hasLyricsProvider: !!config.lyricsProvider,
  hasMakeWebhook: !!config.makeWebhookUrl,
  hasGoogleOAuth: !!(config.googleClientId && config.googleClientSecret),
});
