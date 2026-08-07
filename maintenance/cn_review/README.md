# CN review tooling (optional archive)

**Not part of the playable ship path.** Current Chinese is whatever is in `outputs/cn/` and `aligned_text.json`.

This folder is leftover interactive diff tooling. Prefer not to use it unless the user explicitly asks for a mass CN comparison pass. See `maintenance/AI_HANDOFF.md` for current conventions.

---

把两份中文差异摊开对照时（仅在用户明确要求时）可用下面步骤。

## 1. 打开审阅页


不要用 `file://` 直接双击（浏览器会拦 `fetch`）。在仓库根目录执行：

```bash
cd maintenance/cn_review
python3 -m http.server 8765
```

浏览器打开：

[http://127.0.0.1:8765/review.html](http://127.0.0.1:8765/review.html)

## 2. 怎么点

- 每条显示 **EN / 旧版 CN / 新版 CN**
- **用旧版 (1)** / **用新版 (2)** / **跳过 (S)**：按审阅需要选择；选择存在浏览器 `localStorage`
- **导出 decisions.json** 下载到本机（建议放到 `maintenance/cn_review/decisions.json`）

可筛选：未决定 / story|choice / 搜索。

## 3. 写回仓库

```bash
# 若 diff 过期，先重生数据
python3 maintenance/cn_review/generate_diff_data.py

python3 maintenance/cn_review/apply_decisions.py maintenance/cn_review/decisions.json
```

会更新：

- `maintenance/aligned_text.json`（cn）
- `outputs/cn/dianedate_cn.html`
- `outputs/cn/dianedate_cn_bilingual.html`
- 并默认跑 `write_zh_tw.js` 同步台版

改动面大时再重生 guides/transcripts（脚本结束时会提示）。

## 4. 数据说明

| 文件 | 作用 |
|---|---|
| `diff_data.json` | 2163 条旧/新对照（可重生） |
| `review.html` | 点击审阅 UI |
| `decisions.json` | 你导出的选择（本地文件，勿强行当最终真相提交前请过目） |
| `apply_decisions.py` | 按选择写回 |
| `generate_diff_data.py` | 重生对照表 |

`skip` = 暂不改；未出现在 `decisions` 里的条目也保持现状。
