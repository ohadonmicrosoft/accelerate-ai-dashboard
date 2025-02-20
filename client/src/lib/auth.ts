import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

// API helpers
const api = {
  async login(data: LoginData) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  async register(data: RegisterData) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  async logout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },

  async getUser() {
    const response = await fetch('/api/auth/user');
    if (response.status === 401) return null;
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get user');
    }
    return response.json();
  }
};

// React hooks for authentication
export function useAuth() {
  const { toast } = useToast();
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: api.getUser,
    retry: false
  });

  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth-user'], data);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: api.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth-user'], data);
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth-user'], null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isAuthenticating: loginMutation.isPending || registerMutation.isPending
  };
}