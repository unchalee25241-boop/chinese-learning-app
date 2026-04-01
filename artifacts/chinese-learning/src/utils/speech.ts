export function speakChinese(text: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-TW"; u.rate = 0.8;
  window.speechSynthesis.speak(u);
}
