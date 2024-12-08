"use client";
import { createContext, useState, ReactNode } from "react";

interface RelatorioContextType {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const RelatorioContext = createContext<RelatorioContextType>(
  {} as RelatorioContextType
);

export function RelatorioProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <RelatorioContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </RelatorioContext.Provider>
  );
}
