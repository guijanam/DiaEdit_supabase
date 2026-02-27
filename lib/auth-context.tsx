"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Office, Dia } from "@/types";
import * as api from "@/lib/api";

interface AuthContextValue {
  isAuth: boolean;
  officeName: string;
  officeInfo: Office | null;
  dias: Dia[];
  loading: boolean;
  login: (officeName: string, password: string) => Promise<string | null>;
  logout: () => void;
  reloadData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [officeName, setOfficeName] = useState("");
  const [officeInfo, setOfficeInfo] = useState<Office | null>(null);
  const [dias, setDias] = useState<Dia[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const [office, diaList] = await Promise.all([
        api.fetchOfficeInfo(name),
        api.fetchDias(name),
      ]);
      setOfficeInfo(office);
      setDias(diaList);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (name: string, password: string): Promise<string | null> => {
      setLoading(true);
      try {
        const success = await api.authenticate(name, password);
        if (success) {
          setOfficeName(name);
          setIsAuth(true);
          await loadData(name);
          return null;
        }
        return "승무소 이름 또는 비밀번호가 일치하지 않습니다.";
      } catch (e) {
        return `인증 오류: ${e instanceof Error ? e.message : String(e)}`;
      } finally {
        setLoading(false);
      }
    },
    [loadData]
  );

  const logout = useCallback(() => {
    setIsAuth(false);
    setOfficeName("");
    setOfficeInfo(null);
    setDias([]);
  }, []);

  const reloadData = useCallback(async () => {
    if (officeName) {
      await loadData(officeName);
    }
  }, [officeName, loadData]);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        officeName,
        officeInfo,
        dias,
        loading,
        login,
        logout,
        reloadData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
