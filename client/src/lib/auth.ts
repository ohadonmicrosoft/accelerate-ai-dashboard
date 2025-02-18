import { useQuery, useMutation } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  user: User;
}

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
      throw new Error('Login failed');
    }
    
    return response.json() as Promise<AuthResponse>;
  },

  async register(data: RegisterData) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return response.json() as Promise<AuthResponse>;
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
    if (!response.ok) throw new Error('Failed to get user');
    return (await response.json() as AuthResponse).user;
  }
};

// React hooks for authentication
export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: api.getUser
  });

  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      // Update user in cache
      queryClient.setQueryData(['auth-user'], data.user);
    }
  });

  const registerMutation = useMutation({
    mutationFn: api.register,
    onSuccess: (data) => {
      // Update user in cache
      queryClient.setQueryData(['auth-user'], data.user);
    }
  });

  const logoutMutation = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(['auth-user'], null);
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
