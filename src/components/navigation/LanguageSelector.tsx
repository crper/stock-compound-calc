import React from "react";
import { Segmented } from "antd";
import { useTranslation } from "react-i18next";
import { LANGUAGES, type Language } from "@/i18n";

export const LanguageSelector: React.FC = React.memo(() => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;

  const handleLanguageChange = (value: string) => {
    void i18n.changeLanguage(value as Language);
  };

  const options = [
    {
      label: "中",
      value: LANGUAGES.ZH_CN,
    },
    {
      label: "En",
      value: LANGUAGES.EN_US,
    },
  ];

  return (
    <Segmented
      value={currentLanguage}
      onChange={handleLanguageChange}
      options={options}
      size="large"
      style={{
        background: "var(--colorBgContainer)",
        border: "1px solid var(--colorBorderSecondary)",
      }}
    />
  );
});

LanguageSelector.displayName = "LanguageSelector";
