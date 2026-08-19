# Taiwan Mandarin voice guide — *A Date With Diane* (TW)

Read this before any TW wording pass. TW is **not** “CN run through OpenCC.” It is an independent language edition, same standing as ES/FR.

This guide is for the **playable** TW game (`dianedate_tw.html` + bilingual dictionary values). Wiki TW stays more neutral/encyclopedic; do not dump chatty particles into wiki prose.

---

## 1. What “台湾腔” means here

**Target:** Natural **Taiwan Mandarin** (國語) as spoken/written by educated Taiwanese adults roughly Diane’s age — warm, slightly soft, conversational, not textbook PRC Putonghua and not a comedy sketch.

**It is not:**

| Trap | Why it fails |
|------|----------------|
| Traditional characters only | Script ≠ voice. CN meaning with 繁體 still reads as Mainland. |
| Particle spray (`喔喔耶啦齁`) | Caricature. Real TW uses particles sparingly and with intent. |
| Hong Kong Cantonese calques | Wrong region (`唔係`, `嘅`, `咗`, etc.). |
| Heavy 火星文 / 注音文 | Fine for teens on BBS; wrong for this game’s tone. |
| Translating British slang into Taiwan slang one-for-one | Keep *sense* and *register*; don’t force 台語 loanwords into every line. |
| Making Diane sound like a 鄉民 meme | She’s shy, polite, British-coded; TW should feel local *language*, not local *persona swap*. |

**North Star:** If a Taipei reader hears the line in their head, it should sound like something a real person would say — not like a dubbed PRC novel, and not like a variety-show host.

---

## 2. Layers of a thorough TW pass

Work **outside-in**. Particles are the last 10%, not the first.

1. **Lexicon** — replace PRC-preferred words with TW-preferred ones (biggest win).
2. **Collocation & grammar** — how verbs, aspects, and resultatives are built.
3. **Sentence shape** — softener order, topic-comment, question form.
4. **Register by speaker** — Diane ≠ YOU ≠ narrator ≠ Molly ≠ UI.
5. **Particles & interjections** — only after the line already sounds TW.
6. **Consistency pass** — same concept = same TW word every time (see settled list below).

---

## 3. Orthography (already settled in this repo)

- **Script:** Traditional Chinese throughout.
- **Quotes (render):** TW uses `「…」` (see `AI_HANDOFF.md`).
- **Asides:** `黛安：（小聲）……` — full-width `（）`, tight to the colon, no space after `）`.
- **Titles:** `《不可兒戲》`, `《外緣》` — book-title marks, no `<EM>`.
- **Bra:** TW **胸罩** (CN **文胸**) — never mix.
- **Connector:** TW **接著** (CN **接着**).

Do not “fix” voice by changing punctuation house style.

---

## 4. Lexicon — high-value CN → TW swaps

Use TW forms in **narration and dialogue** unless a British in-world term must stay (street names, *Outside Edge*, pounds as 英鎊, etc.).

### Daily life / transport / places

| Prefer TW | Avoid / CN-leaning | Notes |
|-----------|-------------------|--------|
| 計程車 | 出租車、的士 | Already strong in TW files |
| 公車 | 公共汽車、公交 | |
| 腳踏車 / 自行車 | 单车（ peninsular） | Context |
| 人行道 | 步行道 | |
| 地下道 | 过街地道 | |
| 停車場 | 停车场✓ / 停车位 wording | TW 車 |
| 大樓 | 大厦（ok） | Prefer 大樓 for ordinary blocks |
| 社區 | 小区 | |
| 便利商店 / 超商 | 便利店 | |
| 寄物 / 置物 | 寄存 | |
| 排隊 | 排队✓ | Characters; watch verb habits |
| 捷運 | 地铁、轨道交通 | Only if London Tube is localized that way — this game is UK; usually keep 地鐵/地下鐵 as “subway/underground” sense, or 地下鐵 |

**UK setting note:** Prefer TW *wording* for generic nouns (計程車、公車、廁所). Do not rename London into Taipei. “Tube / underground” can stay 地下鐵／地鐵; don’t invent 淡水線 jokes.

### Money / shops / food

| Prefer TW | Avoid |
|-----------|--------|
| 英鎊 | £ as sole unit in running TW prose |
| 結帳 | 买单、埋单 |
| 優惠 | 优惠✓；少用 划算口语堆叠 |
| 品質 | 质量 |
| 影片 | 视频（看戲／節目脈絡） |
| 螢幕 | 屏幕 |
| 軟體 | 软件（rare in this game） |
| 資訊 | 信息 |
| 資料 | 材料（for “info/materials”） |

### Body / toilet / desperation (this game’s core)

