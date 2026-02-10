import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang, getInitialLang, setLang } from './lang';

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang());

  const handleSetLang = (newLang: Lang) => {
    setLangState(newLang);
    setLang(newLang);
  };

  // Update state if localStorage changes in another tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "futu_lang" && e.newValue && ["et", "en", "ru"].includes(e.newValue)) {
        setLangState(e.newValue as Lang);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useLang = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useLang must be used within an I18nProvider");
  }
  return context;
};
