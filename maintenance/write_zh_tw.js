const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "outputs/tw");
const OLD_OUT = path.join(ROOT, "outputs/zh-tw");
const TMP = "/private/tmp/adwd-tw-convert";

const TEXT_FILES = [
  ["outputs/cn/edition_notes_cn.txt", "outputs/tw/edition_notes_tw.txt"],
  ["outputs/cn/endings/dianeguide_cn.txt", "outputs/tw/endings/dianeguide_tw.txt"],
  ["outputs/cn/hidden_scenes/hidden_scenes_guide_cn.txt", "outputs/tw/hidden_scenes/hidden_scenes_guide_tw.txt"],
];

const DIR_FILES = [
  ["outputs/cn/endings/transcripts", "outputs/tw/endings/transcripts", "_cn.txt", "_tw.txt"],
  ["outputs/cn/hidden_scenes/scene_transcripts", "outputs/tw/hidden_scenes/scene_transcripts", "_cn.txt", "_tw.txt"],
];

const HTML_FILES = [
  ["outputs/cn/dianedate_cn.html", "outputs/tw/dianedate_tw.html"],
  ["outputs/cn/dianedate_cn_bilingual.html", "outputs/tw/dianedate_tw_bilingual.html"],
];

function swiftConvert(text) {
  fs.mkdirSync(TMP, { recursive: true });
  const input = path.join(TMP, `input-${process.pid}-${Date.now()}.txt`);
  const output = path.join(TMP, `output-${process.pid}-${Date.now()}.txt`);
  fs.writeFileSync(input, text, "utf8");
  const code = [
    "import Foundation",
    "let input = CommandLine.arguments[1]",
    "let output = CommandLine.arguments[2]",
    "let text = try String(contentsOfFile: input, encoding: .utf8)",
    "let mutable = NSMutableString(string: text)",
    "CFStringTransform(mutable, nil, \"Hans-Hant\" as CFString, false)",
    "try String(mutable).write(toFile: output, atomically: true, encoding: .utf8)",
  ].join("; ");
  childProcess.execFileSync("/usr/bin/swift", ["-e", code, input, output], {
    cwd: ROOT,
    env: {
      ...process.env,
      CLANG_MODULE_CACHE_PATH: "/private/tmp/clang-module-cache",
      SWIFT_MODULECACHE_PATH: "/private/tmp/swift-module-cache",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const converted = fs.readFileSync(output, "utf8");
  fs.rmSync(input, { force: true });
  fs.rmSync(output, { force: true });
  return converted;
}

function replaceAll(text, replacements) {
  let out = text;
  for (const [from, to] of replacements) {
    out = out.split(from).join(to);
  }
  return out;
}

const generalTaiwanFixes = [
  ["叫不准", "叫不準"],
  ["公交車", "公車"],
  ['--body-font: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", Arial, Helvetica, sans-serif;', '--body-font: "PingFang TC", "Heiti TC", "Microsoft JhengHei", "Noto Sans CJK TC", Arial, Helvetica, sans-serif;'],
  ['--ui-font: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", Arial, Helvetica, sans-serif;', '--ui-font: "PingFang TC", "Heiti TC", "Microsoft JhengHei", "Noto Sans CJK TC", Arial, Helvetica, sans-serif;'],
  ['body.lang-en .language-toggle {\n  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", Arial, Helvetica, sans-serif;\n}', 'body.lang-en .language-toggle {\n  font-family: "PingFang TC", "Heiti TC", "Microsoft JhengHei", "Noto Sans CJK TC", Arial, Helvetica, sans-serif;\n}'],
  ["公共汽車", "公車"],
  ["公交站", "公車站"],
  ["公共汽車站", "公車站"],
  ["出租車", "計程車"],
  ["出租車站", "計程車招呼站"],
  ["打車", "搭計程車"],
  ["叫了輛計程車", "叫了輛計程車"],
  ["女廁所", "女廁"],
  ["男廁所", "男廁"],
  ["女洗手間", "女廁"],
  ["洗手間", "廁所"],
  ["廁所有人", "廁所有人"],
  ["連褲襪", "褲襪"],
  // Keep 長筒襪 — shortening to 長襪 loses the stocking sense.
  ["吊襪帶", "吊襪帶"],
  ["意面", "義大利麵"],
  ["意麵", "義大利麵"],
  ["義式肉醬麵", "義大利肉醬麵"],
  ["意大利", "義大利"],
  ["意式", "義式"],
  ["滴濾咖啡", "濾泡咖啡"],
  ["過濾咖啡", "濾泡咖啡"],
  ["現煮濾泡咖啡", "現沖濾泡咖啡"],
  ["現衝咖啡", "現煮咖啡"],
  ["現沖咖啡", "現煮咖啡"],
  ["趁準備咖啡的工夫", "趁準備咖啡的時候"],
  ["趁衝咖啡的工夫", "趁準備咖啡的時候"],
  ["趁沖咖啡的工夫", "趁準備咖啡的時候"],
  ["比薩披薩餐廳", "比薩披薩店"],
  ["披薩餐廳", "披薩店"],
  ["服務員", "服務生"],
  ["菜單", "菜單"],
  ["節目單", "節目單"],
  ["視頻", "影片"],
  ["打印", "列印"],
  ["軟件", "軟體"],
  ["信息", "資訊"],
  ["質量", "品質"],
  ["自行車", "腳踏車"],
  ["騎車", "騎腳踏車"],
  ["騎腳踏車走了", "騎腳踏車走完了"],
  ["走了海岸到海岸", "走完了海岸到海岸"],
  ["週二", "週二"],
  ["週四", "週四"],
  ["週六", "週六"],
  ["一周", "一週"],
  ["每周", "每週"],
  ["裡邊", "裡面"],
  ["這裡", "這裡"],
  ["那裡", "那裡"],
  ["哪裡", "哪裡"],
  ["她答應改天晚上和你一起出去", "她答應改天晚上和你約會"],
  ["你的錢不夠了", "你的錢不夠了"],
  ["返回主菜單", "返回主選單"],
  ["更多說明", "更多資訊"],
  ["開始遊戲", "開始遊戲"],
  ["開始約會", "開始約會"],
  ["幸運機會", "幸運機會"],
  ["待轉化水分", "待轉化水分"],
  ["親密度", "親密度"],
  ["害羞值", "害羞值"],
  ["英鎊", "英鎊"],
  ["你的錢", "你的錢"],
  ["膀胱儀表", "膀胱指標"],
  ["她腹中的水分", "她腹中的水分"],
  ["低聲說", "小聲說"],
  ["輕聲", "輕聲"],
  // Repair: broad 低聲→小聲 used to mangle 壓低聲音 → 壓小聲音.
  ["壓小聲音", "壓低聲音"],
  ["難為情", "不好意思"],
  ["不好意思", "不好意思"],
  ["出租", "計程"],
  ["公車站牌", "公車站牌"],
  ["公車站臺", "公車站"],
  ["站臺", "站台"],
  ["月臺", "月台"],
  ["公交", "公車"],
  ["軟體", "軟體"],
  ["硬盤", "硬碟"],
  ["筆記本電腦", "筆電"],
  ["筆記本", "筆電"],
  ["膝上型電腦", "筆電"],
  ["相冊", "相簿"],
  ["屏幕", "螢幕"],
  ["咱們", "我們"],
  ["里瞧", "裡瞧"],
  ["里看", "裡看"],
  ["內褲里", "內褲裡"],
  ["另一本冊子", "另一本相簿"],
  ["一本冊子", "一本相簿"],
  ["手提包", "手提包"],
  ["手包", "手提包"],
  ["馬桶", "馬桶"],
  ["小便池", "小便斗"],
  ["無障礙廁所", "無障礙廁所"],
  ["看守員", "管理員"],
  ["市政管理員", "市政管理員"],
  ["市政看守員", "市政管理員"],
  ["貨車", "廂型車"],
  ["麵包車", "廂型車"],
  ["小巴", "小巴"],
  ["停車場", "停車場"],
  ["公車站，車", "公車站，公車"],
  ["公車早就沒了", "公車早就開走了"],
  ["車早就沒了", "車早就開走了"],
  ["公車已經走了", "公車已經開走了"],
  ["車已經走了", "車已經開走了"],
  ["錢包", "錢包"],
  ["體面", "體面"],
  ["變態", "變態"],
  ["尿褲子", "尿褲子"],
  ["尿濕", "尿濕"],
  ["尿急", "尿急"],
  ["憋尿", "憋尿"],
  ["上廁所", "上廁所"],
  ["去廁所", "去廁所"],
  ["撒尿", "撒尿"],
  ["尿尿", "尿尿"],
  ["解決", "解決"],
  ["方便", "方便"],
  ["女孩子", "女生"],
  ["女孩", "女生"],
  ["女生子", "女生"],
  ["那女生", "那個女生"],
  ["褐發", "褐髮"],
  ["金發", "金髮"],
  ["頭發", "頭髮"],
  ["髮展", "發展"],
  ["發展", "發展"],
  ["乾了杯", "喝了一杯"],
  ["乾杯", "乾杯"],
  ["觸發", "觸發"],
  ["發現", "發現"],
  ["出發", "出發"],
  ["發生", "發生"],
  ["髮生", "發生"],
  ["髮現", "發現"],
  ["齣", "齣"],
  ["這部戲", "這齣戲"],
  ["看戲", "看戲"],
  ["話劇", "舞台劇"],
  ["劇院大廳", "劇院大廳"],
  ["門廳", "大廳"],
  ["涼亭酒吧", "Pavilion酒吧"],
  ["啤酒花園", "啤酒花園"],
  ["酒吧", "酒吧"],
  ["吧檯", "吧台"],
  ["臺", "台"],
  ["檯", "檯"],
  ["吧台", "吧台"],
  ["站台", "站台"],
  ["舞台", "舞台"],
];

const phraseFixes = [
  ['var alternateLanguageName = "中文";', 'var alternateLanguageName = "繁體中文";'],
  ['? "中文" : "English"', '? "繁體中文" : "English"'],
  ["她當時尿急得快忍不住了，慌忙離開站台，四處找地方解決。", "她當時尿急得快忍不住了，慌忙離開公車站，四處找地方解決。"],
  ["她躲到一輛廂型車後面撒了泡尿，等她回到站台，公車早就開走了。", "她躲到一輛廂型車後面撒了泡尿，等她回到公車站，公車早就開走了。"],
  ["你和黛安是偶然認識的——你們都錯過了公車，於是合乘計程車回家。", "你和黛安是偶然認識的——你們都錯過了公車，於是一起搭計程車回家。"],
  ["你：呃……我是去了停車場那邊……", "你：呃……我是去了停車場那邊……"],
  ["我和莫莉最後都到樹叢後面解決了。", "我和莫莉最後都到樹叢後面解決了。"],
  ["你給兩只酒杯都續上了酒", "你給兩只酒杯都續上了酒"],
  ["你給兩隻酒杯都續上了酒", "你給兩只酒杯都續上了酒"],
  ["隻酒杯", "只酒杯"],
  ["你有3次幸運機會", "你有3次幸運機會"],
  ["你失去了", "你失去了"],
  ["你獲得了", "你獲得了"],
  ["你獲得", "你獲得"],
  ["你失去", "你失去"],
  ["你會選哪天？", "你要選哪一天？"],
  ["你哪天最方便？", "你哪天最方便？"],
  ["週二：", "週二："],
  ["週四：", "週四："],
  ["週六：", "週六："],
  ["你的女朋友", "你的女朋友"],
  ["女朋友", "女朋友"],
  ["男朋友", "男朋友"],
  ["弟弟", "弟弟"],
  ["布魯諾", "布魯諾"],
  ["克洛伊", "克洛伊"],
  ["阿曼達", "阿曼達"],
  ["莫莉", "莫莉"],
  ["黛安", "黛安"],
  ["我已滿18歲。", "我已滿18歲。"],
  ["抱歉，您必須年滿18歲才能遊玩此遊戲。", "抱歉，您必須年滿18歲才能遊玩這個遊戲。"],
  ["返回主選單。", "返回主選單。"],
  ["返回商店", "回到商店"],
  ["好，我保證。", "好，我保證。"],
  ["好的。", "好。"],
  ["這個遊戲的目標是", "這個遊戲的目標是"],
  ["不過，這可不一定能成！", "不過，這可不一定會成功！"],
  ["一路上你還可能碰上別的刺激場面", "一路上你還可能碰到其他刺激場面"],
  ["規則很簡單", "規則很簡單"],
  ["如果親密度降得太低", "如果親密度降得太低"],
  ["她也會立刻走人", "她也會立刻走人"],
  ["事情失控到那一步", "事情失控到那一步"],
  ["隨著夜晚推進", "隨著夜晚推進"],
  ["萬能牌", "變數牌"],
  ["注意你的錢。晚上結束時你可能需要留一些搭計程車回家。", "注意你的錢。晚上結束時，你可能需要留一些錢搭計程車回家。"],
  ["如果你處理得當", "如果你拿捏得好"],
  ["別樣的樂趣", "別樣的樂趣"],
  ["女人總是讓人捉摸不透", "女人總是讓人捉摸不透"],
  ["短版流程", "短版流程"],
  ["直接跳過前面的部分", "直接跳過前面的部分"],
  ["用一次幸運機會", "用一次幸運機會"],
  ["使用一次幸運機會", "使用一次幸運機會"],
  ["幸運機會沒起作用", "幸運機會沒有奏效"],
  ["沒能奏效", "沒有奏效"],
  ["沒有奏效", "沒有奏效"],
  ["公車站等車回家", "公車站等車回家"],
  ["隊伍", "隊伍"],
  ["排隊", "排隊"],
  ["上成廁所", "上成廁所"],
  ["急得直跺腳", "急得直跺腳"],
  ["苦苦央求", "苦苦央求"],
  ["廁所隊伍", "廁所隊伍"],
  ["排到門外", "排到門外"],
  ["出了廁所", "出了廁所"],
  ["進了女廁", "進了女廁"],
  ["進女廁", "進女廁"],
  ["去女廁", "去女廁"],
  ["朝女廁走去", "朝女廁走去"],
  ["她去了女廁", "她去了女廁"],
  ["女廁裡", "女廁裡"],
  ["男廁裡", "男廁裡"],
  ["廁所建築", "廁所建築"],
  ["灌木叢", "樹叢"],
  ["樹叢叢", "樹叢"],
  ["廂型車後面", "廂型車後面"],
  ["停車場那邊", "停車場那邊"],
  ["起司", "起司"],
  ["乳酪", "起司"],
  ["義式大餛飩", "義式大餛飩"],
  ["義式方餃", "義式方餃"],
  ["義式千層麵", "義式千層麵"],
  ["義大利肉醬義大利麵", "義大利肉醬麵"],
  ["海岸到海岸路線", "海岸到海岸路線"],
  ["英格蘭", "英格蘭"],
  ["倫敦", "倫敦"],
  ["那不勒斯", "拿坡里"],
  ["索倫托", "索倫托"],
  ["卡普里島", "卡布里島"],
  ["威尼斯", "威尼斯"],
  ["希臘", "希臘"],
  ["葡萄酒", "葡萄酒"],
  ["紅酒", "紅酒"],
  ["霞多麗", "夏多內"],
  ["雷司令", "麗絲玲"],
  ["灰皮諾", "灰皮諾"],
  ["里奧哈", "里奧哈"],
  ["勃艮第", "勃艮第"],
  ["梅洛", "梅洛"],
  ["提拉米蘇", "提拉米蘇"],
  ["奶酪", "乳酪"],
  ["優格", "優格"],
  ["橙汁", "柳橙汁"],
  ["蘋果酒", "蘋果酒"],
  ["中餐廳", "中式餐廳"],
  ["房產中介", "房仲"],
  ["教堂", "教堂"],
  ["電燈開關", "電燈開關"],
  ["燈的開關", "燈的開關"],
  ["攝像頭", "攝影機"],
  ["攝像機", "攝影機"],
  ["筆電", "筆電"],
  ["主選單", "主選單"],
  ["盡量", "儘量"],
  ["拿不准", "拿不準"],
  ["松開", "鬆開"],
  ["純文字界面", "純文字介面"],
  ["遊戲界面", "遊戲介面"],
  ["清理界面", "清理介面"],
  ["這個版本的源頭是一款老舊的獨立HTML文字遊戲", "這個版本的源頭是一款老舊的獨立HTML文字遊戲"],
  ["故事里", "故事裡"],
  ["遊戲里", "遊戲裡"],
  ["語言里", "語言裡"],
  ["攻略里", "攻略裡"],
  ["版本里", "版本裡"],
  ["文本里", "文本裡"],
  ["正文里", "正文裡"],
  ["路線里", "路線裡"],
  ["上下文里", "上下文裡"],
  ["文件里", "檔案裡"],
  ["原文件", "原始檔案"],
  ["輸出文件夾", "輸出資料夾"],
  ["文件夾", "資料夾"],
  ["文本數據", "文本資料"],
  ["生成文本裡", "生成文字裡"],
  ["更新文本", "更新文字"],
  ["故事文本按順序", "故事文字按順序"],
  ["對齊文本資料", "對齊文字資料"],
  ["這些數據", "這些資料"],
  ["遊戲數據", "遊戲資料"],
  ["遊戲變量", "遊戲變數"],
  ["控制結局入口的變量", "控制結局入口的變數"],
  ["可以獨立運行的HTML版本", "可以獨立遊玩的HTML版本"],
  ["可以獨立執行的HTML版本", "可以獨立遊玩的HTML版本"],
  ["英文版是源版本。後來又分別製作了中文、西班牙語和法語三個可以獨立遊玩的HTML版本。", "英文版是源版本。後來又分別製作了簡體中文、繁體中文、西班牙語和法語四個可以獨立遊玩的HTML版本。"],
  ["繁體中文版尤其反復校對，就是為了避開機器翻譯腔、違和的廁所用語、彆扭的繁體中文標點和過於死板的直譯。", "繁體中文版也經過反覆校對，避免機器翻譯腔、違和的廁所用語、不順的標點，以及過於死板的直譯。"],
  ["中文版尤其反復校對，就是為了避開機器翻譯腔、違和的廁所用語、彆扭的中文標點和過於死板的直譯。", "兩個中文版本都經過反覆校對，避免機器翻譯腔、違和的廁所用語、不順的標點，以及過於死板的直譯。"],
  ["中文版尤其反覆校對，就是為了避開機器翻譯腔、違和的廁所用語、彆扭的中文標點和過於死板的直譯。", "兩個中文版本都經過反覆校對，避免機器翻譯腔、違和的廁所用語、不順的標點，以及過於死板的直譯。"],
  ["攻略提供英文、繁體中文、西班牙語和法語四個版本。", "攻略提供英文、簡體中文、繁體中文、西班牙語和法語五個版本。"],
  ["攻略提供英文、中文、西班牙語和法語四個版本。", "攻略提供英文、簡體中文、繁體中文、西班牙語和法語五個版本。"],
  ["四種語言都有對應的實錄資料夾。", "五種語言都有對應的實錄資料夾。"],
  ["另外還做了三套雙語版，分別對應中英、西英和法英。", "另外還做了四套雙語版，分別對應簡中英、繁中英、西英和法英。"],
  ["另外還做了三套雙語版，分別對應繁體中文英、西英和法英。", "另外還做了四套雙語版，分別對應簡中英、繁中英、西英和法英。"],
  ["可玩的HTML文件", "可玩的HTML檔案"],
  ["維護文件", "維護檔案"],
  ["時間和地點里利用", "時間和地點裡利用"],
  ["腦子里", "腦子裡"],
  ["腦子里浮現", "腦子裡浮現"],
  ["冗余的大標題", "多餘的大標題"],
  ["項目中還保留", "專案中還保留"],
  ["這個版本與其說是重制", "這個版本與其說是重製"],
  ["你給兩只酒杯都續上了酒", "你替兩人的酒杯都續上了酒"],
  ["兩只腳", "兩隻腳"],
  ["那只手", "那隻手"],
  ["這只手", "這隻手"],
  ["一只手", "一隻手"],
  ["另一只手", "另一隻手"],
  ["空著的那只手", "空著的那隻手"],
  ["空出的那只手", "空出的那隻手"],
  ["一個勁兒地", "一個勁地"],
  ["一個勁兒", "一個勁"],
  ["有會兒", "有一陣子"],
  ["這會兒", "這時候"],
  ["那會兒", "那時候"],
  ["咋辦", "怎麼辦"],
  ["衛生間", "洗手間"],
  ["馬桶圈", "馬桶座"],
  ["難為情", "不好意思"],
  ["兩只輪流托著", "兩邊輪流托著"],
];


const taiwanVoiceFixesPath = path.join(__dirname, "taiwan_voice_fixes.json");
const taiwanVoiceFixes = fs.existsSync(taiwanVoiceFixesPath)
  ? JSON.parse(fs.readFileSync(taiwanVoiceFixesPath, "utf8")).fixes.map((x) => [x.from, x.to])
  : [];

/** Unify dialogue quotes to Taiwan 「」 (nested 『』). Leave English “...” alone. */
function unifyTaiwanQuotes(text) {
  if (!text || (!/[“”]/.test(text) && !/[「」]/.test(text))) return text;
  let out = text.replace(/“([^”]*)”/g, (full, inner) => {
    if (!/[\u4e00-\u9fff]/.test(inner)) return full;
    return `「${inner}」`;
  });
  // Nested corner quotes → 『』
  const chars = [];
  let depth = 0;
  for (const ch of out) {
    if (ch === "「") {
      chars.push(depth === 0 ? "「" : "『");
      depth += 1;
      continue;
    }
    if (ch === "」") {
      chars.push(depth >= 2 ? "』" : "」");
      depth = Math.max(0, depth - 1);
      continue;
    }
    chars.push(ch);
  }
  return chars.join("");
}

function applyTaiwanStyle(text) {
  let out = replaceAll(text, generalTaiwanFixes);
  out = replaceAll(out, phraseFixes);
  out = replaceAll(out, taiwanVoiceFixes);
  out = out
    .replace(/([一-龥])[ \t]+([A-Za-z0-9£])/g, "$1$2")
    .replace(/([A-Za-z0-9£])[ \t]+([一-龥])/g, "$1$2")
    .replace(/(\d+) 點/g, "$1點")
    .replace(/(\d+) 次/g, "$1次")
    .replace(/(\d+) 英鎊/g, "$1英鎊")
    .replace(/(\d+) ml/g, "$1ml")
    .replace(/([。！？；：])\./g, "$1")
    .replace(/([！？])\./g, "$1")
    .replace(/瞭/g, "了")
    .replace(/沈/g, "沉")
    .replace(/([^里])里([，。！？；：、\s])/g, "$1裡$2")
    .replace(/里——/g, "裡——")
    .replace(/里…/g, "裡…")
    .replace(/里</g, "裡<")
    .replace(/里，/g, "裡，")
    .replace(/里。/g, "裡。")
    .replace(/房間里/g, "房間裡")
    .replace(/浴室里/g, "浴室裡")
    .replace(/廁所里/g, "廁所裡")
    .replace(/女廁里/g, "女廁裡")
    .replace(/男廁里/g, "男廁裡")
    .replace(/車里/g, "車裡")
    .replace(/廂型車里/g, "廂型車裡")
    .replace(/口袋里/g, "口袋裡")
    .replace(/裙子里/g, "裙子裡")
    .replace(/褲子里/g, "褲子裡")
    .replace(/陰影里/g, "陰影裡")
    .replace(/垃圾桶里/g, "垃圾桶裡")
    .replace(/雜物堆里/g, "雜物堆裡")
    .replace(/步驟里/g, "步驟裡")
    .replace(/劇里/g, "劇裡")
    .replace(/流程里/g, "流程裡")
    .replace(/眼睛里/g, "眼睛裡")
    .replace(/眼角里/g, "眼裡")
    .replace(/視線里/g, "視線裡")
    .replace(/往里/g, "往裡")
    .replace(/隊伍里/g, "隊伍裡")
    .replace(/候車隊伍裡/g, "候車隊伍裡")
    .replace(/大廳里/g, "大廳裡")
    .replace(/現實里/g, "現實裡")
    .replace(/酒吧里/g, "酒吧裡")
    .replace(/電視劇里/g, "電視劇裡")
    .replace(/草叢里/g, "草叢裡")
    .replace(/灌木里/g, "灌木裡")
    .replace(/門廊里/g, "門廊裡")
    .replace(/牛仔褲里/g, "牛仔褲裡")
    .replace(/隔間里/g, "隔間裡")
    .replace(/色情片里/g, "色情片裡")
    .replace(/語氣里/g, "語氣裡")
    .replace(/計程車後座里/g, "計程車後座裡")
    .replace(/某件事里/g, "某件事裡")
    .replace(/包里/g, "包裡")
    .replace(/馬桶里/g, "馬桶裡")
    .replace(/浴缸里/g, "浴缸裡")
    .replace(/短褲里/g, "短褲裡")
    .replace(/膀胱里/g, "膀胱裡")
    .replace(/小便斗里/g, "小便斗裡")
    .replace(/車廂里/g, "車廂裡")
    .replace(/停車場里/g, "停車場裡")
    .replace(/客廳里/g, "客廳裡")
    .replace(/走廊里/g, "走廊裡")
    .replace(/房車里/g, "房車裡")
    .replace(/襯衫里/g, "襯衫裡")
    .replace(/裙腰里/g, "裙腰裡")
    .replace(/劇本里/g, "劇本裡")
    .replace(/不可兒戲》里/g, "不可兒戲》裡")
    .replace(/角落里/g, "角落裡")
    .replace(/這群人里/g, "這群人裡")
    .replace(/冊子里/g, "冊子裡")
    .replace(/電話里/g, "電話裡")
    .replace(/樹叢里/g, "樹叢裡")
    .replace(/浴室鏡子里的/g, "浴室鏡子裡的")
    .replace(/噼里啪啦/g, "噼哩啪啦")
    .replace(/裡見/g, "裡見")
    .replace(/等她回到站台，車/g, "等她回到公車站，公車")
    .replace(/站台後面的酒吧停車場/g, "公車站後面的酒吧停車場")
    .replace(/隔壁站台/g, "旁邊公車站")
    .replace(/旁邊站台/g, "旁邊公車站")
    .replace(/站台上尿尿/g, "月台上尿尿")
    .replace(/趕巴士/g, "趕公車")
    .replace(/坐巴士/g, "坐公車")
    .replace(/錯過巴士/g, "錯過公車")
    .replace(/小巴/g, "小型巴士")
    .replace(/三個閨蜜去荷蘭參加一個婚前派對/g, "三個好姊妹去荷蘭參加一場單身派對")
    .replace(/里奧哈/g, "里奧哈")
    .replace(/里德爾斯/g, "里德爾斯")
    .replace(/拿坡裡/g, "拿坡里")
    .replace(/利比里亞/g, "利比里亞")
    .replace(/毛里求斯/g, "毛里求斯")
    .replace(/反復/g, "反覆")
    .replace(/重復/g, "重複")
    .replace(/蓬松/g, "蓬鬆")
    .replace(/寬松/g, "寬鬆")
    .replace(/松了口氣/g, "鬆了口氣")
    .replace(/松了出來/g, "鬆了出來")
    .replace(/竪/g, "豎")
    .replace(/界面/g, "介面")
    .replace(/數據/g, "資料")
    .replace(/變量/g, "變數")
    .replace(/繁體繁體中文/g, "繁體中文")
    .replace(/繁體中文雙語/g, "繁體中文雙語");
  return unifyTaiwanQuotes(out);
}

function convertToZhTw(text) {
  return patchTwRuntimeQuotes(applyTaiwanStyle(swiftConvert(text)));
}

/** TW runtime: Chinese dialogue smart-quotes → 「」, keep English “”. */
function patchTwRuntimeQuotes(text) {
  const oldSmarten = `function smartenText(text) {
  return String(text)
    .replace(/(^|[\\s([{—-])'(\\d{2}s\\b)/g, "$1’$2")
    .replace(/"([^"]+)"/g, "“$1”")
    .replace(/([A-Za-z0-9])'([A-Za-z0-9])/g, "$1’$2")
    .replace(/(^|[\\s([{—-])'([^']+)'/g, "$1“$2”")
    .replace(/(^|[\\s([{—-])'(?=\\w)/g, "$1‘")
    .replace(/'/g, "’");
}`;
  const newSmarten = `function smartenText(text) {
  return String(text)
    .replace(/(^|[\\s([{—-])'(\\d{2}s\\b)/g, "$1’$2")
    .replace(/"([^"]+)"/g, function (m, inner) {
      return /[\\u4e00-\\u9fff]/.test(inner) ? "「" + inner + "」" : "“" + inner + "”";
    })
    .replace(/([A-Za-z0-9])'([A-Za-z0-9])/g, "$1’$2")
    .replace(/(^|[\\s([{—-])'([^']+)'/g, function (m, lead, inner) {
      return lead + (/[\\u4e00-\\u9fff]/.test(inner) ? "「" + inner + "」" : "“" + inner + "”");
    })
    .replace(/(^|[\\s([{—-])'(?=\\w)/g, "$1‘")
    .replace(/'/g, "’");
}`;
  let out = text.includes(oldSmarten) ? text.replace(oldSmarten, newSmarten) : text;
  out = out.replace(
    /if \(!noPunctuation && !\/\[\.!\?…:;\)"'”’\\-—。！？；：）】》»\]\$\/\.test\(visible\)\) \{/,
    'if (!noPunctuation && !/[.!?…:;)"\'”’\\-—。！？；：）】》»」』]$/.test(visible)) {'
  );
  return out;
}

function convertManyToZhTw(values) {
  const converted = JSON.parse(swiftConvert(JSON.stringify(values)));
  return converted.map((value) => applyTaiwanStyle(value));
}

function convertFile(srcRel, dstRel) {
  const src = path.join(ROOT, srcRel);
  const dst = path.join(ROOT, dstRel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, convertToZhTw(fs.readFileSync(src, "utf8")), "utf8");
}

function convertDirectory(srcRel, dstRel, oldSuffix, newSuffix) {
  const srcDir = path.join(ROOT, srcRel);
  const dstDir = path.join(ROOT, dstRel);
  fs.rmSync(dstDir, { recursive: true, force: true });
  fs.mkdirSync(dstDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir).sort()) {
    if (!name.endsWith(oldSuffix)) continue;
    const src = path.join(srcDir, name);
    const dst = path.join(dstDir, name.slice(0, -oldSuffix.length) + newSuffix);
    fs.writeFileSync(dst, convertToZhTw(fs.readFileSync(src, "utf8")), "utf8");
  }
}

function updateAlignedText() {
  const file = path.join(ROOT, "maintenance/aligned_text.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const entries = Array.isArray(data) ? data : data.entries;
  if (!Array.isArray(entries)) throw new Error("aligned_text.json has no entries array");
  const indexed = [];
  const values = [];
  for (const entry of entries) {
    if (!entry.cn) continue;
    indexed.push(entry);
    values.push(entry.cn);
  }
  const converted = convertManyToZhTw(values);
  for (const entry of entries) delete entry["zh-tw"];
  const overridePath = path.join(__dirname, "taiwan_voice_overrides.json");
  const overrides = fs.existsSync(overridePath)
    ? JSON.parse(fs.readFileSync(overridePath, "utf8")).overrides || {}
    : {};
  for (let i = 0; i < indexed.length; i++) {
    const id = indexed[i].id;
    indexed[i].tw = unifyTaiwanQuotes(overrides[id] || converted[i]);
  }
  if (!Array.isArray(data)) {
    data.source_files = data.source_files || {};
    delete data.source_files["zh-tw"];
    data.source_files.tw = "outputs/tw/dianedate_tw.html";
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function writeReadmePatch() {
  const file = path.join(ROOT, "maintenance/README.txt");
  let text = fs.readFileSync(file, "utf8");
  text = text.replace(/\noutputs\/zh-tw\/\n- dianedate_zh-tw\.html\n- dianedate_zh-tw_bilingual\.html\n- edition_notes_zh-tw\.txt\n- endings\/dianeguide_zh-tw\.txt\n- endings\/transcripts contains the verified ending transcript files\n- hidden_scenes\/hidden_scenes_guide_zh-tw\.txt\n- hidden_scenes\/scene_transcripts contains the optional hidden scene transcript files\n/g, "\n");
  if (!text.includes("outputs/tw/")) {
    const block = `\noutputs/tw/\n- dianedate_tw.html\n- dianedate_tw_bilingual.html\n- edition_notes_tw.txt\n- endings/dianeguide_tw.txt\n- endings/transcripts contains the verified ending transcript files\n- hidden_scenes/hidden_scenes_guide_tw.txt\n- hidden_scenes/scene_transcripts contains the optional hidden scene transcript files\n`;
    text = text.replace(/outputs\/fr\/[\s\S]*?hidden_scenes\/scene_transcripts contains the optional hidden scene transcript files\n/, (match) => match + block);
  }
  text = text.replace("English, Chinese, Spanish, and French text", "English, Chinese, Spanish, French, and Traditional Chinese text");
  text = text.replace(/Regenerates outputs\/\{en,cn,es,fr(?:,zh-tw)*\}\/endings/g, "Regenerates outputs/{en,cn,es,fr}/endings");
  text = text.replace(/Regenerates all four ending transcript folders under outputs\/\{en,cn,es,fr(?:,zh-tw)*\}/g, "Regenerates all four ending transcript folders under outputs/{en,cn,es,fr}");
  text = text.replace(/Regenerates outputs\/\{en,cn,es,fr(?:,zh-tw)*\}\/hidden_scenes/g, "Regenerates outputs/{en,cn,es,fr}/hidden_scenes");
  text = text.replace(/Regenerates all four hidden-scene transcript folders under outputs\/\{en,cn,es,fr(?:,zh-tw)*\}/g, "Regenerates all four hidden-scene transcript folders under outputs/{en,cn,es,fr}");
  if (!text.includes("write_zh_tw.js")) {
    const block = `\nwrite_zh_tw.js\n- Builds the Traditional Chinese outputs from the final Simplified Chinese files.\n- Uses macOS Swift/ICU conversion plus Taiwan-specific wording and punctuation cleanup.\n- Regenerates outputs/tw/ and adds tw text to aligned_text.json.\n`;
    text = text.replace(/write_hidden_scenes\.js[\s\S]*?English hidden-scene guide and transcript files are written with a UTF-8 BOM for more reliable mobile text viewing\.\n/, (match) => match + block);
  }
  text = text.replace(/outputs\/zh-tw\//g, "outputs/tw/");
  text = text.replace(/dianedate_zh-tw/g, "dianedate_tw");
  text = text.replace(/edition_notes_zh-tw/g, "edition_notes_tw");
  text = text.replace(/dianeguide_zh-tw/g, "dianeguide_tw");
  text = text.replace(/hidden_scenes_guide_zh-tw/g, "hidden_scenes_guide_tw");
  text = text.replace(/adds zh-tw text/g, "adds tw text");
  fs.writeFileSync(file, text, "utf8");
}

function main() {
  fs.rmSync(OLD_OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  for (const [src, dst] of HTML_FILES) convertFile(src, dst);
  for (const [src, dst] of TEXT_FILES) convertFile(src, dst);
  for (const [src, dst, oldSuffix, newSuffix] of DIR_FILES) convertDirectory(src, dst, oldSuffix, newSuffix);
  updateAlignedText();
  writeReadmePatch();
  console.log("Wrote Traditional Chinese outputs under outputs/tw");
}

main();
