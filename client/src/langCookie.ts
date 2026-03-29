export const getSessionLang = () => {
  const match = document.cookie.match(/lang=([^;]+)/);
  return match ? match[1] : null;
};

export const setSessionLang = (lang: string) => {
  document.cookie = `lang=${lang}; path=/; SameSite=Lax`;
};
