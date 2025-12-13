import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

type OnboardingModalProps = {
  open: boolean;
  onComplete: () => void;
  userName?: string;
};

export function OnboardingModal({ open, onComplete, userName }: OnboardingModalProps) {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const { toast } = useToast();

  const onboardingMutation = useMutation({
    mutationFn: async (data: { whatsappNumber: string; marketingConsent: boolean }) => {
      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to SanctifAi!",
        description: "Your profile has been set up successfully.",
      });
      onComplete();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onboardingMutation.mutate({ whatsappNumber, marketingConsent });
  };

  const handleSkip = () => {
    onboardingMutation.mutate({ whatsappNumber: "", marketingConsent: false });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            Welcome to SanctifAi{userName ? `, ${userName}` : ""}!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Join our community and stay updated with faith-based media insights.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-sm font-medium">
              WhatsApp Number (Optional)
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+1 234 567 8900"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Receive community updates and prayer requests
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketing"
              checked={marketingConsent}
              onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="marketing"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Keep me updated
              </label>
              <p className="text-xs text-muted-foreground">
                Receive updates about new features and faith-based content recommendations
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={onboardingMutation.isPending}
              className="flex-1"
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              disabled={onboardingMutation.isPending}
              className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600"
            >
              {onboardingMutation.isPending ? "Saving..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
