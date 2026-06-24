import type { User } from "../types/types";
import React, { createContext, useContext, useState } from "react";

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string) => void;
  authError: string | null;
};

const UserContext = createContext<UserContextType | null>(null);

const users_local_storage_key = "nyamza:users";
const local_session_storage_key = "nyamza:session";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  //check if there's a current user session in place
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(local_session_storage_key);
    return saved ? JSON.parse(saved) : null;
  });

  const [authError, setAuthError] = useState<string | null>(null);

  // signup
  const signup = (name: string, email: string, password: string) => {
    setAuthError(null);
    const users: User[] = JSON.parse(
      localStorage.getItem(users_local_storage_key) ?? "[]",
    );

    //check if a user already exists with this email address
    if (users.find((u) => u.email === email)) {
      setAuthError("A user with this email address already exists");
      return;
    }
    //  if not, store the user in local storage
    const newUser: User = { email: email, name: name, password: password };

    localStorage.setItem(
      users_local_storage_key,
      JSON.stringify([...users, newUser]),
    );

    localStorage.setItem(local_session_storage_key, JSON.stringify(newUser));

    setUser(newUser);
  };
  const login = (email: string, password: string) => {
    setAuthError(null);

    const users: User[] = JSON.parse(
      localStorage.getItem(users_local_storage_key) ?? "[]",
    );

    const currentUser = users.find((user) => user.email === email);
    //if currentUser exists, continue, else....return with error

    if (!currentUser) {
      setAuthError(
        "Invalid credentials used, please use a valid email and password",
      );
      console.error(`User with this email was not found ${email}`);
      return;
    }
    //   password check
    if (currentUser.password !== password) {
      setAuthError(
        "Invalid credentials used, please use a valid email and password",
      );
      console.error(`Password used for this user was wrong ${password}`);
      return;
    }

    //   set session in local storage
    localStorage.setItem(
      local_session_storage_key,
      JSON.stringify(currentUser),
    );
    setUser(currentUser);
  };
  const logout = () => {
    localStorage.removeItem(local_session_storage_key);
    setUser(null);
    setAuthError(null);
  };

  return (
    <UserContext.Provider
      value={{
        authError,
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
