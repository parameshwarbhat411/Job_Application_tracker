import { useEffect, useState } from "react";
import { 
  signInWithPopup, 
  signOut, 
  type User,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        setUser(user);
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { ok: true };
    } catch (error: any) {
      return { ok: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { ok: true };
    } catch (error: any) {
      return { ok: false, message: error.message };
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout
  };
}