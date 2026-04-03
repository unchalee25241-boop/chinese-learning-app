export function speakChinese(text: string, lang: string = "zh-TW") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang === lang) 
    || voices.find(v => v.lang.startsWith("zh"))
    || null;
  
  if (preferred) u.voice = preferred;
  u.lang = lang;
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}
