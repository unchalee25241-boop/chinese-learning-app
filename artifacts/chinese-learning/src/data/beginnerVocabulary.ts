// src/data/beginnerVocabulary.ts
// NEW FILE — ส่งมาทีละหมวด จะ append เพิ่มในไฟล์เดียวกัน

export interface BeginnerWord {
  zh: string;
  zhSimplified?: string;
  zhCN?: string;
  zhuyin: string;
  pinyin: string;
  pinyinCN?: string;
  th: string;
  examples?: {
    zh: string;
    zhCN?: string;
    zhuyin: string;
    pinyin: string;
    th: string;
  }[];
}

export interface BeginnerCategory {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  words: BeginnerWord[];
}

export const beginnerCategories: BeginnerCategory[] = [
  {
    id: "animals", label: "สัตว์", emoji: "🐱", color: "#FF8C42", bg: "#FFF5EE",
    words: [
      // 🐾 สัตว์เลี้ยง
      { zh: "貓", zhSimplified: "猫", zhuyin: "ㄇㄠ", pinyin: "māo", th: "แมว", examples: [{ zh: "這隻貓很可愛", zhCN: "这只猫很可爱", zhuyin: "ㄓㄜˋ ㄓ ㄇㄠ ㄏㄣˇ ㄎㄜˇ ㄞˋ", pinyin: "zhè zhī māo hěn kě ài", th: "แมวตัวนี้น่ารักมาก" }] },
      { zh: "狗", zhuyin: "ㄍㄡˇ", pinyin: "gǒu", th: "สุนัข / หมา", examples: [{ zh: "我家有一隻狗", zhCN: "我家有一只狗", zhuyin: "ㄨㄛˇ ㄐㄧㄚ ㄧㄡˇ ㄧ ㄓ ㄍㄡˇ", pinyin: "wǒ jiā yǒu yī zhī gǒu", th: "บ้านฉันมีสุนัขหนึ่งตัว" }] },
      { zh: "魚", zhSimplified: "鱼", zhuyin: "ㄩˊ", pinyin: "yú", th: "ปลา", examples: [{ zh: "我喜歡養魚", zhCN: "我喜欢养鱼", zhuyin: "ㄨㄛˇ ㄒㄧˇ ㄏㄨㄢ ㄧㄤˇ ㄩˊ", pinyin: "wǒ xǐ huān yǎng yú", th: "ฉันชอบเลี้ยงปลา" }] },
      { zh: "兔子", zhSimplified: "兔子", zhuyin: "ㄊㄨˋ ㄗ˙", pinyin: "tù zi", th: "กระต่าย", examples: [{ zh: "兔子的耳朵很長", zhCN: "兔子的耳朵很长", zhuyin: "ㄊㄨˋ ㄗ˙ ㄉㄜ˙ ㄦˇ ㄉㄨㄛ ㄏㄣˇ ㄔㄤˊ", pinyin: "tù zi de ěr duǒ hěn cháng", th: "หูของกระต่ายยาวมาก" }] },
      { zh: "倉鼠", zhSimplified: "仓鼠", zhuyin: "ㄘㄤ ㄕㄨˇ", pinyin: "cāng shǔ", th: "แฮมสเตอร์", examples: [{ zh: "倉鼠很小，很可愛", zhCN: "仓鼠很小，很可爱", zhuyin: "ㄘㄤ ㄕㄨˇ ㄏㄣˇ ㄒㄧㄠˇ ㄏㄣˇ ㄎㄜˇ ㄞˋ", pinyin: "cāng shǔ hěn xiǎo, hěn kě ài", th: "แฮมสเตอร์ตัวเล็กน่ารักมาก" }] },
      { zh: "鸚鵡", zhSimplified: "鹦鹉", zhuyin: "ㄧㄥ ㄨˇ", pinyin: "yīng wǔ", th: "นกแก้ว", examples: [{ zh: "鸚鵡會說話", zhCN: "鹦鹉会说话", zhuyin: "ㄧㄥ ㄨˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄏㄨㄚˋ", pinyin: "yīng wǔ huì shuō huà", th: "นกแก้วพูดได้" }] },
      { zh: "烏龜", zhSimplified: "乌龟", zhuyin: "ㄨ ㄍㄨㄟ", pinyin: "wū guī", th: "เต่า", examples: [{ zh: "烏龜走路很慢", zhCN: "乌龟走路很慢", zhuyin: "ㄨ ㄍㄨㄟ ㄗㄡˇ ㄌㄨˋ ㄏㄣˇ ㄇㄢˋ", pinyin: "wū guī zǒu lù hěn màn", th: "เต่าเดินช้ามาก" }] },
      { zh: "蛇", zhuyin: "ㄕㄜˊ", pinyin: "shé", th: "งู", examples: [{ zh: "我很怕蛇", zhCN: "我很怕蛇", zhuyin: "ㄨㄛˇ ㄏㄣˇ ㄆㄚˋ ㄕㄜˊ", pinyin: "wǒ hěn pà shé", th: "ฉันกลัวงูมาก" }] },
      { zh: "老鼠", zhSimplified: "老鼠", zhuyin: "ㄌㄠˇ ㄕㄨˇ", pinyin: "lǎo shǔ", th: "หนู", examples: [{ zh: "老鼠偷吃東西", zhCN: "老鼠偷吃东西", zhuyin: "ㄌㄠˇ ㄕㄨˇ ㄊㄡ ㄔ ㄉㄨㄥ ㄒㄧ", pinyin: "lǎo shǔ tōu chī dōng xi", th: "หนูขโมยกินของ" }] },
      { zh: "蝸牛", zhSimplified: "蜗牛", zhuyin: "ㄨㄛ ㄋㄧㄡˊ", pinyin: "wō niú", th: "หอยทาก", examples: [{ zh: "蝸牛背著殼走路", zhCN: "蜗牛背着壳走路", zhuyin: "ㄨㄛ ㄋㄧㄡˊ ㄅㄟˋ ㄓㄜ ㄎㄜˊ ㄗㄡˇ ㄌㄨˋ", pinyin: "wō niú bèi zhe ké zǒu lù", th: "หอยทากแบกเปลือกเดิน" }] },

      // 🐄 สัตว์ฟาร์ม
      { zh: "豬", zhSimplified: "猪", zhuyin: "ㄓㄨ", pinyin: "zhū", th: "หมู", examples: [{ zh: "豬很愛睡覺", zhCN: "猪很爱睡觉", zhuyin: "ㄓㄨ ㄏㄣˇ ㄞˋ ㄕㄨㄟˋ ㄐㄧㄠˋ", pinyin: "zhū hěn ài shuì jiào", th: "หมูชอบนอนมาก" }] },
      { zh: "牛", zhuyin: "ㄋㄧㄡˊ", pinyin: "niú", th: "วัว", examples: [{ zh: "牛在田裡工作", zhCN: "牛在田里工作", zhuyin: "ㄋㄧㄡˊ ㄗㄞˋ ㄊㄧㄢˊ ㄌㄧˇ ㄍㄨㄥ ㄗㄨㄛˋ", pinyin: "niú zài tián lǐ gōng zuò", th: "วัวทำงานในนา" }] },
      { zh: "雞", zhSimplified: "鸡", zhuyin: "ㄐㄧ", pinyin: "jī", th: "ไก่", examples: [{ zh: "雞每天早上叫", zhCN: "鸡每天早上叫", zhuyin: "ㄐㄧ ㄇㄟˇ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄐㄧㄠˋ", pinyin: "jī měi tiān zǎo shàng jiào", th: "ไก่ร้องทุกเช้า" }] },
      { zh: "羊", zhuyin: "ㄧㄤˊ", pinyin: "yáng", th: "แกะ", examples: [{ zh: "羊的毛很軟", zhCN: "羊的毛很软", zhuyin: "ㄧㄤˊ ㄉㄜ˙ ㄇㄠˊ ㄏㄣˇ ㄖㄨㄢˇ", pinyin: "yáng de máo hěn ruǎn", th: "ขนแกะนุ่มมาก" }] },
      { zh: "馬", zhSimplified: "马", zhuyin: "ㄇㄚˇ", pinyin: "mǎ", th: "ม้า", examples: [{ zh: "馬跑得很快", zhCN: "马跑得很快", zhuyin: "ㄇㄚˇ ㄆㄠˇ ㄉㄜ˙ ㄏㄣˇ ㄎㄨㄞˋ", pinyin: "mǎ pǎo de hěn kuài", th: "ม้าวิ่งเร็วมาก" }] },
      { zh: "鴨", zhSimplified: "鸭", zhuyin: "ㄧㄚ", pinyin: "yā", th: "เป็ด", examples: [{ zh: "鴨子在水裡游", zhCN: "鸭子在水里游", zhuyin: "ㄧㄚ ㄗ˙ ㄗㄞˋ ㄕㄨㄟˇ ㄌㄧˇ ㄧㄡˊ", pinyin: "yā zi zài shuǐ lǐ yóu", th: "เป็ดว่ายน้ำอยู่" }] },
      { zh: "鵝", zhSimplified: "鹅", zhuyin: "ㄜˊ", pinyin: "é", th: "ห่าน", examples: [{ zh: "鵝的脖子很長", zhCN: "鹅的脖子很长", zhuyin: "ㄜˊ ㄉㄜ˙ ㄅㄛˊ ㄗ˙ ㄏㄣˇ ㄔㄤˊ", pinyin: "é de bó zi hěn cháng", th: "ห่านมีคอยาวมาก" }] },
      { zh: "驢", zhSimplified: "驴", zhuyin: "ㄌㄩˊ", pinyin: "lǘ", th: "ลา", examples: [{ zh: "驢子幫農夫搬東西", zhCN: "驴子帮农夫搬东西", zhuyin: "ㄌㄩˊ ㄗ˙ ㄅㄤ ㄋㄨㄥˊ ㄈㄨ ㄅㄢ ㄉㄨㄥ ㄒㄧ", pinyin: "lǘ zi bāng nóng fū bān dōng xi", th: "ลาช่วยชาวนาแบกของ" }] },
      { zh: "山羊", zhuyin: "ㄕㄢ ㄧㄤˊ", pinyin: "shān yáng", th: "แพะ", examples: [{ zh: "山羊喜歡爬山", zhCN: "山羊喜欢爬山", zhuyin: "ㄕㄢ ㄧㄤˊ ㄒㄧˇ ㄏㄨㄢ ㄆㄚˊ ㄕㄢ", pinyin: "shān yáng xǐ huān pá shān", th: "แพะชอบปีนเขา" }] },
      { zh: "兔", zhuyin: "ㄊㄨˋ", pinyin: "tù", th: "กระต่าย (ทั่วไป)", examples: [{ zh: "白兔在草地上跑", zhCN: "白兔在草地上跑", zhuyin: "ㄅㄞˊ ㄊㄨˋ ㄗㄞˋ ㄘㄠˇ ㄉㄧˋ ㄕㄤˋ ㄆㄠˇ", pinyin: "bái tù zài cǎo dì shàng pǎo", th: "กระต่ายขาววิ่งบนสนามหญ้า" }] },

      // 🦁 สัตว์ป่า
      { zh: "老虎", zhSimplified: "老虎", zhuyin: "ㄌㄠˇ ㄏㄨˇ", pinyin: "lǎo hǔ", th: "เสือ", examples: [{ zh: "老虎是危險的動物", zhCN: "老虎是危险的动物", zhuyin: "ㄌㄠˇ ㄏㄨˇ ㄕˋ ㄨㄟˊ ㄒㄧㄢˇ ㄉㄜ˙ ㄉㄨㄥˋ ㄨˋ", pinyin: "lǎo hǔ shì wéi xiǎn de dòng wù", th: "เสือเป็นสัตว์อันตราย" }] },
      { zh: "獅子", zhSimplified: "狮子", zhuyin: "ㄕ ㄗ˙", pinyin: "shī zi", th: "สิงโต", examples: [{ zh: "獅子是森林之王", zhCN: "狮子是森林之王", zhuyin: "ㄕ ㄗ˙ ㄕˋ ㄙㄣ ㄌㄧㄣˊ ㄓ ㄨㄤˊ", pinyin: "shī zi shì sēn lín zhī wáng", th: "สิงโตคือราชาแห่งป่า" }] },
      { zh: "大象", zhuyin: "ㄉㄚˋ ㄒㄧㄤˋ", pinyin: "dà xiàng", th: "ช้าง", examples: [{ zh: "大象的鼻子很長", zhCN: "大象的鼻子很长", zhuyin: "ㄉㄚˋ ㄒㄧㄤˋ ㄉㄜ˙ ㄅㄧˊ ㄗ˙ ㄏㄣˇ ㄔㄤˊ", pinyin: "dà xiàng de bí zi hěn cháng", th: "งวงช้างยาวมาก" }] },
      { zh: "長頸鹿", zhSimplified: "长颈鹿", zhuyin: "ㄓㄤˇ ㄐㄧㄥˇ ㄌㄨˋ", pinyin: "zhǎng jǐng lù", th: "ยีราฟ", examples: [{ zh: "長頸鹿的脖子很長", zhCN: "长颈鹿的脖子很长", zhuyin: "ㄓㄤˇ ㄐㄧㄥˇ ㄌㄨˋ ㄉㄜ˙ ㄅㄛˊ ㄗ˙ ㄏㄣˇ ㄔㄤˊ", pinyin: "zhǎng jǐng lù de bó zi hěn cháng", th: "ยีราฟมีคอยาวมาก" }] },
      { zh: "斑馬", zhSimplified: "斑马", zhuyin: "ㄅㄢ ㄇㄚˇ", pinyin: "bān mǎ", th: "ม้าลาย", examples: [{ zh: "斑馬有黑白條紋", zhCN: "斑马有黑白条纹", zhuyin: "ㄅㄢ ㄇㄚˇ ㄧㄡˇ ㄏㄟ ㄅㄞˊ ㄊㄧㄠˊ ㄨㄣˊ", pinyin: "bān mǎ yǒu hēi bái tiáo wén", th: "ม้าลายมีลายขาวดำ" }] },
      { zh: "熊貓", zhSimplified: "熊猫", zhuyin: "ㄒㄩㄥˊ ㄇㄠ", pinyin: "xióng māo", th: "แพนด้า", examples: [{ zh: "熊貓只吃竹子", zhCN: "熊猫只吃竹子", zhuyin: "ㄒㄩㄥˊ ㄇㄠ ㄓˇ ㄔ ㄓㄨˊ ㄗ˙", pinyin: "xióng māo zhǐ chī zhú zi", th: "แพนด้ากินแต่ไผ่" }] },
      { zh: "熊", zhuyin: "ㄒㄩㄥˊ", pinyin: "xióng", th: "หมี", examples: [{ zh: "熊冬天會冬眠", zhCN: "熊冬天会冬眠", zhuyin: "ㄒㄩㄥˊ ㄉㄨㄥ ㄊㄧㄢ ㄏㄨㄟˋ ㄉㄨㄥ ㄇㄧㄢˊ", pinyin: "xióng dōng tiān huì dōng mián", th: "หมีจำศีลในฤดูหนาว" }] },
      { zh: "猴子", zhSimplified: "猴子", zhuyin: "ㄏㄡˊ ㄗ˙", pinyin: "hóu zi", th: "ลิง", examples: [{ zh: "猴子很喜歡吃香蕉", zhCN: "猴子很喜欢吃香蕉", zhuyin: "ㄏㄡˊ ㄗ˙ ㄏㄣˇ ㄒㄧˇ ㄏㄨㄢ ㄔ ㄒㄧㄤ ㄐㄧㄠ", pinyin: "hóu zi hěn xǐ huān chī xiāng jiāo", th: "ลิงชอบกินกล้วยมาก" }] },
      { zh: "狐狸", zhSimplified: "狐狸", zhuyin: "ㄏㄨˊ ㄌㄧ˙", pinyin: "hú li", th: "สุนัขจิ้งจอก", examples: [{ zh: "狐狸很聰明", zhCN: "狐狸很聪明", zhuyin: "ㄏㄨˊ ㄌㄧ˙ ㄏㄣˇ ㄘㄨㄥ ㄇㄧㄥˊ", pinyin: "hú li hěn cōng míng", th: "สุนัขจิ้งจอกฉลาดมาก" }] },
      { zh: "狼", zhuyin: "ㄌㄤˊ", pinyin: "láng", th: "หมาป่า", examples: [{ zh: "狼在夜晚嚎叫", zhCN: "狼在夜晚嚎叫", zhuyin: "ㄌㄤˊ ㄗㄞˋ ㄧㄝˋ ㄨㄢˇ ㄏㄠˊ ㄐㄧㄠˋ", pinyin: "láng zài yè wǎn háo jiào", th: "หมาป่าหอนในยามค่ำคืน" }] },
      { zh: "鹿", zhuyin: "ㄌㄨˋ", pinyin: "lù", th: "กวาง", examples: [{ zh: "鹿有漂亮的角", zhCN: "鹿有漂亮的角", zhuyin: "ㄌㄨˋ ㄧㄡˇ ㄆㄧㄠˋ ㄌㄧㄤˋ ㄉㄜ˙ ㄐㄧㄠˇ", pinyin: "lù yǒu piào liàng de jiǎo", th: "กวางมีเขาสวยงาม" }] },
      { zh: "豹", zhuyin: "ㄅㄠˋ", pinyin: "bào", th: "เสือดาว", examples: [{ zh: "豹跑得非常快", zhCN: "豹跑得非常快", zhuyin: "ㄅㄠˋ ㄆㄠˇ ㄉㄜ˙ ㄈㄟ ㄔㄤˊ ㄎㄨㄞˋ", pinyin: "bào pǎo de fēi cháng kuài", th: "เสือดาววิ่งเร็วมาก" }] },
      { zh: "河馬", zhSimplified: "河马", zhuyin: "ㄏㄜˊ ㄇㄚˇ", pinyin: "hé mǎ", th: "ฮิปโป", examples: [{ zh: "河馬喜歡待在水裡", zhCN: "河马喜欢待在水里", zhuyin: "ㄏㄜˊ ㄇㄚˇ ㄒㄧˇ ㄏㄨㄢ ㄉㄞ ㄗㄞˋ ㄕㄨㄟˇ ㄌㄧˇ", pinyin: "hé mǎ xǐ huān dāi zài shuǐ lǐ", th: "ฮิปโปชอบอยู่ในน้ำ" }] },
      { zh: "犀牛", zhSimplified: "犀牛", zhuyin: "ㄒㄧ ㄋㄧㄡˊ", pinyin: "xī niú", th: "แรด", examples: [{ zh: "犀牛的皮膚很厚", zhCN: "犀牛的皮肤很厚", zhuyin: "ㄒㄧ ㄋㄧㄡˊ ㄉㄜ˙ ㄆㄧˊ ㄈㄨ ㄏㄣˇ ㄏㄡˋ", pinyin: "xī niú de pí fū hěn hòu", th: "ผิวหนังของแรดหนามาก" }] },
      { zh: "袋鼠", zhSimplified: "袋鼠", zhuyin: "ㄉㄞˋ ㄕㄨˇ", pinyin: "dài shǔ", th: "จิงโจ้", examples: [{ zh: "袋鼠媽媽把寶寶放在袋子裡", zhCN: "袋鼠妈妈把宝宝放在袋子里", zhuyin: "ㄉㄞˋ ㄕㄨˇ ㄇㄚ ㄇㄚ ㄅㄚˇ ㄅㄠˇ ㄅㄠ ㄈㄤˋ ㄗㄞˋ ㄉㄞˋ ㄗ˙ ㄌㄧˇ", pinyin: "dài shǔ mā ma bǎ bǎo bao fàng zài dài zi lǐ", th: "จิงโจ้แม่ใส่ลูกไว้ในถุง" }] },
      { zh: "北極熊", zhSimplified: "北极熊", zhuyin: "ㄅㄟˇ ㄐㄧˊ ㄒㄩㄥˊ", pinyin: "běi jí xióng", th: "หมีขั้วโลก", examples: [{ zh: "北極熊住在很冷的地方", zhCN: "北极熊住在很冷的地方", zhuyin: "ㄅㄟˇ ㄐㄧˊ ㄒㄩㄥˊ ㄓㄨˋ ㄗㄞˋ ㄏㄣˇ ㄌㄥˇ ㄉㄜ˙ ㄉㄧˋ ㄈㄤ", pinyin: "běi jí xióng zhù zài hěn lěng de dì fāng", th: "หมีขั้วโลกอาศัยอยู่ในที่หนาวมาก" }] },
      { zh: "大猩猩", zhSimplified: "大猩猩", zhuyin: "ㄉㄚˋ ㄒㄧㄥ ㄒㄧㄥ", pinyin: "dà xīng xīng", th: "กอริลลา", examples: [{ zh: "大猩猩力氣很大", zhCN: "大猩猩力气很大", zhuyin: "ㄉㄚˋ ㄒㄧㄥ ㄒㄧㄥ ㄌㄧˋ ㄑㄧˋ ㄏㄣˇ ㄉㄚˋ", pinyin: "dà xīng xīng lì qì hěn dà", th: "กอริลลามีพลังมาก" }] },
      { zh: "駱駝", zhSimplified: "骆驼", zhuyin: "ㄌㄨㄛˋ ㄊㄨㄛ˙", pinyin: "luò tuó", th: "อูฐ", examples: [{ zh: "駱駝能在沙漠生存", zhCN: "骆驼能在沙漠生存", zhuyin: "ㄌㄨㄛˋ ㄊㄨㄛ˙ ㄋㄥˊ ㄗㄞˋ ㄕㄚ ㄇㄛˋ ㄕㄥ ㄘㄨㄣˊ", pinyin: "luò tuó néng zài shā mò shēng cún", th: "อูฐสามารถอยู่รอดในทะเลทรายได้" }] },
      { zh: "狐獴", zhSimplified: "猫鼬", zhuyin: "ㄇㄠ ㄧㄡˋ", pinyin: "māo yòu", th: "มีร์แคต", examples: [{ zh: "猫鼬站著警戒", zhCN: "猫鼬站着警戒", zhuyin: "ㄇㄠ ㄧㄡˋ ㄓㄢˋ ㄓㄜ˙ ㄐㄧㄥˇ ㄐㄧㄝˋ", pinyin: "māo yòu zhàn zhe jǐng jiè", th: "มีร์แคตยืนเฝ้าระวัง" }] },

      // 🦅 นก
      { zh: "鳥", zhSimplified: "鸟", zhuyin: "ㄋㄧㄠˇ", pinyin: "niǎo", th: "นก", examples: [{ zh: "鳥在天空飛翔", zhCN: "鸟在天空飞翔", zhuyin: "ㄋㄧㄠˇ ㄗㄞˋ ㄊㄧㄢ ㄎㄨㄥ ㄈㄟ ㄒㄧㄤˊ", pinyin: "niǎo zài tiān kōng fēi xiáng", th: "นกบินอยู่บนท้องฟ้า" }] },
      { zh: "老鷹", zhSimplified: "老鹰", zhuyin: "ㄌㄠˇ ㄧㄥ", pinyin: "lǎo yīng", th: "นกอินทรี", examples: [{ zh: "老鷹飛得很高", zhCN: "老鹰飞得很高", zhuyin: "ㄌㄠˇ ㄧㄥ ㄈㄟ ㄉㄜ˙ ㄏㄣˇ ㄍㄠ", pinyin: "lǎo yīng fēi de hěn gāo", th: "นกอินทรีบินสูงมาก" }] },
      { zh: "企鵝", zhSimplified: "企鹅", zhuyin: "ㄑㄧˇ ㄜˊ", pinyin: "qǐ é", th: "เพนกวิน", examples: [{ zh: "企鵝不會飛但會游泳", zhCN: "企鹅不会飞但会游泳", zhuyin: "ㄑㄧˇ ㄜˊ ㄅㄨˋ ㄏㄨㄟˋ ㄈㄟ ㄉㄢˋ ㄏㄨㄟˋ ㄧㄡˊ ㄧㄥˇ", pinyin: "qǐ é bù huì fēi dàn huì yóu yǒng", th: "เพนกวินบินไม่ได้แต่ว่ายน้ำเก่ง" }] },
      { zh: "孔雀", zhSimplified: "孔雀", zhuyin: "ㄎㄨㄥˇ ㄑㄩㄝˋ", pinyin: "kǒng què", th: "นกยูง", examples: [{ zh: "孔雀的羽毛很漂亮", zhCN: "孔雀的羽毛很漂亮", zhuyin: "ㄎㄨㄥˇ ㄑㄩㄝˋ ㄉㄜ˙ ㄩˇ ㄇㄠˊ ㄏㄣˇ ㄆㄧㄠˋ ㄌㄧㄤˋ", pinyin: "kǒng què de yǔ máo hěn piào liàng", th: "ขนนกยูงสวยงามมาก" }] },
      { zh: "貓頭鷹", zhSimplified: "猫头鹰", zhuyin: "ㄇㄠ ㄊㄡˊ ㄧㄥ", pinyin: "māo tóu yīng", th: "นกฮูก", examples: [{ zh: "貓頭鷹晚上才出來", zhCN: "猫头鹰晚上才出来", zhuyin: "ㄇㄠ ㄊㄡˊ ㄧㄥ ㄨㄢˇ ㄕㄤˋ ㄘㄞˊ ㄔㄨ ㄌㄞˊ", pinyin: "māo tóu yīng wǎn shàng cái chū lái", th: "นกฮูกออกมาในตอนกลางคืน" }] },
      { zh: "燕子", zhSimplified: "燕子", zhuyin: "ㄧㄢˋ ㄗ˙", pinyin: "yàn zi", th: "นกนางแอ่น", examples: [{ zh: "燕子春天回來了", zhCN: "燕子春天回来了", zhuyin: "ㄧㄢˋ ㄗ˙ ㄔㄨㄣ ㄊㄧㄢ ㄏㄨㄟˊ ㄌㄞˊ ㄌㄜ", pinyin: "yàn zi chūn tiān huí lái le", th: "นกนางแอ่นกลับมาในฤดูใบไม้ผลิ" }] },
      { zh: "烏鴉", zhSimplified: "乌鸦", zhuyin: "ㄨ ㄧㄚ", pinyin: "wū yā", th: "อีกา", examples: [{ zh: "烏鴉全身是黑色的", zhCN: "乌鸦全身是黑色的", zhuyin: "ㄨ ㄧㄚ ㄑㄩㄢˊ ㄕㄣ ㄕˋ ㄏㄟ ㄙㄜˋ ㄉㄜ˙", pinyin: "wū yā quán shēn shì hēi sè de", th: "อีกาตัวดำทั้งตัว" }] },
      { zh: "鴿子", zhSimplified: "鸽子", zhuyin: "ㄍㄜ ㄗ˙", pinyin: "gē zi", th: "นกพิราบ", examples: [{ zh: "廣場上有很多鴿子", zhCN: "广场上有很多鸽子", zhuyin: "ㄍㄨㄤˇ ㄔㄤˇ ㄕㄤˋ ㄧㄡˇ ㄏㄣˇ ㄉㄨㄛ ㄍㄜ ㄗ˙", pinyin: "guǎng chǎng shàng yǒu hěn duō gē zi", th: "ในลานมีนกพิราบเยอะมาก" }] },
      { zh: "麻雀", zhSimplified: "麻雀", zhuyin: "ㄇㄚˊ ㄑㄩㄝˋ", pinyin: "má què", th: "นกกระจอก", examples: [{ zh: "麻雀在屋頂上唱歌", zhCN: "麻雀在屋顶上唱歌", zhuyin: "ㄇㄚˊ ㄑㄩㄝˋ ㄗㄞˋ ㄨ ㄉㄧㄥˇ ㄕㄤˋ ㄔㄤˋ ㄍㄜ", pinyin: "má què zài wū dǐng shàng chàng gē", th: "นกกระจอกร้องเพลงบนหลังคา" }] },
      { zh: "天鵝", zhSimplified: "天鹅", zhuyin: "ㄊㄧㄢ ㄜˊ", pinyin: "tiān é", th: "หงส์", examples: [{ zh: "白天鵝在湖上游", zhCN: "白天鹅在湖上游", zhuyin: "ㄅㄞˊ ㄊㄧㄢ ㄜˊ ㄗㄞˋ ㄏㄨˊ ㄕㄤˋ ㄧㄡˊ", pinyin: "bái tiān é zài hú shàng yóu", th: "หงส์ขาวว่ายอยู่บนทะเลสาบ" }] },

      // 🐋 สัตว์น้ำ
      { zh: "鯊魚", zhSimplified: "鲨鱼", zhuyin: "ㄕㄚ ㄩˊ", pinyin: "shā yú", th: "ฉลาม", examples: [{ zh: "鯊魚游得很快", zhCN: "鲨鱼游得很快", zhuyin: "ㄕㄚ ㄩˊ ㄧㄡˊ ㄉㄜ˙ ㄏㄣˇ ㄎㄨㄞˋ", pinyin: "shā yú yóu de hěn kuài", th: "ฉลามว่ายน้ำเร็วมาก" }] },
      { zh: "鯨魚", zhSimplified: "鲸鱼", zhuyin: "ㄐㄧㄥ ㄩˊ", pinyin: "jīng yú", th: "วาฬ", examples: [{ zh: "鯨魚是最大的動物", zhCN: "鲸鱼是最大的动物", zhuyin: "ㄐㄧㄥ ㄩˊ ㄕˋ ㄗㄨㄟˋ ㄉㄚˋ ㄉㄜ˙ ㄉㄨㄥˋ ㄨˋ", pinyin: "jīng yú shì zuì dà de dòng wù", th: "วาฬเป็นสัตว์ที่ใหญ่ที่สุด" }] },
      { zh: "海豚", zhSimplified: "海豚", zhuyin: "ㄏㄞˇ ㄊㄨㄣˊ", pinyin: "hǎi tún", th: "โลมา", examples: [{ zh: "海豚很聰明又友善", zhCN: "海豚很聪明又友善", zhuyin: "ㄏㄞˇ ㄊㄨㄣˊ ㄏㄣˇ ㄘㄨㄥ ㄇㄧㄥˊ ㄧㄡˋ ㄧㄡˇ ㄕㄢˋ", pinyin: "hǎi tún hěn cōng míng yòu yǒu shàn", th: "โลมาฉลาดและเป็นมิตร" }] },
      { zh: "章魚", zhSimplified: "章鱼", zhuyin: "ㄓㄤ ㄩˊ", pinyin: "zhāng yú", th: "ปลาหมึกยักษ์", examples: [{ zh: "章魚有八條腿", zhCN: "章鱼有八条腿", zhuyin: "ㄓㄤ ㄩˊ ㄧㄡˇ ㄅㄚ ㄊㄧㄠˊ ㄊㄨㄟˇ", pinyin: "zhāng yú yǒu bā tiáo tuǐ", th: "ปลาหมึกยักษ์มีแปดขา" }] },
      { zh: "螃蟹", zhSimplified: "螃蟹", zhuyin: "ㄆㄤˊ ㄒㄧㄝˋ", pinyin: "páng xiè", th: "ปู", examples: [{ zh: "螃蟹橫著走路", zhCN: "螃蟹横着走路", zhuyin: "ㄆㄤˊ ㄒㄧㄝˋ ㄏㄥˊ ㄓㄜ˙ ㄗㄡˇ ㄌㄨˋ", pinyin: "páng xiè héng zhe zǒu lù", th: "ปูเดินขวาง" }] },
      { zh: "蝦", zhSimplified: "虾", zhuyin: "ㄒㄧㄚ", pinyin: "xiā", th: "กุ้ง", examples: [{ zh: "我很喜歡吃蝦", zhCN: "我很喜欢吃虾", zhuyin: "ㄨㄛˇ ㄏㄣˇ ㄒㄧˇ ㄏㄨㄢ ㄔ ㄒㄧㄚ", pinyin: "wǒ hěn xǐ huān chī xiā", th: "ฉันชอบกินกุ้งมาก" }] },
      { zh: "海龜", zhSimplified: "海龟", zhuyin: "ㄏㄞˇ ㄍㄨㄟ", pinyin: "hǎi guī", th: "เต่าทะเล", examples: [{ zh: "海龜在海洋裡游泳", zhCN: "海龟在海洋里游泳", zhuyin: "ㄏㄞˇ ㄍㄨㄟ ㄗㄞˋ ㄏㄞˇ ㄧㄤˊ ㄌㄧˇ ㄧㄡˊ ㄧㄥˇ", pinyin: "hǎi guī zài hǎi yáng lǐ yóu yǒng", th: "เต่าทะเลว่ายน้ำในมหาสมุทร" }] },
      { zh: "海星", zhSimplified: "海星", zhuyin: "ㄏㄞˇ ㄒㄧㄥ", pinyin: "hǎi xīng", th: "ดาวทะเล", examples: [{ zh: "海星有五條腳", zhCN: "海星有五条脚", zhuyin: "ㄏㄞˇ ㄒㄧㄥ ㄧㄡˇ ㄨˇ ㄊㄧㄠˊ ㄐㄧㄠˇ", pinyin: "hǎi xīng yǒu wǔ tiáo jiǎo", th: "ดาวทะเลมีห้าแขน" }] },
      { zh: "水母", zhSimplified: "水母", zhuyin: "ㄕㄨㄟˇ ㄇㄨˇ", pinyin: "shuǐ mǔ", th: "แมงกะพรุน", examples: [{ zh: "水母漂在海裡很漂亮", zhCN: "水母漂在海里很漂亮", zhuyin: "ㄕㄨㄟˇ ㄇㄨˇ ㄆㄧㄠ ㄗㄞˋ ㄏㄞˇ ㄌㄧˇ ㄏㄣˇ ㄆㄧㄠˋ ㄌㄧㄤˋ", pinyin: "shuǐ mǔ piāo zài hǎi lǐ hěn piào liàng", th: "แมงกะพรุนลอยในทะเลสวยมาก" }] },
      { zh: "海馬", zhSimplified: "海马", zhuyin: "ㄏㄞˇ ㄇㄚˇ", pinyin: "hǎi mǎ", th: "ม้าน้ำ", examples: [{ zh: "海馬游得很慢", zhCN: "海马游得很慢", zhuyin: "ㄏㄞˇ ㄇㄚˇ ㄧㄡˊ ㄉㄜ˙ ㄏㄣˇ ㄇㄢˋ", pinyin: "hǎi mǎ yóu de hěn màn", th: "ม้าน้ำว่ายช้ามาก" }] },
      { zh: "鱷魚", zhSimplified: "鳄鱼", zhuyin: "ㄜˋ ㄩˊ", pinyin: "è yú", th: "จระเข้", examples: [{ zh: "鱷魚很危險，不要靠近", zhCN: "鳄鱼很危险，不要靠近", zhuyin: "ㄜˋ ㄩˊ ㄏㄣˇ ㄨㄟˊ ㄒㄧㄢˇ ㄅㄨˋ ㄧㄠˋ ㄎㄠˋ ㄐㄧㄣˋ", pinyin: "è yú hěn wéi xiǎn, bù yào kào jìn", th: "จระเข้อันตรายมาก อย่าเข้าใกล้" }] },
      { zh: "青蛙", zhSimplified: "青蛙", zhuyin: "ㄑㄧㄥ ㄨㄚ", pinyin: "qīng wā", th: "กบ", examples: [{ zh: "青蛙在雨天叫得很響", zhCN: "青蛙在雨天叫得很响", zhuyin: "ㄑㄧㄥ ㄨㄚ ㄗㄞˋ ㄩˇ ㄊㄧㄢ ㄐㄧㄠˋ ㄉㄜ˙ ㄏㄣˇ ㄒㄧㄤˇ", pinyin: "qīng wā zài yǔ tiān jiào de hěn xiǎng", th: "กบร้องดังมากในวันฝนตก" }] },

      // 🦋 แมลง
      { zh: "蝴蝶", zhSimplified: "蝴蝶", zhuyin: "ㄏㄨˊ ㄉㄧㄝˊ", pinyin: "hú dié", th: "ผีเสื้อ", examples: [{ zh: "蝴蝶飛來飛去", zhCN: "蝴蝶飞来飞去", zhuyin: "ㄏㄨˊ ㄉㄧㄝˊ ㄈㄟ ㄌㄞˊ ㄈㄟ ㄑㄩˋ", pinyin: "hú dié fēi lái fēi qù", th: "ผีเสื้อบินไปมา" }] },
      { zh: "蜜蜂", zhSimplified: "蜜蜂", zhuyin: "ㄇㄧˋ ㄈㄥ", pinyin: "mì fēng", th: "ผึ้ง", examples: [{ zh: "蜜蜂採花蜜", zhCN: "蜜蜂采花蜜", zhuyin: "ㄇㄧˋ ㄈㄥ ㄘㄞˇ ㄏㄨㄚ ㄇㄧˋ", pinyin: "mì fēng cǎi huā mì", th: "ผึ้งเก็บน้ำหวานจากดอกไม้" }] },
      { zh: "螞蟻", zhSimplified: "蚂蚁", zhuyin: "ㄇㄚˇ ㄧˇ", pinyin: "mǎ yǐ", th: "มด", examples: [{ zh: "螞蟻很勤勞", zhCN: "蚂蚁很勤劳", zhuyin: "ㄇㄚˇ ㄧˇ ㄏㄣˇ ㄑㄧㄣˊ ㄌㄠˊ", pinyin: "mǎ yǐ hěn qín láo", th: "มดขยันมาก" }] },
      { zh: "蟑螂", zhSimplified: "蟑螂", zhuyin: "ㄓㄤ ㄌㄤˊ", pinyin: "zhāng láng", th: "แมลงสาบ", examples: [{ zh: "我最怕蟑螂了", zhCN: "我最怕蟑螂了", zhuyin: "ㄨㄛˇ ㄗㄨㄟˋ ㄆㄚˋ ㄓㄤ ㄌㄤˊ ㄌㄜ", pinyin: "wǒ zuì pà zhāng láng le", th: "ฉันกลัวแมลงสาบที่สุดเลย" }] },
      { zh: "蚊子", zhSimplified: "蚊子", zhuyin: "ㄨㄣˊ ㄗ˙", pinyin: "wén zi", th: "ยุง", examples: [{ zh: "蚊子叮我好癢", zhCN: "蚊子叮我好痒", zhuyin: "ㄨㄣˊ ㄗ˙ ㄉㄧㄥ ㄨㄛˇ ㄏㄠˇ ㄧㄤˇ", pinyin: "wén zi dīng wǒ hǎo yǎng", th: "ยุงกัดฉันคันมาก" }] },
      { zh: "蜘蛛", zhSimplified: "蜘蛛", zhuyin: "ㄓ ㄓㄨ", pinyin: "zhī zhū", th: "แมงมุม", examples: [{ zh: "蜘蛛結了一個大網", zhCN: "蜘蛛结了一个大网", zhuyin: "ㄓ ㄓㄨ ㄐㄧㄝˊ ㄌㄜ ㄧ ㄍㄜ ㄉㄚˋ ㄨㄤˇ", pinyin: "zhī zhū jié le yī gè dà wǎng", th: "แมงมุมชักใยขนาดใหญ่" }] },
      { zh: "螢火蟲", zhSimplified: "萤火虫", zhuyin: "ㄧㄥˊ ㄏㄨㄛˇ ㄔㄨㄥˊ", pinyin: "yíng huǒ chóng", th: "หิ่งห้อย", examples: [{ zh: "夏天晚上可以看到螢火蟲", zhCN: "夏天晚上可以看到萤火虫", zhuyin: "ㄒㄧㄚˋ ㄊㄧㄢ ㄨㄢˇ ㄕㄤˋ ㄎㄜˇ ㄧˇ ㄎㄢˋ ㄉㄠˋ ㄧㄥˊ ㄏㄨㄛˇ ㄔㄨㄥˊ", pinyin: "xià tiān wǎn shàng kě yǐ kàn dào yíng huǒ chóng", th: "คืนฤดูร้อนมองเห็นหิ่งห้อยได้" }] },
      { zh: "蜻蜓", zhSimplified: "蜻蜓", zhuyin: "ㄑㄧㄥ ㄊㄧㄥˊ", pinyin: "qīng tíng", th: "แมลงปอ", examples: [{ zh: "蜻蜓停在荷葉上", zhCN: "蜻蜓停在荷叶上", zhuyin: "ㄑㄧㄥ ㄊㄧㄥˊ ㄊㄧㄥˊ ㄗㄞˋ ㄏㄜˊ ㄧㄝˋ ㄕㄤˋ", pinyin: "qīng tíng tíng zài hé yè shàng", th: "แมลงปอเกาะบนใบบัว" }] },
      { zh: "甲蟲", zhSimplified: "甲虫", zhuyin: "ㄐㄧㄚˇ ㄔㄨㄥˊ", pinyin: "jiǎ chóng", th: "ด้วง", examples: [{ zh: "甲蟲有硬硬的殼", zhCN: "甲虫有硬硬的壳", zhuyin: "ㄐㄧㄚˇ ㄔㄨㄥˊ ㄧㄡˇ ㄧㄥˋ ㄧㄥˋ ㄉㄜ˙ ㄎㄜˊ", pinyin: "jiǎ chóng yǒu yìng yìng de ké", th: "ด้วงมีกระดองแข็ง" }] },
      { zh: "蚯蚓", zhSimplified: "蚯蚓", zhuyin: "ㄑㄧㄡ ㄧㄣˇ", pinyin: "qiū yǐn", th: "ไส้เดือน", examples: [{ zh: "下雨後蚯蚓爬出來", zhCN: "下雨后蚯蚓爬出来", zhuyin: "ㄒㄧㄚˋ ㄩˇ ㄏㄡˋ ㄑㄧㄡ ㄧㄣˇ ㄆㄚˊ ㄔㄨ ㄌㄞˊ", pinyin: "xià yǔ hòu qiū yǐn pá chū lái", th: "หลังฝนตกไส้เดือนคลานออกมา" }] },

      // 🦅 อื่นๆ
      { zh: "恐龍", zhSimplified: "恐龙", zhuyin: "ㄎㄨㄥˇ ㄌㄨㄥˊ", pinyin: "kǒng lóng", th: "ไดโนเสาร์", examples: [{ zh: "恐龍已經滅絕了", zhCN: "恐龙已经灭绝了", zhuyin: "ㄎㄨㄥˇ ㄌㄨㄥˊ ㄧˇ ㄐㄧㄥ ㄇㄧㄝˋ ㄐㄩㄝˊ ㄌㄜ", pinyin: "kǒng lóng yǐ jīng miè jué le", th: "ไดโนเสาร์สูญพันธุ์ไปแล้ว" }] },
      { zh: "獨角獸", zhSimplified: "独角兽", zhuyin: "ㄉㄨˊ ㄐㄧㄠˇ ㄕㄡˋ", pinyin: "dú jiǎo shòu", th: "ยูนิคอร์น", examples: [{ zh: "獨角獸是神話中的動物", zhCN: "独角兽是神话中的动物", zhuyin: "ㄉㄨˊ ㄐㄧㄠˇ ㄕㄡˋ ㄕˋ ㄕㄣˊ ㄏㄨㄚˋ ㄓㄨㄥ ㄉㄜ˙ ㄉㄨㄥˋ ㄨˋ", pinyin: "dú jiǎo shòu shì shén huà zhōng de dòng wù", th: "ยูนิคอร์นเป็นสัตว์ในตำนาน" }] },
      { zh: "龍", zhSimplified: "龙", zhuyin: "ㄌㄨㄥˊ", pinyin: "lóng", th: "มังกร", examples: [{ zh: "中國文化中龍是吉祥的象徵", zhCN: "中国文化中龙是吉祥的象征", zhuyin: "ㄓㄨㄥ ㄍㄨㄛˊ ㄨㄣˊ ㄏㄨㄚˋ ㄓㄨㄥ ㄌㄨㄥˊ ㄕˋ ㄐㄧˊ ㄒㄧㄤˊ ㄉㄜ˙ ㄒㄧㄤˋ ㄓㄥ", pinyin: "zhōng guó wén huà zhōng lóng shì jí xiáng de xiàng zhēng", th: "ในวัฒนธรรมจีน มังกรเป็นสัญลักษณ์มงคล" }] },
      { zh: "獸", zhSimplified: "兽", zhuyin: "ㄕㄡˋ", pinyin: "shòu", th: "สัตว์ร้าย / สัตว์ป่า" },
      { zh: "動物", zhSimplified: "动物", zhuyin: "ㄉㄨㄥˋ ㄨˋ", pinyin: "dòng wù", th: "สัตว์", examples: [{ zh: "動物園裡有很多動物", zhCN: "动物园里有很多动物", zhuyin: "ㄉㄨㄥˋ ㄨˋ ㄩㄢˊ ㄌㄧˇ ㄧㄡˇ ㄏㄣˇ ㄉㄨㄛ ㄉㄨㄥˋ ㄨˋ", pinyin: "dòng wù yuán lǐ yǒu hěn duō dòng wù", th: "ในสวนสัตว์มีสัตว์เยอะมาก" }] },
      { zh: "動物園", zhSimplified: "动物园", zhuyin: "ㄉㄨㄥˋ ㄨˋ ㄩㄢˊ", pinyin: "dòng wù yuán", th: "สวนสัตว์", examples: [{ zh: "週末我們去動物園吧", zhCN: "周末我们去动物园吧", zhuyin: "ㄓㄡ ㄇㄛˋ ㄨㄛˇ ㄇㄣ ㄑㄩˋ ㄉㄨㄥˋ ㄨˋ ㄩㄢˊ ㄅㄚ", pinyin: "zhōu mò wǒ men qù dòng wù yuán ba", th: "วันหยุดเราไปสวนสัตว์กันเถอะ" }] },
      { zh: "寵物", zhSimplified: "宠物", zhuyin: "ㄔㄨㄥˇ ㄨˋ", pinyin: "chǒng wù", th: "สัตว์เลี้ยง", examples: [{ zh: "你有養寵物嗎", zhCN: "你有养宠物吗", zhuyin: "ㄋㄧˇ ㄧㄡˇ ㄧㄤˇ ㄔㄨㄥˇ ㄨˋ ㄇㄚ", pinyin: "nǐ yǒu yǎng chǒng wù ma", th: "คุณเลี้ยงสัตว์เลี้ยงไหม" }] },
      { zh: "野生動物", zhSimplified: "野生动物", zhuyin: "ㄧㄝˇ ㄕㄥ ㄉㄨㄥˋ ㄨˋ", pinyin: "yě shēng dòng wù", th: "สัตว์ป่า", examples: [{ zh: "我們要保護野生動物", zhCN: "我们要保护野生动物", zhuyin: "ㄨㄛˇ ㄇㄣ ㄧㄠˋ ㄅㄠˇ ㄏㄨˋ ㄧㄝˇ ㄕㄥ ㄉㄨㄥˋ ㄨˋ", pinyin: "wǒ men yào bǎo hù yě shēng dòng wù", th: "เราต้องปกป้องสัตว์ป่า" }] },
      { zh: "害蟲", zhSimplified: "害虫", zhuyin: "ㄏㄞˋ ㄔㄨㄥˊ", pinyin: "hài chóng", th: "แมลงศัตรูพืช", examples: [{ zh: "農夫要消滅害蟲", zhCN: "农夫要消灭害虫", zhuyin: "ㄋㄨㄥˊ ㄈㄨ ㄧㄠˋ ㄒㄧㄠ ㄇㄧㄝˋ ㄏㄞˋ ㄔㄨㄥˊ", pinyin: "nóng fū yào xiāo miè hài chóng", th: "ชาวนาต้องกำจัดแมลงศัตรูพืช" }] },
    ],
  },
  { zh: "北極熊", zhSimplified: "北极熊", zhuyin: "ㄅㄟˇ ㄐㄧˊ ㄒㄩㄥˊ", pinyin: "běi jí xióng", th: "หมีขั้วโลก", examples: [{ zh: "北極熊住在很冷的地方", zhCN: "北极熊住在很冷的地方", zhuyin: "ㄅㄟˇ ㄐㄧˊ ㄒㄩㄥˊ ㄓㄨˋ ㄗㄞˋ ㄏㄣˇ ㄌㄥˇ ㄉㄜ˙ ㄉㄧˋ ㄈㄤ", pinyin: "běi jí xióng zhù zài hěn lěng de dì fāng", th: "หมีขั้วโลกอาศัยอยู่ในที่หนาวมาก" }] },       
  { zh: "駱駝", zhSimplified: "骆驼", zhuyin: "ㄌㄨㄛˋ ㄊㄨㄛ˙", pinyin: "luò tuó", th: "อูฐ", examples: [{ zh: "駱駝能在沙漠生存", zhCN: "骆驼能在沙漠生存", zhuyin: "ㄌㄨㄛˋ ㄊㄨㄛ˙ ㄋㄥˊ ㄗㄞˋ ㄕㄚ ㄇㄛˋ ㄕㄥ ㄘㄨㄣˊ", pinyin: "luò tuó néng zài shā mò shēng cún", th: "อูฐสามารถอยู่รอดในทะเลทรายได้" }] },       
  { zh: "大猩猩", zhSimplified: "大猩猩", zhuyin: "ㄉㄚˋ ㄒㄧㄥ ㄒㄧㄥ", pinyin: "dà xīng xīng", th: "กอริลลา", examples: [{ zh: "大猩猩力氣很大", zhCN: "大猩猩力气很大", zhuyin: "ㄉㄚˋ ㄒㄧㄥ ㄒㄧㄥ ㄌㄧˋ ㄑㄧˋ ㄏㄣˇ ㄉㄚˋ", pinyin: "dà xīng xīng lì qì hěn dà", th: "กอริลลามีพลังมาก" }] },       // หมวดต่อไปจะ append ที่นี่...
];