| Prefer TW | Avoid / stiff | Notes |
|-----------|---------------|--------|
| 廁所 | 卫生间、洗手間（too hotel）、公厕腔 | Gallery already likes 流動廁所、尿尿 |
| 化妝室 | optional for posh Ladies | Theatre/foyer “Ladies” → often **女廁** / **化妝室** by venue |
| 尿尿 / 小便 | 排尿（wiki-clinical only） | Playable: 尿尿 is natural TW; don’t overdo |
| 憋尿 / 很急 | 尿急到……堆砌 | |
| 内在／內心 | — | |
| 胸罩 | 文胸 | Settled |
| 內褲 | 裤子（ambiguous） | EN “pants” spoken may stay 內褲／褲子 by sense |
| 連身裙 | 连衣裙✓ | Characters |
| 計程車 | — | |

Settled project TW-only (do **not** copy onto CN):

- **流動廁所** (CN 移动厕所)
- **樹叢** (CN gallery 灌木)
- **尿尿** on several Gallery pee leaves (CN often 小便)
- **西洋棋課** (CN 下棋课)
- **站不定** for fidget (not 站不住)
- **管理員** for caretaker

### Verbs & fillers that flip the accent

| TW-leaning | CN-leaning / flat |
|------------|-------------------|
| 先…就好、先這樣 | 先…吧（ok）、算了吧 堆 |
| 好了、好喔 | 行、行了（北方） |
| 可以啊、好啊 | 可以的、行的 |
| 有點、蠻、滿 | 比较、十分、非常（narration OK; dialogue softens） |
| 超…、好… | 非常…（dialogue） |
| 差不多、差不多了 | 快了吧 |
| 這樣子、這樣 | 这样的话（heavy） |
| 不然 | 要不然（both OK; TW loves 不然） |
| 還是…好了 | 还是…吧 |
| 不好意思 | 抱歉（both; TW dialogue leans 不好意思） |
| 麻煩你… | 请你…（stiffer） |
| 謝謝喔 | 谢谢啊 |

---

## 5. Grammar & sentence shape (beyond vocabulary)

### Aspect & result

- Prefer **了 / 過 / 著** patterns TW speakers actually finish with: `我快受不了了`, `我已經去過了`, `她一直憋著`.
- Soft obligation: **該…了**, **得先…**, **要先…才行**.
- Capability: **沒辦法**, **來不及**, **還來得及嗎** — already good TW; keep.

### Questions

| Pattern | TW feel | Overused CN textbook |
|---------|---------|----------------------|
| …嗎？ | Fine, neutral | — |
| …好不好？ / …可不可以？ | Softer ask | 可以吗？ only |
| …對不對？ / …是不是？ | Confirmation | — |
| …吧？ | Seeking agree | Don’t turn every 嗎 into 吧 |
| …呢？ | Soft follow-up | — |

**Rule:** Change the *ask shape* when Diane is shy or bargaining (廁所、秘密). Keep plain 嗎 for factual checks (`票你帶了嗎？`).

### Softeners & hedges (Taiwan conversational)

Sprinkle **meaningfully**, not every clause:

- Prefaces: `那個…`, `嗯…`, `呃…`, `對了…`, `不然這樣…`
- Softeners: `就是…`, `有點…`, `好像…`, `差不多…`, `可能…`
- Closers: `…就好`, `…沒關係`, `…真的假的`（慎用）, `…啦`（輕）

Diane’s shy register loves **不好意思 / 對不起 / 真的假的不要** — keep her polite; TW politeness is often *softer*, not *colder*.

### Narration vs dialogue

- **Narration** (second-person “你…”): clear TW lexicon, **fewer** sentence-final particles. Narrator isn’t a valley girl.
- **Diane dialogue:** most TW colour lives here.
- **YOU dialogue:** slightly blunter is OK (player agency), still TW lexicon.
- **Molly / others:** own voice; Molly can be brasher — still TW words, not CN slang.

---

## 6. Particles — use with intent (not as the pass)

Particles are **prosody in text**. Wrong particle = wrong attitude.

| Particle | Typical feel | Good for | Bad for |
|----------|--------------|----------|---------|
| **喔** | soft notice / gentle remind | `還剩很多頁喔？`, `下週見喔` | Every sentence |
| **耶** | light surprise / mild complain / soft emphasis | `挺晚的耶`, `你很壞耶` | Formal narration |
| **啦** | soften command / light 抱怨 / intimate | `我都快急死了啦`, `知道了啦` | Cold facts |
| **啊** | open emotion | `好舒服啊` | Already heavy in CN files — don’t double |
| **呢** | soft question / contrast | `你呢？`, `怎麼辦呢` | — |
| **吧** | suggestion / confirm | `可以吧？`, `走吧` | — |
| **齁** | very Taiwan casual check-in | rare; young chat | Don’t invent a 齁 Diane |
| **捏 / 呢** | soft; 捏 appears in files | careful | Don’t confuse with CN 捏（pinch） |
| **囉** | light conclusion | `下車囉` | — |
| **欸** | call attention | opening | — |

