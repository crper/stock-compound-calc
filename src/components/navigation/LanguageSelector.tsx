import React from "react";
import { Button, Tooltip } from "antd";
import { TranslationOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { LANGUAGES, type Language } from "@/i18n";

export const LanguageSelector: React.FC = React.memo(() => {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language as Language;
  const isZh = currentLanguage === LANGUAGES.ZH_CN;

  const toggleLanguage = () => {
    const newLang = isZh ? LANGUAGES.EN_US : LANGUAGES.ZH_CN;
    void i18n.changeLanguage(newLang);
  };

  return (
    <Tooltip title={t("common.tooltips.languageToggle")}>
      <Button
        type="text"
        icon={<TranslationOutlined />}
        onClick={toggleLanguage}
        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-sm font-medium">{isZh ? "中" : "En"}</span>
      </Button>
    </Tooltip>
  );
});

LanguageSelector.displayName = "LanguageSelector";
