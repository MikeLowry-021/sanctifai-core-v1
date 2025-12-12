import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, DollarSign, QrCode, Shield, Users, Sparkles } from "lucide-react";

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-block p-3 bg-gradient-to-br from-amber-600 to-yellow-500 rounded-full mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
              Support the Mission
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help us keep SanctifAi free and accessible for everyone seeking faith-based media guidance
            </p>
          </div>

          <Card className="border-2 border-amber-600/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-amber-600" />
                100% Free - For a Limited Time
              </CardTitle>
              <CardDescription className="text-base mt-2">
                SanctifAi is currently completely free to use. Your support helps us maintain and expand our services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4 py-6">
                <div className="text-center space-y-2">
                  <div className="inline-block p-3 bg-amber-600/10 rounded-full">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold">Faith-First</h3>
                  <p className="text-sm text-muted-foreground">
                    Biblical guidance for every media choice
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="inline-block p-3 bg-amber-600/10 rounded-full">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold">Community Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Built for believers, by believers
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="inline-block p-3 bg-amber-600/10 rounded-full">
                    <Sparkles className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold">Always Growing</h3>
                  <p className="text-sm text-muted-foreground">
                    Constant improvements and new features
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  PayPal Donation
                </CardTitle>
                <CardDescription>
                  Support us with a secure PayPal donation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Make a one-time or recurring donation to help us continue providing faith-based media analysis.
                </p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                  asChild
                >
                  <a
                    href="https://www.paypal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DollarSign className="mr-2 h-5 w-5" />
                    Donate with PayPal
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-green-600" />
                  SnapScan Donation
                </CardTitle>
                <CardDescription>
                  Quick and easy mobile payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full aspect-square max-w-[200px] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">QR Code Coming Soon</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                    variant="outline"
                    disabled
                  >
                    <QrCode className="mr-2 h-5 w-5" />
                    Scan to Pay with SnapScan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-amber-600/10 to-yellow-500/10 border-amber-600/20">
            <CardHeader>
              <CardTitle className="text-center">Your Support Makes a Difference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-600" />
                    What Your Donation Funds
                  </h4>
                  <ul className="space-y-1 text-muted-foreground ml-6 list-disc">
                    <li>Server costs and infrastructure</li>
                    <li>AI analysis improvements</li>
                    <li>Community features development</li>
                    <li>Content moderation and quality</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Heart className="h-4 w-4 text-amber-600" />
                    Our Commitment
                  </h4>
                  <ul className="space-y-1 text-muted-foreground ml-6 list-disc">
                    <li>100% transparent use of funds</li>
                    <li>Regular feature updates</li>
                    <li>Community-first approach</li>
                    <li>Always faith-focused</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4 pt-8">
            <p className="text-muted-foreground">
              Thank you for considering supporting SanctifAi. Every contribution, no matter the size, helps us serve the community better.
            </p>
            <p className="text-sm text-muted-foreground italic">
              "Give, and it will be given to you. A good measure, pressed down, shaken together and running over."
              <br />
              <span className="font-semibold">- Luke 6:38</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
