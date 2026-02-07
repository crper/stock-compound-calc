import React from "react";
import { Segmented } from "antd";
import { useTranslation } from "react-i18next";
import { LANGUAGES, type Language } from "@/i18n";
import { useResponsive } from "@/hooks/useResponsive";

export const LanguageSelector: React.FC = React.memo(() => {
  const { i18n, t } = useTranslation();
  const { isMobile } = useResponsive();

  const currentLanguage = i18n.language as Language;

  const handleLanguageChange = (value: string) => {
    void i18n.changeLanguage(value as Language);
  };

  const options = [
    {
      label: t("common.languages.chinese"),
      value: LANGUAGES.ZH_CN,
    },
    {
      label: t("common.languages.english"),
      value: LANGUAGES.EN_US,
    },
  ];

  return (
    <Segmented
      value={currentLanguage}
      onChange={handleLanguageChange}
      options={options}
      size={isMobile ? "small" : "large"}
      style={{
        background: "var(--colorBgContainer)",
        border: "1px solid var(--colorBorderSecondary)",
      }}
    />
  );
});

LanguageSelector.displayName = "LanguageSelector";
