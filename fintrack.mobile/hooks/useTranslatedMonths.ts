import { useTranslation } from "react-i18next";

export const useTranslatedMonths = () => {
  const { t } = useTranslation();

  const keys = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  return keys.map((key) => t(`months.${key}`));
};
