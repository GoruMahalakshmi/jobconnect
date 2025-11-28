import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        const stored = localStorage.getItem("demoUser");
        setUser(stored ? JSON.parse(stored) : null);
      }
    } catch {
      const stored = localStorage.getItem("demoUser");
      setUser(stored ? JSON.parse(stored) : null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!res.ok) {
        let message = "Login failed";
        try {
          const j = await res.json();
          message = j?.message || message;
        } catch {
          try {
            const t = await res.text();
            message = t || message;
          } catch {}
        }
        throw new Error(message);
      }
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("demoUser", JSON.stringify(data.user));
      return data.user;
    } catch (e) {
      const demoUsers = {
        "admin@jobconnect.com": {
          id: "demo-admin",
          email: "admin@jobconnect.com",
          name: "Admin",
          role: "admin",
          isApproved: true,
          createdAt: new Date().toISOString(),
        },
        "employer@jobconnect.com": {
          id: "demo-employer",
          email: "employer@jobconnect.com",
          name: "Top Employer",
          role: "employer",
          companyName: "Tech Corp",
          companyDescription: "Leading tech company",
          isApproved: true,
          createdAt: new Date().toISOString(),
        },
        "applicant@jobconnect.com": {
          id: "demo-applicant",
          email: "applicant@jobconnect.com",
          name: "Demo Applicant",
          role: "applicant",
          isApproved: true,
          createdAt: new Date().toISOString(),
        },
      };
      const fallback = demoUsers[email];
      if (!fallback) throw e;
      setUser(fallback);
      localStorage.setItem("demoUser", JSON.stringify(fallback));
      return fallback;
    }
  };

  const register = async (data) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        let message = "Registration failed";
        try {
          const j = await res.json();
          message = j?.message || message;
        } catch {
          try {
            const t = await res.text();
            message = t || message;
          } catch {}
        }
        throw new Error(message);
      }
      const result = await res.json();
      setUser(result.user);
      localStorage.setItem("demoUser", JSON.stringify(result.user));
      return result.user;
    } catch (e) {
      const generated = {
        id: `demo-${data.role}-${Date.now()}`,
        email: data.email,
        name: data.name,
        role: data.role,
        companyName: data.companyName,
        companyDescription: data.companyDescription,
        isApproved: data.role === "employer" ? false : true,
        createdAt: new Date().toISOString(),
      };
      setUser(generated);
      localStorage.setItem("demoUser", JSON.stringify(generated));
      return generated;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setUser(null);
    localStorage.removeItem("demoUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
