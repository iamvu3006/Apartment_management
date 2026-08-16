"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "VND" | "USD";
export type Language = "en" | "ko" | "zh" | "ru" | "vi";

const EXCHANGE_RATE = 25000; // 1 USD = 25,000 VND

export interface TranslationDict {
  viewDetails: string;
  monthlyRent: string;
  livingArea: string;
  district: string;
  propertyType: string;
  mapTitle: string;
  gridView: string;
  mapView: string;
  saved: string;
  call: string;
  message: string;
  searchPlaceholder: string;
}

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    viewDetails: "View Details →",
    monthlyRent: "Monthly Rent",
    livingArea: "Living Area",
    district: "District",
    propertyType: "Property Type",
    mapTitle: "Interactive Property Map",
    gridView: "📋 Grid View",
    mapView: "🗺️ Map View",
    saved: "Saved",
    call: "Call",
    message: "Message",
    searchPlaceholder: "Search by district, street, or property type...",
  },
  ko: {
    viewDetails: "상세보기 →",
    monthlyRent: "월세",
    livingArea: "면적",
    district: "지역/구",
    propertyType: "매물 유형",
    mapTitle: "인터랙티브 매물 지도",
    gridView: "📋 그리드 보기",
    mapView: "🗺️ 지도 보기",
    saved: "보관함",
    call: "전화문의",
    message: "메시지",
    searchPlaceholder: "지역, 도로명, 매물 유형 검색...",
  },
  zh: {
    viewDetails: "查看详情 →",
    monthlyRent: "月租",
    livingArea: "面积",
    district: "区域",
    propertyType: "房源类型",
    mapTitle: "交互式房源地图",
    gridView: "📋 网格视图",
    mapView: "🗺️ 地图视图",
    saved: "已收藏",
    call: "电话联系",
    message: "发送消息",
    searchPlaceholder: "搜索区域、街道或房源类型...",
  },
  ru: {
    viewDetails: "Подробнее →",
    monthlyRent: "Аренда в месяц",
    livingArea: "Площадь",
    district: "Район",
    propertyType: "Тип жилья",
    mapTitle: "Интерактивная карта недвижимости",
    gridView: "📋 Сетка",
    mapView: "🗺️ Карта",
    saved: "Сохраненные",
    call: "Позвонить",
    message: "Сообщение",
    searchPlaceholder: "Поиск по району, улице или типу жилья...",
  },
  vi: {
    viewDetails: "Xem chi tiết →",
    monthlyRent: "Giá thuê/tháng",
    livingArea: "Diện tích",
    district: "Quận/Huyện",
    propertyType: "Loại hình phòng",
    mapTitle: "Bản đồ bất động sản tương tác",
    gridView: "📋 Dạng danh sách",
    mapView: "🗺️ Dạng bản đồ",
    saved: "Đã lưu",
    call: "Gọi ngay",
    message: "Nhắn tin",
    searchPlaceholder: "Tìm theo quận, tên đường, hoặc loại phòng...",
  },
};

interface AppContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
  formatPrice: (priceInVND: number, period?: string) => string;
  favorites: string[];
  toggleFavorite: (roomId: string) => void;
  isFavorite: (roomId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("VND");
  const [language, setLanguageState] = useState<Language>("en");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem("app_currency") as Currency;
      if (savedCurrency === "VND" || savedCurrency === "USD") {
        setCurrencyState(savedCurrency);
      }

      const savedLang = localStorage.getItem("app_language") as Language;
      if (savedLang && TRANSLATIONS[savedLang]) {
        setLanguageState(savedLang);
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

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("app_language", lang);
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

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        language,
        setLanguage,
        t,
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
