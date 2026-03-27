import { useState, useRef, useEffect } from "react";

// ===================== DATA =====================
const categories = [
{
id: "daily", label: "ชีวิตประจำวัน", emoji: "☀️", color: "#F5A623", bg: "#FFF8E1",
words: [
{ zh: "你好", zhuyin: "ㄋㄧˇ ㄏㄠˇ", th: "สวัสดี (ทักทายทั่วไป)", pinyin: "nǐ hǎo" },
{ zh: "你吃了嗎", zhuyin: "ㄋㄧˇ ㄔ ㄌㄜ ㄇㄚ", th: "กินข้าวยังคะ (ทักทายแบบจีน)", pinyin: "nǐ chī le ma" },
{ zh: "還好", zhuyin: "ㄏㄞˊ ㄏㄠˇ", th: "ก็โอเคนะ / ยังงั้น", pinyin: "hái hǎo" },
{ zh: "沒事", zhuyin: "ㄇㄟˊ ㄕˋ", th: "ไม่เป็นไร / ว่างอยู่", pinyin: "méi shì" },
{ zh: "隨便", zhuyin: "ㄙㄨㄟˊ ㄅㄧㄢˋ", th: "แล้วแต่เลย / อะไรก็ได้", pinyin: "suí biàn" },
{ zh: "差不多", zhuyin: "ㄔㄚ ㄅㄨˋ ㄉㄨㄛ", th: "พอๆ กัน / ก็แถวนั้น", pinyin: "chà bu duō" },
{ zh: "趕快", zhuyin: "ㄍㄢˇ ㄎㄨㄞˋ", th: "รีบๆ หน่อย!", pinyin: "gǎn kuài" },
{ zh: "慢慢來", zhuyin: "ㄇㄢˋ ㄇㄢˋ ㄌㄞˊ", th: "ค่อยๆ ทำ ไม่ต้องรีบ", pinyin: "màn màn lái" },
{ zh: "搞定", zhuyin: "ㄍㄠˇ ㄉㄧㄥˋ", th: "เสร็จแล้ว! / จัดการได้แล้ว", pinyin: "gǎo dìng" },
{ zh: "算了", zhuyin: "ㄙㄨㄢˋ ㄌㄜ", th: "ช่างเถอะ / ปล่อยวาง", pinyin: "suàn le" },
{ zh: "不一定", zhuyin: "ㄅㄨˋ ㄧˊ ㄉㄧㄥˋ", th: "ไม่แน่นอน / อาจจะ", pinyin: "bù yī dìng" },
{ zh: "有夠...", zhuyin: "ㄧㄡˇ ㄍㄡˋ", th: "มากเลย / สุดๆ เลย (ไต้หวัน)", pinyin: "yǒu gòu" },
{ zh: "挖賽", zhuyin: "ㄨㄚ ㄙㄞˋ", th: "โอ้โห! / ว้าว! (ไต้หวัน)", pinyin: "wā sài" },
{ zh: "不客氣", zhuyin: "ㄅㄨˋ ㄎㄜˋ ㄑㄧˋ", th: "ไม่ต้องเกรงใจ", pinyin: "bù kè qì" },
{ zh: "辛苦了", zhuyin: "ㄒㄧㄣ ㄎㄨˇ ㄌㄜ", th: "เหนื่อยมากนะ (ขอบคุณที่ทำงานหนัก)", pinyin: "xīn kǔ le" },
{ zh: "加油", zhuyin: "ㄐㄧㄚ ㄧㄡˊ", th: "สู้ๆ! / เชียร์ใจ", pinyin: "jiā yóu" },
{ zh: "沒關係", zhuyin: "ㄇㄟˊ ㄍㄨㄢ ㄒㄧ", th: "ไม่เป็นไรเลย", pinyin: "méi guān xi" },
{ zh: "等一下", zhuyin: "ㄉㄥˇ ㄧˊ ㄒㄧㄚˋ", th: "รอแป๊บนึงนะ", pinyin: "děng yī xià" },
{ zh: "好險", zhuyin: "ㄏㄠˇ ㄒㄧㄢˇ", th: "เฮ้อ โชคดีนะ! / หวุดหวิดเลย", pinyin: "hǎo xiǎn" },
{ zh: "麻煩你了", zhuyin: "ㄇㄚˊ ㄈㄢˊ ㄋㄧˇ ㄌㄜ", th: "ขอรบกวนด้วยนะคะ", pinyin: "má fán nǐ le" },
],
},
{
id: "love", label: "ความรัก", emoji: "💕", color: "#FF6B8A", bg: "#FFF0F4",
words: [
{ zh: "我喜歡你", zhuyin: "ㄨㄛˇ ㄒㄧˇ ㄏㄨㄢ ㄋㄧˇ", th: "ฉันชอบคุณนะ (บอกรักแบบอ่อนๆ)", pinyin: "wǒ xǐ huān nǐ" },
{ zh: "我愛你", zhuyin: "ㄨㄛˇ ㄞˋ ㄋㄧˇ", th: "ฉันรักคุณ (จริงจังกว่า)", pinyin: "wǒ ài nǐ" },
{ zh: "你今天特別好看", zhuyin: "ㄋㄧˇ ㄐㄧㄣ ㄊㄧㄢ ㄊㄜˋ ㄅㄧㄝˊ ㄏㄠˇ ㄎㄢˋ", th: "วันนี้สวย/หล่อเป็นพิเศษเลย", pinyin: "nǐ jīn tiān tè bié hǎo kàn" },
{ zh: "想你", zhuyin: "ㄒㄧㄤˇ ㄋㄧˇ", th: "คิดถึงนะ", pinyin: "xiǎng nǐ" },
{ zh: "你在幹嘛", zhuyin: "ㄋㄧˇ ㄗㄞˋ ㄍㄢˋ ㄇㄚ", th: "ทำอะไรอยู่คะ (ทักตอนคิดถึง)", pinyin: "nǐ zài gàn ma" },
{ zh: "陪我", zhuyin: "ㄆㄟˊ ㄨㄛˇ", th: "อยู่เป็นเพื่อนฉันได้ไหม", pinyin: "péi wǒ" },
{ zh: "你讓我心動", zhuyin: "ㄋㄧˇ ㄖㄤˋ ㄨㄛˇ ㄒㄧㄣ ㄉㄨㄥˋ", th: "คุณทำให้หัวใจฉันเต้นแรงเลย", pinyin: "nǐ ràng wǒ xīn dòng" },
{ zh: "我們在一起吧", zhuyin: "ㄨㄛˇ ㄇㄣ ㄗㄞˋ ㄧˋ ㄑㄧˇ ㄅㄚ", th: "เราคบกันเถอะนะ", pinyin: "wǒ men zài yī qǐ ba" },
{ zh: "吃醋", zhuyin: "ㄔ ㄘㄨˋ", th: "หึงหวง / อิจฉา (ในความรัก)", pinyin: "chī cù" },
{ zh: "放電", zhuyin: "ㄈㄤˋ ㄉㄧㄢˋ", th: "ปล่อยแรงดึงดูด / จีบอยู่นะ", pinyin: "fàng diàn" },
{ zh: "暖男", zhuyin: "ㄋㄨㄢˇ ㄋㄢˊ", th: "ผู้ชายที่ใจดีอบอุ่นมาก", pinyin: "nuǎn nán" },
{ zh: "撒嬌", zhuyin: "ㄙㄚ ㄐㄧㄠ", th: "ทำตัวน่ารักเอาใจ / ง้อ", pinyin: "sā jiāo" },
{ zh: "曖昧", zhuyin: "ㄞˋ ㄇㄟˋ", th: "กำกวม / ยังไม่ชัดเจนว่าคบกัน", pinyin: "ài mèi" },
{ zh: "緣分", zhuyin: "ㄩㄢˊ ㄈㄣˋ", th: "บุพเพสันนิวาส / โชคชะตา", pinyin: "yuán fèn" },
{ zh: "你笑起來好好看", zhuyin: "ㄋㄧˇ ㄒㄧㄠˋ ㄑㄧˇ ㄌㄞˊ ㄏㄠˇ ㄏㄠˇ ㄎㄢˋ", th: "ยิ้มแล้วสวยมากเลยนะ", pinyin: "nǐ xiào qǐ lái hǎo hǎo kàn" },
{ zh: "我只有你", zhuyin: "ㄨㄛˇ ㄓˇ ㄧㄡˇ ㄋㄧˇ", th: "ฉันมีแค่คุณคนเดียว", pinyin: "wǒ zhǐ yǒu nǐ" },
{ zh: "不理我了嗎", zhuyin: "ㄅㄨˋ ㄌㄧˇ ㄨㄛˇ ㄌㄜ ㄇㄚ", th: "จะไม่คุยกับฉันแล้วหรอ", pinyin: "bù lǐ wǒ le ma" },
{ zh: "我捨不得你", zhuyin: "ㄨㄛˇ ㄕㄜˇ ㄅㄨˋ ㄉㄜˊ ㄋㄧˇ", th: "อาลัยคุณมาก / ใจไม่ยอมปล่อย", pinyin: "wǒ shě bù dé nǐ" },
{ zh: "你是我的寶貝", zhuyin: "ㄋㄧˇ ㄕˋ ㄨㄛˇ ㄉㄜ ㄅㄠˇ ㄅㄟˋ", th: "คุณคือสมบัติของฉันเลย", pinyin: "nǐ shì wǒ de bǎo bèi" },
{ zh: "晚安", zhuyin: "ㄨㄢˇ ㄢ", th: "ราตรีสวัสดิ์ (ส่งก่อนนอน)", pinyin: "wǎn ān" },
],
},
{
id: "job", label: "สัมภาษณ์งาน", emoji: "💼", color: "#4ECDC4", bg: "#F0FFFE",
words: [
{ zh: "自我介紹", zhuyin: "ㄗˋ ㄨㄛˇ ㄐㄧㄝˋ ㄕㄠˋ", th: "แนะนำตัวเอง", pinyin: "zì wǒ jiè shào" },
{ zh: "我對這個職位很感興趣", zhuyin: "ㄨㄛˇ ㄉㄨㄟˋ ㄓㄜˋ ㄍㄜ ㄓˊ ㄨㄟˋ ㄏㄣˇ ㄍㄢˇ ㄒㄧㄥˋ ㄑㄩˋ", th: "ฉันสนใจตำแหน่งนี้มากเลย", pinyin: "wǒ duì zhè ge zhí wèi hěn gǎn xìng qù" },
{ zh: "我的強項是...", zhuyin: "ㄨㄛˇ ㄉㄜ ㄑㄧㄤˊ ㄒㄧㄤˋ ㄕˋ", th: "จุดแข็งของฉันคือ...", pinyin: "wǒ de qiáng xiàng shì" },
{ zh: "我有三年的經驗", zhuyin: "ㄨㄛˇ ㄧㄡˇ ㄙㄢ ㄋㄧㄢˊ ㄉㄜ ㄐㄧㄥ ㄧㄢˋ", th: "ฉันมีประสบการณ์ 3 ปี", pinyin: "wǒ yǒu sān nián de jīng yàn" },
{ zh: "請問薪資範圍是多少", zhuyin: "ㄑㄧㄥˇ ㄨㄣˋ ㄒㄧㄣ ㄗ ㄈㄢˋ ㄨㄟˊ ㄕˋ ㄉㄨㄛ ㄕㄠˇ", th: "ขออนุญาตถามว่าช่วงเงินเดือนเท่าไหร่คะ", pinyin: "qǐng wèn xīn zī fàn wéi shì duō shǎo" },
{ zh: "我可以配合加班", zhuyin: "ㄨㄛˇ ㄎㄜˇ ㄧˇ ㄆㄟˋ ㄏㄜˊ ㄐㄧㄚ ㄅㄢ", th: "ฉันทำงานล่วงเวลาได้นะคะ", pinyin: "wǒ kě yǐ pèi hé jiā bān" },
{ zh: "我學東西很快", zhuyin: "ㄨㄛˇ ㄒㄩㄝˊ ㄉㄨㄥ ㄒㄧ ㄏㄣˇ ㄎㄨㄞˋ", th: "ฉันเรียนรู้เร็วมาก", pinyin: "wǒ xué dōng xi hěn kuài" },
{ zh: "團隊合作", zhuyin: "ㄊㄨㄢˊ ㄉㄨㄟˋ ㄏㄜˊ ㄗㄨㄛˋ", th: "การทำงานเป็นทีม", pinyin: "tuán duì hé zuò" },
{ zh: "壓力下工作", zhuyin: "ㄧㄚ ㄌㄧˋ ㄒㄧㄚˋ ㄍㄨㄥ ㄗㄨㄛˋ", th: "ทำงานภายใต้ความกดดันได้", pinyin: "yā lì xià gōng zuò" },
{ zh: "請問什麼時候會有消息", zhuyin: "ㄑㄧㄥˇ ㄨㄣˋ ㄕㄣˊ ㄇㄜ ㄕˊ ㄏㄡˋ ㄏㄨㄟˋ ㄧㄡˇ ㄒㄧㄠ ㄒㄧ", th: "ขอถามว่าจะทราบผลเมื่อไหร่คะ", pinyin: "qǐng wèn shén me shí hòu huì yǒu xiāo xi" },
{ zh: "我期待加入貴公司", zhuyin: "ㄨㄛˇ ㄑㄧ ㄉㄞˋ ㄐㄧㄚ ㄖㄨˋ ㄍㄨㄟˋ ㄍㄨㄥ ㄙ", th: "ฉันหวังว่าจะได้ร่วมงานกับบริษัทค่ะ", pinyin: "wǒ qī dài jiā rù guì gōng sī" },
{ zh: "這個工作很有挑戰性", zhuyin: "ㄓㄜˋ ㄍㄜ ㄍㄨㄥ ㄗㄨㄛˋ ㄏㄣˇ ㄧㄡˇ ㄊㄧㄠˇ ㄓㄢˋ ㄒㄧㄥˋ", th: "งานนี้ท้าทายดีมากเลย", pinyin: "zhè ge gōng zuò hěn yǒu tiǎo zhàn xìng" },
{ zh: "我希望能成長", zhuyin: "ㄨㄛˇ ㄒㄧ ㄨㄤˋ ㄋㄥˊ ㄔㄥˊ ㄓㄤˇ", th: "ฉันอยากเติบโตในสายงานนี้", pinyin: "wǒ xī wàng néng chéng zhǎng" },
{ zh: "彈性上班", zhuyin: "ㄊㄢˊ ㄒㄧㄥˋ ㄕㄤˋ ㄅㄢ", th: "ทำงานแบบยืดหยุ่นเวลาได้", pinyin: "tán xìng shàng bān" },
{ zh: "遠距工作", zhuyin: "ㄩㄢˇ ㄐㄩˋ ㄍㄨㄥ ㄗㄨㄛˋ", th: "Work from home / ทำงานทางไกล", pinyin: "yuǎn jù gōng zuò" },
{ zh: "我的目標是...", zhuyin: "ㄨㄛˇ ㄉㄜ ㄇㄨˋ ㄅㄧㄠ ㄕˋ", th: "เป้าหมายของฉันคือ...", pinyin: "wǒ de mù biāo shì" },
{ zh: "解決問題", zhuyin: "ㄐㄧㄝˇ ㄐㄩㄝˊ ㄨㄣˋ ㄊㄧˊ", th: "แก้ปัญหาได้", pinyin: "jiě jué wèn tí" },
{ zh: "我很期待這個機會", zhuyin: "ㄨㄛˇ ㄏㄣˇ ㄑㄧ ㄉㄞˋ ㄓㄜˋ ㄍㄜ ㄐㄧ ㄏㄨㄟˋ", th: "ฉันตื่นเต้นกับโอกาสนี้มากค่ะ", pinyin: "wǒ hěn qī dài zhè ge jī huì" },
{ zh: "請多指教", zhuyin: "ㄑㄧㄥˇ ㄉㄨㄛ ㄓˇ ㄐㄧㄠˋ", th: "ยินดีรับคำแนะนำด้วยนะคะ", pinyin: "qǐng duō zhǐ jiào" },
{ zh: "我會盡力而為", zhuyin: "ㄨㄛˇ ㄏㄨㄟˋ ㄐㄧㄣˋ ㄌㄧˋ ㄦˊ ㄨㄟˊ", th: "ฉันจะทำเต็มที่ที่สุดค่ะ", pinyin: "wǒ huì jìn lì ér wéi" },
],
},
];

