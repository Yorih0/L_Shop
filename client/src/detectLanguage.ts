export const getLangFromBrowser = () => {
  const lang = navigator.language || navigator.languages[0];

  if (lang.startsWith("ru")) return "ru";
  if (lang.startsWith("be")) return "by";
  return "en";
};

export const getLangFromIP = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    if (data.country === "BY") return "by";
    if (data.country === "RU") return "ru";
    return "en";
  } catch {
    return null;
  }
};