**Anti-pattern:** `還有很多頁嗎喔？` / `已經滿晚的了耶啦` — stack = fake.

**Worked example (user-approved direction):**

| Before (CN-flavoured TW shell) | After (TW voice) |
|-------------------------------|------------------|
| 黛安：還有很多頁嗎？已經滿晚的了。 | 黛安：還剩很多頁喔？挺晚的耶。 |

Why it works:

- **還有 → 還剩** (remaining pages; more oral)
- **嗎 → 喔** (soft wonder, not quiz)
- **已經滿晚的了 → 挺晚的耶** (natural complain; 滿晚 is regional but the whole cadence was stiff)

---

## 7. Register map for this game

| Voice | TW goal | Particle budget |
|-------|---------|-----------------|
| Diane | Soft, embarrassed, polite, sometimes teasing | Medium — shyness + intimacy |
| YOU | Clear choices, can be cheeky | Low–medium |
| Narration | Fluent TW prose, literary-light | Very low |
| Molly / hen girls | Chatty, pushy | Medium–high OK |
| UI / Gallery / status | Short, standard TW UI | Almost none |
| Wiki | Neutral encyclopedic TW | None of the chat particles |

**Intimacy scenes:** TW erotic narration prefers concrete verbs already in house style (`撫摸`, `愛撫`, `摩挲`, `往上探`) over game-y `探索`. Keep that. Don’t replace tenderness with crude BBS slang unless the English is already crude.

**Desperation scenes:** TW can be blunt (`好急`, `快憋死了`, `尿尿`) while Diane’s *spoken* lines stay embarrassed (`不好意思`, `真的不行了`). That contrast is the character.

---

## 8. Rhythm & length

- TW oral lines often run **a bit shorter** than formal CN literary translation.
- Break one overloaded CN sentence into two TW beats if needed (still separate `s()` calls per handoff).
- Keep English information; don’t invent plot. Localize *how it is said*.

---

## 9. Consistency checklist (settled TW)

Before finishing a batch, grep-scan:

- [ ] 胸罩 not 文胸  
- [ ] 計程車 / 公車 as default transport words  
- [ ] 流動廁所 / 樹叢 / 管理員 where those referents appear  
- [ ] 站不定 for fidget; 站不穩 only for physical unsteadiness  
- [ ] 接著 not 接着  
- [ ] Gallery leaf titles still match TW playable wording  
- [ ] Bilingual `alternateTranslations` values updated with mono TW  
- [ ] `aligned_text.json` updated  
- [ ] No particle stacks; narration not “耶化”

---

## 10. Method for the full voice pass

Suggested order (do not “particle-pass” the whole file first):

1. **Diane dialogue only** (`黛安：`) — lexicon + question shape + light particles.  
2. **Other speakers** (`你：`, Molly, etc.).  
3. **Narration** — lexicon/collocation; almost no particles.  
4. **Choices / UI** — short TW labels; match mono button style (`開始約會！`, etc.).  
5. **Gallery titles + transcripts** if climax wording changed.  
6. **Bilingual dictionary + aligned_text.json**.  
7. Spot-check: read a Tuesday sofa path and a Saturday prize path **aloud**.

Batch size: prefer scene clusters (album, taxi home, foyer) so voice stays consistent inside a night.

**Do not** machine-convert from CN and ship. Use CN only as a meaning crib; rewrite TW.

---

## 11. Quick before/after gallery (illustrative)

| Role | Flatter / CN-ish | Thorough TW |
|------|------------------|-------------|
| Diane | 還有很多頁嗎？我都急死了。 | 還剩很多頁喔？我都快急死了啦。 |
| Diane | 時間挺晚了吧？再說坐公車要很久呢。 | 有點晚了耶？再說坐公車也好久喔。 |
| Diane | 我能用一下你家廁所嗎？ | 我可以先借用一下你家廁所嗎？ |
| Diane | 現在可以讓我去上廁所了嗎？ | 現在可以讓我去上廁所了吧？ |
| Narration | 你叫了一輛出租車。 | 你叫了一輛計程車。 |
| Narration | 她站不住，一直扭。 | 她站不定，一直扭來扭去。（fidget sense） |
| Choice | 继续探索？ | 繼續撫摸？（already house style） |

---

## 12. Out of scope / don’t bother

- Rewriting English source to match TW cadence.  
- Forcing 台語 （本泉、閩南語）into Mandarin lines (`欲去何處`) — optional flavour only if EN already uses strong dialect; default is Taiwan **Mandarin**.  
- Changing British cultural referents into Taiwan ones.  
- Wiki tone matching playable chat.

---

## 13. One-sentence definition

**Thorough TW voice = Taiwan lexicon + Taiwan sentence habits + character-true softners; particles only as seasoning.**
