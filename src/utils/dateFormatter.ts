export const formatDate = (
  isoDate: string | Date,
  language: "ru" | "uz" = "ru"
): string => {
  const date = new Date(isoDate);

  const day = date.getDate();

  const months = {
    ru: [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ],
    uz: [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avgust",
      "sentyabr",
      "oktyabr",
      "noyabr",
      "dekabr",
    ],
  };

  const monthName = months[language][date.getMonth()];
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  if (language === "ru") {
    return `${day} ${monthName} ${year} г. в ${hours}:${minutes}:${seconds}`;
  }

  // ✅ O‘zbekcha format
  return `${day} ${monthName} ${year}, soat ${hours}:${minutes}:${seconds}`;
};
