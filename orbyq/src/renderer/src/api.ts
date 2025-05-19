export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const callBackend = async <T>(endpoint: string, method: string = 'GET', data?: any, token?: string): Promise<T> => {
  return (window.api as any).callBackend(endpoint, method, data, token);
};

export const register = async (request: RegisterRequest): Promise<AuthResponse> => {
  return callBackend<AuthResponse>('auth/register', 'POST', request);
};

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  return callBackend<AuthResponse>('auth/login', 'POST', request);
};

export const ping = async (token?: string): Promise<string> => {
  return callBackend<string>('ping', 'GET', undefined, token);
};