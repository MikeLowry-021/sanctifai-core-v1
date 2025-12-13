import { useQuery } from "@tanstack/react-query";

export type User = {
  id: string;
  email: string;
  googleId?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  whatsappNumber?: string;
  marketingConsent?: string;
  hasCompletedOnboarding?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AuthResponse = {
  user: User | null;
  isAuthenticated: boolean;
};

async function fetchUser(): Promise<AuthResponse> {
  const response = await fetch("/api/auth/user", {
    credentials: "include",
  });

  if (!response.ok) {
    return { user: null, isAuthenticated: false };
  }

  return response.json();
}

export function useAuth() {
  const { data, isLoading, refetch } = useQuery<AuthResponse>({
    queryKey: ["auth", "user"],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: data?.user ?? null,
    isAuthenticated: data?.isAuthenticated ?? false,
    isLoading,
    refetch,
  };
}
