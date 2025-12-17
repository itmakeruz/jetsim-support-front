import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import CustomSelect from "../formElements/CustomSelect";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languageOptions = [
    { id: "ru", name: t("language.ru") },
    { id: "uz", name: t("language.uz") },
  ];

  const handleLanguageChange = (e: {
    target: { name?: string; value: string };
  }) => {
    const { value } = e.target;
    setLanguage(value as "ru" | "uz");
  };

  return (
    <CustomSelect
      value={language}
      name="language"
      options={languageOptions}
      placeholder={t("header.select-option")}
      onChange={handleLanguageChange}
      className="min-w-[120px] border-0"
    />
  );
};

export default LanguageSelector;
