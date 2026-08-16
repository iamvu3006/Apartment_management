"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "VND" | "USD";

const EXCHANGE_RATE = 25000; // 1 USD = 25,000 VND

interface AppContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (priceInVND: number, period?: string) => string;
  favorites: string[];
  toggleFavorite: (roomId: string) => void;
  isFavorite: (roomId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("VND");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem("app_currency") as Currency;
      if (savedCurrency === "VND" || savedCurrency === "USD") {
        setCurrencyState(savedCurrency);
      }

      const savedFavs = localStorage.getItem("app_favorites");
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("app_currency", c);
    } catch {}
  };

  const toggleCurrency = () => {
    const next = currency === "VND" ? "USD" : "VND";
    setCurrency(next);
  };

  const toggleFavorite = (roomId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(roomId);
      const updated = exists
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId];
      try {
        localStorage.setItem("app_favorites", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isFavorite = (roomId: string) => favorites.includes(roomId);

  const formatPrice = (priceInVND: number, period: string = "/mo"): string => {
    if (!priceInVND && priceInVND !== 0) return "";
    if (currency === "USD") {
      const usdVal = Math.round(priceInVND / EXCHANGE_RATE);
      return `$${usdVal.toLocaleString("en-US")} USD${period ? " " + period : ""}`;
    }
    return `${priceInVND.toLocaleString("vi-VN")} VND${period ? " " + period : ""}`;
  };

  return (
    <AppContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatPrice,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