const FREE_WORD_LIMIT = 3;
const FREE_MSG_LIMIT = 5;
const palette = { bg: "#FFF8F0", red: "#E8433A", gold: "#F5A623", pink: "#FF6B8A", mint: "#4ECDC4", dark: "#2C1810", muted: "#8B7355" };

// ===================== TTS =====================
function speakChinese(text) {
if (!window.speechSynthesis) return;
window.speechSynthesis.cancel();
const u = new SpeechSynthesisUtterance(text);
u.lang = "zh-TW"; u.rate = 0.8;
window.speechSynthesis.speak(u);
}

// ===================== COMPONENTS =====================

function SpeakButton({ text, color }) {
const [active, setActive] = useState(false);
return (
<button onClick={() => { setActive(true); speakChinese(text); setTimeout(() => setActive(false), 1200); }}
style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${color}`, background: active ? color : `${color}18`, fontSize: 20, cursor: "pointer", transition: "all 0.2s", transform: active ? "scale(1.15)" : "scale(1)", flexShrink: 0, display:"flex", alignItems:"center", justifyContent:"center" }}>
{active ? "🔊" : "🔈"}
</button>
);
}

function LockBadge({ onUpgrade }) {
return (
<div onClick={onUpgrade} style={{ background: "#fff", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, border: "2px dashed #E0D8D0", cursor: "pointer", marginBottom: 10 }}>
<div style={{ fontSize: 28 }}>🔒</div>
<div style={{ flex: 1 }}>
<div style={{ fontSize: 14, fontWeight: 700, color: palette.dark }}>คำศัพท์ Premium</div>
<div style={{ fontSize: 12, color: palette.muted }}>อัปเกรดเพื่อดูทั้งหมด</div>
</div>
<div style={{ background: palette.gold, color: "#fff", borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 700 }}>
👑 อัปเกรด
</div>
</div>
);
}

function VocabList({ words, isPremium, color, onUpgrade }) {
const visible = isPremium ? words : words.slice(0, FREE_WORD_LIMIT);
const locked = isPremium ? [] : words.slice(FREE_WORD_LIMIT);
return (
<div>
{visible.map((w, i) => (
<div key={i} style={{ background: "#fff", borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: `1.5px solid ${color}22`, marginBottom: 10 }}>
<div style={{ flex: 1 }}>
<div style={{ fontSize: 34, fontWeight: 900, color: palette.dark }}>{w.zh}</div>
<div style={{ fontSize: 12, color: palette.muted }}>{w.zhuyin} • {w.pinyin}</div>
<div style={{ fontSize: 15, fontWeight: 700, color: palette.dark, marginTop: 2 }}>{w.th}</div>
</div>
<SpeakButton text={w.zh} color={color} />
</div>
))}
{locked.length > 0 && (
<>
{locked.map((_, i) => <LockBadge key={i} onUpgrade={onUpgrade} />)}
</>
)}
</div>
);
}

function FlashcardGame({ words, color }) {
const [idx, setIdx] = useState(0); const [flipped, setFlipped] = useState(false); const [score, setScore] = useState(0);
const card = words[idx];
const next = (knew) => { if (knew) setScore(s => s + 1); setFlipped(false); setTimeout(() => setIdx(i => i + 1), 150); };
if (idx >= words.length) return (
<div style={{ textAlign: "center", padding: "40px 20px" }}>
<div style={{ fontSize: 60 }}>🎉</div>
<div style={{ fontSize: 26, fontWeight: 800, color: palette.dark, margin: "12px 0 4px" }}>จบแล้วค่ะ!</div>
<div style={{ color: palette.muted, marginBottom: 24 }}>จำได้ {score}/{words.length} คำ</div>
<button onClick={() => { setIdx(0); setScore(0); setFlipped(false); }} style={{ padding: "12px 32px", borderRadius: 999, background: color, color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>เล่นอีกครั้ง</button>
</div>
);
return (
<div style={{ padding: "8px 0" }}>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
<span style={{ color: palette.muted, fontSize: 13 }}>{idx + 1}/{words.length}</span>
<span style={{ color: color, fontWeight: 700, fontSize: 13 }}>⭐ {score}</span>
</div>
<div style={{ background: "#F0EDE8", borderRadius: 999, height: 5, marginBottom: 20 }}>
<div style={{ background: color, width: `${(idx / words.length) * 100}%`, height: "100%", borderRadius: 999, transition: "width 0.3s" }} />
</div>
<div onClick={() => setFlipped(f => !f)} style={{ background: flipped ? color : "#fff", border: `3px solid ${color}`, borderRadius: 24, padding: "44px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.3s", boxShadow: `0 8px 28px ${color}33`, minHeight: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
{!flipped ? (
<><div style={{ fontSize: 64, fontWeight: 900, color: palette.dark }}>{card.zh}</div>
<div style={{ fontSize: 18, color: palette.muted }}>{card.zhuyin}</div>
<div style={{ fontSize: 12, color: "#bbb", marginTop: 6 }}>แตะเพื่อดูคำตอบ 👆</div>
<div style={{ marginTop: 8 }}><SpeakButton text={card.zh} color={color} /></div></>
) : (
<><div style={{ fontSize: 44, fontWeight: 900, color: "#fff" }}>{card.zh}</div>
<div style={{ fontSize: 26, color: "rgba(255,255,255,0.95)", fontWeight: 700 }}>{card.th}</div>
<div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)" }}>{card.pinyin}</div></>
)}
</div>
{flipped && (
<div style={{ display: "flex", gap: 10, marginTop: 16 }}>
<button onClick={() => next(false)} style={{ flex: 1, padding: 14, borderRadius: 14, background: "#FFE8E8", border: "2px solid #FFB3B3", color: "#E84040", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>😅 ยังไม่รู้</button>
<button onClick={() => next(true)} style={{ flex: 1, padding: 14, borderRadius: 14, background: "#E8FFE8", border: "2px solid #80D980", color: "#2D8A2D", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>✅ รู้แล้ว!</button>
</div>
)}
</div>
);
}

function MatchingGame({ words, color }) {
const pool = words.slice(0, 5);
const [lefts] = useState(() => [...pool].sort(() => Math.random() - 0.5));
const [rights] = useState(() => [...pool].sort(() => Math.random() - 0.5));
const [selL, setSelL] = useState(null); const [selR, setSelR] = useState(null);
const [matched, setMatched] = useState([]); const [wrong, setWrong] = useState([]); const [tries, setTries] = useState(0);
useEffect(() => {
if (selL && selR) {
setTries(t => t + 1);
if (selL === selR) { setMatched(m => [...m, selL]); setSelL(null); setSelR(null); }
else { setWrong([selL, selR]); setTimeout(() => { setWrong([]); setSelL(null); setSelR(null); }, 600); }
}
}, [selL, selR]);
const done = matched.length === pool.length;
const [key, setKey] = useState(0);
const restart = () => { setMatched([]); setWrong([]); setSelL(null); setSelR(null); setTries(0); setKey(k => k + 1); };
return (
<div key={key}>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
<span style={{ color: palette.muted, fontSize: 13 }}>จับคู่ให้ครบ!</span>
<span style={{ color: color, fontWeight: 700, fontSize: 13 }}>🎯 {tries} ครั้ง</span>
</div>
{done ? (
<div style={{ textAlign: "center", padding: "32px 0" }}>
<div style={{ fontSize: 56 }}>🏆</div>
<div style={{ fontSize: 22, fontWeight: 800, color: palette.dark, margin: "10px 0 4px" }}>สำเร็จ!</div>
<div style={{ color: palette.muted, marginBottom: 20 }}>ใช้ {tries} ครั้ง</div>
<button onClick={restart} style={{ padding: "12px 28px", borderRadius: 999, background: color, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>เล่นอีกครั้ง</button>
</div>
) : (
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{lefts.map(w => {
const isM = matched.includes(w.zh), isSel = selL === w.zh, isW = wrong.includes(w.zh);
return <button key={w.zh} disabled={isM} onClick={() => !isM && setSelL(w.zh)} style={{ padding: "12px 8px", borderRadius: 14, border: `2.5px solid ${isM ? "#80D980" : isW ? "#E84040" : isSel ? color : "#E0D8D0"}`, background: isM ? "#E8FFE8" : isW ? "#FFE8E8" : isSel ? `${color}18` : "#fff", fontWeight: 800, fontSize: 20, cursor: isM ? "default" : "pointer", opacity: isM ? 0.5 : 1, transition: "all 0.2s" }}>
{w.zh}<div style={{ fontSize: 10, color: palette.muted, fontWeight: 400 }}>{w.zhuyin}</div>
</button>;
})}
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{rights.map(w => {
const isM = matched.includes(w.zh), isSel = selR === w.zh, isW = wrong.includes(w.zh);
return <button key={w.zh} disabled={isM} onClick={() => !isM && selL && setSelR(w.zh)} style={{ padding: "12px 8px", borderRadius: 14, border: `2.5px solid ${isM ? "#80D980" : isW ? "#E84040" : isSel ? color : "#E0D8D0"}`, background: isM ? "#E8FFE8" : isW ? "#FFE8E8" : isSel ? `${color}18` : "#fff", fontWeight: 600, fontSize: 13, cursor: isM ? "default" : !selL ? "not-allowed" : "pointer", opacity: isM ? 0.5 : !selL ? 0.6 : 1, transition: "all 0.2s" }}>
{w.th}
</button>;
})}
</div>
</div>
)}
</div>
);
}

// ===================== AI CHATBOT =====================
function AIChatbot({ isPremium, onUpgrade }) {
const [messages, setMessages] = useState([{ role: "assistant", content: `สวัสดีค่ะ! 你好! 😊\nฉันคือครู AI สอนภาษาจีนค่ะ\n\nถามได้เลยนะคะ เช่น\n• "คำว่า 謝謝 แปลว่าอะไร?"\n• "ช่วยสร้างประโยคตัวอย่าง"\n• "วรรณยุกต์จีนมีกี่เสียง?"` }]);
const [input, setInput] = useState(""); const [loading, setLoading] = useState(false);
const [msgCount, setMsgCount] = useState(0);
const bottomRef = useRef(null);
useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

const send = async () => {
if (!input.trim() || loading) return;
if (!isPremium && msgCount >= FREE_MSG_LIMIT) { onUpgrade(); return; }
const text = input.trim(); setInput("");
setMessages(p => [...p, { role: "user", content: text }]);
setMsgCount(c => c + 1); setLoading(true);
try {
const res = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: {
"Content-Type": "application/json",
"x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
"anthropic-version": "2023-06-01",
"anthropic-dangerous-direct-browser-access": "true",
},
body: JSON.stringify({
model: "claude-sonnet-4-20250514", max_tokens: 1000,
system: "คุณคือครูสอนภาษาจีนสำหรับนักเรียนไทย ตอบเป็นภาษาไทยเสมอ แสดงตัวอักษรจีน จู้อิน พินอิน และคำแปลไทยในคำตอบ ใช้ emoji ให้สนุก ตอบกระชับ 3-4 ประโยค",
messages: messages.slice(1).concat([{ role: "user", content: text }]).map(m => ({ role: m.role, content: m.content }))
})
});
const data = await res.json();
setMessages(p => [...p, { role: "assistant", content: data.content?.[0]?.text || "ขอโทษค่ะ ลองใหม่นะคะ" }]);
} catch(err) { setMessages(p => [...p, { role: "assistant", content: `Error: ${err.message}` }]); }

finally { setLoading(false); }
};

const quickQ = ["วรรณยุกต์ 4 เสียง", "ทักทายพื้นฐาน 5 ประโยค", "คำว่า 愛 ใช้ยังไง"];

return (
<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
{!isPremium && (
<div style={{ margin: "12px 16px 0", padding: "10px 14px", background: "#FFF8E1", borderRadius: 12, border: "1.5px solid #F5A62344", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<span style={{ fontSize: 13, color: palette.muted }}>ใช้ได้ฟรี {Math.max(0, FREE_MSG_LIMIT - msgCount)}/{FREE_MSG_LIMIT} ครั้ง</span>
<button onClick={onUpgrade} style={{ background: palette.gold, color: "#fff", border: "none", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>👑 Premium</button>
</div>
)}
<div style={{ padding: "10px 16px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
{quickQ.map((q, i) => <button key={i} onClick={() => setInput(q)} style={{ padding: "5px 10px", borderRadius: 999, background: "#FFF0E8", border: "1.5px solid #F5A62333", color: palette.muted, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>{q}</button>)}
</div>
<div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
{messages.map((m, i) => (
<div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 6 }}>
{m.role === "assistant" && <span style={{ fontSize: 24 }}>🤖</span>}
<div style={{ maxWidth: "78%", padding: "11px 14px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? palette.red : "#fff", color: m.role === "user" ? "#fff" : palette.dark, fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: m.role === "assistant" ? "1.5px solid #F0EDE8" : "none" }}>
{m.content}
</div>
</div>
))}
{loading && (
<div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
<span style={{ fontSize: 24 }}>🤖</span>
<div style={{ padding: "11px 16px", borderRadius: "18px 18px 18px 4px", background: "#fff", border: "1.5px solid #F0EDE8" }}>
{[0,1,2].map(i => <span key={i} style={{ display: "inline-block", width: 6, height: 6, background: "#ccc", borderRadius: "50%", margin: "0 2px", animation: `bounce 0.9s ${i*0.2}s infinite` }} />)}
</div>
</div>
)}
<div ref={bottomRef} />
</div>
<div style={{ padding: "10px 14px", borderTop: "1.5px solid #F0EDE8", display: "flex", gap: 8, background: "#fff" }}>
<input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={!isPremium && msgCount >= FREE_MSG_LIMIT ? "อัปเกรดเพื่อคุยต่อ..." : "ถามครู AI ได้เลยค่ะ..."}
disabled={!isPremium && msgCount >= FREE_MSG_LIMIT}
style={{ flex: 1, padding: "11px 14px", borderRadius: 999, border: "2px solid #F0EDE8", fontSize: 13, outline: "none", fontFamily: "inherit", background: palette.bg }} />
<button onClick={send} disabled={loading || !input.trim()} style={{ width: 42, height: 42, borderRadius: "50%", background: input.trim() ? palette.red : "#F0EDE8", border: "none", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
</div>
</div>
);
}

// ===================== PREMIUM MODAL =====================
function PremiumModal({ onClose, onUpgrade }) {
return (
<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
<div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 480 }}>
<div style={{ textAlign: "center", marginBottom: 20 }}>
<div style={{ fontSize: 48 }}>👑</div>
<h2 style={{ fontSize: 22, fontWeight: 900, color: palette.dark, margin: "8px 0 4px" }}>Premium</h2>
<p style={{ color: palette.muted, fontSize: 14 }}>ปลดล็อคทุกฟีเจอร์</p>
</div>
{[
["📚", "คำศัพท์ครบ 200+ คำ"],
["🔊", "เสียงออกเสียงไม่จำกัด"],
["🤖", "ถาม AI ครูได้ไม่จำกัด"],
["🎮", "เกมทุกโหมดไม่จำกัด"],
["📊", "ติดตาม Streak รายวัน"],
].map(([icon, text], i) => (
<div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid #F0EDE8" : "none" }}>
<span style={{ fontSize: 22 }}>{icon}</span>
<span style={{ fontSize: 15, color: palette.dark, fontWeight: 600 }}>{text}</span>
</div>
))}
<div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
<button onClick={onUpgrade} style={{ width: "100%", padding: "16px 20px", borderRadius: 16, background: "linear-gradient(135deg,#E8433A,#F5A623)", color: "#fff", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<div style={{ textAlign: "left" }}><div>📅 รายเดือน</div><div style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>ยกเลิกได้ทุกเมื่อ</div></div>
<div style={{ textAlign: "right" }}><div style={{ fontSize: 22 }}>99 บาท</div><div style={{ fontSize: 11, opacity: 0.85 }}>/เดือน</div></div>
</button>
<div style={{ position: "relative" }}>
<div style={{ position: "absolute", top: -10, right: 16, background: "#4ECDC4", color: "#fff", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700, zIndex: 1 }}>⭐ แนะนำ ประหยัด 34%</div>
<button onClick={onUpgrade} style={{ width: "100%", padding: "16px 20px", borderRadius: 16, background: "#fff", border: "3px solid #4ECDC4", color: palette.dark, fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<div style={{ textAlign: "left" }}><div>📆 รายปี</div><div style={{ fontSize: 12, fontWeight: 500, color: palette.muted }}>เทียบเท่า 66 บาท/เดือน</div></div>
<div style={{ textAlign: "right" }}><div style={{ fontSize: 22, color: "#4ECDC4" }}>790 บาท</div><div style={{ fontSize: 11, color: palette.muted }}>/ปี</div></div>
</button>
</div>
<button onClick={onUpgrade} style={{ width: "100%", padding: "16px 20px", borderRadius: 16, background: "#FFF8E1", border: "2px solid #F5A623", color: palette.dark, fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<div style={{ textAlign: "left" }}><div>♾️ ตลอดชีพ</div><div style={{ fontSize: 12, fontWeight: 500, color: palette.muted }}>จ่ายครั้งเดียว ใช้ได้เลย</div></div>
<div style={{ textAlign: "right" }}><div style={{ fontSize: 22, color: palette.gold }}>1,490 บาท</div><div style={{ fontSize: 11, color: palette.muted }}>ครั้งเดียว</div></div>
</button>
</div>
<button onClick={onClose} style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 16, background: "none", border: "none", color: palette.muted, fontSize: 14, cursor: "pointer" }}>ใช้ฟรีก่อน</button>
</div>
</div>
);
}

// ===================== MAIN APP =====================
export default function App() {
const [screen, setScreen] = useState("home"); // home | category | chat
const [activeCat, setActiveCat] = useState(null);
const [catTab, setCatTab] = useState("vocab");
const [isPremium, setIsPremium] = useState(false);
const [showPremium, setShowPremium] = useState(false);

const cat = categories.find(c => c.id === activeCat);

// HOME
if (screen === "home") return (
<div style={{ minHeight: "100vh", background: palette.bg, fontFamily: "'Noto Sans TC','Noto Sans Thai',sans-serif" }}>
<div style={{ background: "linear-gradient(135deg,#E8433A,#F5A623)", padding: "44px 20px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
<div style={{ position: "absolute", top: -10, right: 10, fontSize: 110, opacity: 0.12 }}>學</div>
<div style={{ fontSize: 44, marginBottom: 6 }}>🀄</div>
<h1 style={{ color: "#fff", fontSize: 30, fontWeight: 900, margin: "0 0 6px" }}>เรียนภาษาจีน</h1>
<p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, margin: 0 }}>有声音 • มีเสียง • มี AI ครู</p>
{!isPremium && (
<button onClick={() => setShowPremium(true)} style={{ marginTop: 16, padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.5)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
👑 อัปเกรด Premium
</button>
)}
{isPremium && <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>👑 Premium Member</div>}
</div>

  <div style={{ padding: "0 16px", marginTop: -28 }}>
    {categories.map(c => (
      <button key={c.id} onClick={() => { setActiveCat(c.id); setCatTab("vocab"); setScreen("category"); }}
        style={{ width: "100%", background: c.bg, border: `3px solid ${c.color}`, borderRadius: 22, padding: "20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left", marginBottom: 12, boxShadow: `0 4px 20px ${c.color}22` }}>
        <span style={{ fontSize: 38 }}>{c.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: palette.dark }}>{c.label}</div>
          <div style={{ fontSize: 12, color: palette.muted, marginTop: 2 }}>{isPremium ? `${c.words.length} คำ` : `ฟรี ${FREE_WORD_LIMIT} คำ / ทั้งหมด ${c.words.length} คำ`}</div>
        </div>
        <span style={{ color: c.color, fontSize: 20 }}>›</span>
      </button>
    ))}

    {/* AI Chat button */}
    <button onClick={() => setScreen("chat")} style={{ width: "100%", background: "linear-gradient(135deg,#9B59B6,#E8433A)", borderRadius: 22, padding: "20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left", border: "none", marginBottom: 24 }}>
      <span style={{ fontSize: 38 }}>🤖</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>ถาม AI ครู</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{isPremium ? "ถามได้ไม่จำกัด" : `ฟรี ${FREE_MSG_LIMIT} ครั้ง`}</div>
      </div>
      <span style={{ color: "#fff", fontSize: 20 }}>›</span>
    </button>
  </div>

  {showPremium && <PremiumModal onClose={() => setShowPremium(false)} onUpgrade={() => { setIsPremium(true); setShowPremium(false); }} />}
</div>

);

// CATEGORY
if (screen === "category" && cat) return (
<div style={{ minHeight: "100vh", background: cat.bg, fontFamily: "'Noto Sans TC','Noto Sans Thai',sans-serif" }}>
<div style={{ background: `linear-gradient(135deg,${cat.color},${cat.color}99)`, padding: "28px 16px 44px", position: "relative", overflow: "hidden" }}>
<button onClick={() => setScreen("home")} style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: 999, padding: "7px 14px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13, marginBottom: 14 }}>← กลับ</button>
<div style={{ position: "absolute", top: 0, right: 12, fontSize: 90, opacity: 0.13 }}>{cat.emoji}</div>
<h2 style={{ color: "#fff", fontSize: 26, fontWeight: 900, margin: "0 0 3px" }}>{cat.emoji} {cat.label}</h2>
</div>

  <div style={{ display: "flex", margin: "0 16px", marginTop: -20, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}>
    {[{ id: "vocab", label: "📖 คำศัพท์" }, { id: "flashcard", label: "🃏 Flashcard" }, { id: "match", label: "🎯 จับคู่" }].map(t => (
      <button key={t.id} onClick={() => setCatTab(t.id)} style={{ flex: 1, padding: "13px 6px", border: "none", background: catTab === t.id ? cat.color : "#fff", color: catTab === t.id ? "#fff" : palette.muted, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
    ))}
  </div>

  <div style={{ padding: "16px" }}>
    {catTab === "vocab" && <VocabList words={cat.words} isPremium={isPremium} color={cat.color} onUpgrade={() => setShowPremium(true)} />}
    {catTab === "flashcard" && <FlashcardGame key={cat.id} words={isPremium ? cat.words : cat.words.slice(0, FREE_WORD_LIMIT)} color={cat.color} />}
    {catTab === "match" && <MatchingGame key={cat.id} words={isPremium ? cat.words : cat.words.slice(0, FREE_WORD_LIMIT)} color={cat.color} />}
    {!isPremium && catTab !== "vocab" && (
      <div onClick={() => setShowPremium(true)} style={{ marginTop: 16, padding: "14px", background: "#FFF8E1", borderRadius: 16, border: "1.5px dashed #F5A623", textAlign: "center", cursor: "pointer" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: palette.dark }}>👑 อัปเกรดเพื่อเล่นกับคำศัพท์ครบทุกคำ</div>
      </div>
    )}
  </div>

  {showPremium && <PremiumModal onClose={() => setShowPremium(false)} onUpgrade={() => { setIsPremium(true); setShowPremium(false); }} />}
</div>

);

// CHAT
if (screen === "chat") return (
<div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans TC','Noto Sans Thai',sans-serif", background: "#fff" }}>
<div style={{ background: "linear-gradient(135deg,#9B59B6,#E8433A)", padding: "28px 16px 20px" }}>
<button onClick={() => setScreen("home")} style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: 999, padding: "7px 14px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13, marginBottom: 12 }}>← กลับ</button>
<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
<span style={{ fontSize: 36 }}>🤖</span>
<div>
<div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>ครู AI ภาษาจีน</div>
<div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>ถามได้ทุกเรื่องภาษาจีน</div>
</div>
</div>
</div>
<div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
<AIChatbot isPremium={isPremium} onUpgrade={() => setShowPremium(true)} />
</div>
{showPremium && <PremiumModal onClose={() => setShowPremium(false)} onUpgrade={() => { setIsPremium(true); setShowPremium(false); }} />}
</div>
);

return null;
}