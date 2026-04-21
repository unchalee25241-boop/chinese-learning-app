const WORKER_URL = "https://tts-proxy.unchalee25241.workers.dev";

export async function speakChinese(text: string, lang: string = "zh-TW") {
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        lang: lang === "zh-TW" ? "tw" : "cn",
      }),
    });

    const data = await response.json();

    if (!data.audioContent) {
      fallbackSpeak(text, lang);
      return;
    }

    const audioBlob = base64ToBlob(data.audioContent, "audio/mp3");
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => URL.revokeObjectURL(audioUrl);

  } catch (e) {
    fallbackSpeak(text, lang);
  }
}

function fallbackSpeak(text: string, lang: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mimeType });
}
