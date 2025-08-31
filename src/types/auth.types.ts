export interface DecodedToken {
  uid: string;
  role: "admin" | "guest" | "user";
  isAdmin: boolean;
}

export interface AuthState {
  status: "idle" | "loading" | "succeeded" | "failed";
  user: DecodedToken | null;
  error: string | null;
}

