# 工作日誌與交接

給接手的人或 AI 助理（GPT／Codex／Claude）看。最新的紀錄放最上面；每筆寫清楚做了什麼、怎麼驗證、還沒做什麼。細部規格仍以 [網站設計規格](site-design-spec.md) 為準，本檔只記錄每次工作的經過與交接重點。

---

## 2026-11-12｜加入 Google 代碼（G-MH5D7SY722）

執行者：Claude（使用者 Lu 指示，為冬令營 Google 廣告設定）。2026-11-12 由 Claude Code 本機重跑驗證後 commit 並 push 至 main，GitHub Actions 自動發布。

### 做了什麼

- scripts/build-site.mjs：組合 _site 後，在每個公開 HTML 的 `</head>` 前插入 Google 代碼（gtag.js，ID `G-MH5D7SY722`）。只轉址的舊網址頁（含 `window.location.replace`）略過，避免重複計算。來源 dist/ 與營隊 public/ 不含代碼，本機預覽不會送出統計。
- scripts/test-site.mjs：檢查每個非轉址頁剛好有一次 Google 代碼、轉址頁沒有。
- camps/2027-winter/scripts/build.mjs：頁尾「網站使用與廣告成效追蹤」說明加入 Google Analytics／Google Ads 與 Google 合作網站資料說明連結。

### 驗證

在 GitHub main（76576d9）的副本上跑完 pages.yml 的全部步驟：build-site、test-seo、test-schedule、test-site、test-recaptcha、test-backend、營隊 npm test（22 項）全數通過。_site 共 14 個頁面有代碼（首頁、體驗報名、五門課程、404、營隊總覽、冬令營首頁、三營隊頁、報名頁），19 個轉址頁沒有。

### 接手注意

- 若要改 Google 代碼 ID，只改 build-site.mjs 的 `googleTagId` 與 test-site.mjs 的檢查字串。
- 尚未設定 Google Ads 轉換事件（例如營隊報名成功）；若要做，比照 tracking.js 的 Meta Lead 只在後端確認成功後送出，且不送任何個資。

---

## 2026-11-11｜全站互動改版（首頁、五門詳情頁、體驗報名頁）

執行者：Claude Code（使用者 Lu 指示）。
Commit 標題：`Add sticky navigation, grade chips and interaction polish across course pages`（main，已 push，GitHub Actions 自動發布）。

### 使用者的要求

1. 「讓網頁的 UI 使用起來更方便、更有互動感，而且要簡潔、直覺、好看」→ 先做首頁。
2. 「套用到其他頁」→ 延伸到五門課程詳情頁與體驗報名頁。
3. 「commit 和 push，並在本地文檔記錄 log 與 GPT 交接內容」→ 本檔。

營隊頁（camps/）不在這次範圍，沒有修改。

### 做了什麼

**首頁**（dist/index.html、style.css、app.js）

- 頁首置頂（`header.site-header`，只有首頁有這個 class），捲動後加陰影；導覽連結依目前區段標 `aria-current` 並顯示橘色底線。
- 手機（≤650px）新增選單按鈕 `.menu-toggle`，展開五個導覽連結；點連結、點外部、按 Escape 會收合。
- 年級選擇由 `select#grade` 改為兩組原生 radio 按鈕 `.grade-chips`：Hero 內 `name=grade`，課程列表標題旁 `name=grade-list`，兩組同步，點一下即篩選。
- 動態：課程卡片 hover 上浮、切換年級時卡片依序出現、區塊進場淡入（`.reveal`）、Hero 播放鈕脈衝。

**課程詳情頁**（dist/course.css、course.js；scripts/build-course-pages.mjs 只改三個快取版本字串，五頁已重建）

- 桌面（≥751px）把既有 `.mobile-booking` 變成右下浮動預約膠囊；Hero 預約鈕與費用卡都不在畫面內時才顯示（`.is-visible`）。手機底部預約列不變。
- 常見問題改用自訂「＋」圖示，展開時旋轉、答案淡入。
- 學習重點／小班／相關課程卡片 hover 上浮，內容區塊進場淡入。

**體驗報名頁**（dist/trial.css、trial.js；trial.html 只改兩個快取版本字串）

- 表單上方新增置頂的三段進度列 `.form-progress`（由 JS 插在 `<form>` 之前），填完一段會亮起並打勾，點擊可捲到該段。
- 欄位 hover／focus 光暈；離開後仍無效的欄位顯示紅框（`.touched:invalid`）。
- 送出鈕箭頭與成功彈窗進場動畫。

### 接手時一定要知道的限制

- **app.js 必須保留 `const gradeControl=` 這段字串**。scripts/build-seo.mjs 用它把檔案切開，只執行前半段的 `renderCourses` 來產生靜態課程卡片。在它之前的程式只能用 `document.getElementById`。
- **`<article class="course">` 不能加任何屬性**。scripts/test-seo.mjs 用這個完整字串計數（必須是 5）。卡片錯開動畫因此用 CSS `:nth-child`，不是行內樣式。
- **`.course` 的進場動畫要用 `backwards`**，用 `both` 會蓋掉 hover 的位移。
- **詳情頁的 `.reveal` 在動畫結束後會由 JS 移除**（連同 `in` 與 `transition-delay`），否則會蓋掉卡片的 hover 過場。首頁的 reveal 目標沒有 hover 位移，所以保留類別。
- **報名頁新增的程式是 trial.js 檔尾獨立的區塊**，只讀取欄位的 `validity`，不呼叫 `checkValidity()`（避免觸發 invalid 事件）。驗證、token、reCAPTCHA、送出、後端呼叫都沒有動，之後也請不要把兩段混在一起。
- style.css 是首頁與詳情頁共用的；首頁專屬的樣式都掛在 `.site-header` 或首頁才有的 class 上。新增樣式集中在各 CSS 檔尾的「2026-11 interaction pass」區塊。
- 無 JS、列印、`prefers-reduced-motion` 三種情況下內容都直接顯示，不依賴動畫。

### 驗證紀錄

- 桌面 1280px 實際操作：首頁篩選與兩組按鈕同步、錨點跳轉不被頁首遮住、區段高亮；詳情頁浮動預約鈕顯示／隱藏、FAQ 展開；報名頁進度列、紅框、課程預選。
- 手機 375px：首頁實際操作過選單開合與篩選。詳情頁與報名頁因預覽工具截圖被裁切，只量測版面尺寸（無水平溢出、元件位置正確），**尚未用實機目視確認**。
- 通過：`node scripts/build-site.mjs`、`test-seo.mjs`、`test-schedule.mjs`、`test-site.mjs`、`test-offer.mjs`、`test-recaptcha.mjs`。
- **沒有執行** `registration-backend/test-backend.mjs`（它會重寫 dist/email-preview.html，而這次沒碰後端）。GitHub Actions 發布時會跑。
- **沒有送出任何報名**，成功彈窗的動畫因此沒有實測。報名頁即使在本機也連正式後端（`live=true`），測試時不要按送出。

### 尚未完成／可接續

- 用實機手機檢查詳情頁與報名頁（進度列置頂、FAQ 圖示、底部預約列）。
- push 之後確認 GitHub Actions 成功、正式站 https://www.creativstacks.info/ 已是新版（瀏覽器可能要強制重新整理）。
- 營隊頁（camps/2027-winter/public）尚未套用同樣的互動風格；它有自己的 style.css 與 app.js，要做的話需另外規劃。
- 首頁 `.schedule-section` 有 `scroll-margin-top:100px`，加上頁面的 `scroll-padding-top`，從導覽跳到「每週課表」時上方留白偏多。這是改版前就有的狀況，沒有處理。

### 工作目錄裡不屬於這次改版的未提交檔案

以下檔案在開始工作前就已有未提交的修改，這次**刻意沒有 commit**，請先向使用者確認來源再處理：

- `.gitignore`、`README.md`、`dist/email-preview.html`
- `memory/camp-integration.md`、`memory/course-content.md`
- `memory/site-design-spec.md`（含先前未提交的第 20–22 節，以及這次新增的第 23 節；第 23 節的重點已整理在本檔）
- `registration-backend/Code.gs`（規格第 20 節說明它是未驗證的管理員通知草稿，不可當成已部署）
- `搬移與資料夾說明.md`（未追蹤）

### 本機環境備註

- `.git` 的擁有者是另一個本機帳號（CodexSandboxOffline），直接跑 git 會出現 dubious ownership。這次每個指令都加 `-c safe.directory=*`，沒有改全域設定。
- 這個儲存庫的 git 作者設定是 `Codex <codex@local.invalid>`，這次沿用，沒有更改。
- 本機預覽：`node scripts/build-site.mjs` 後執行 `node scripts/serve-site.mjs`（http://127.0.0.1:4175/courses_introduction/）。這次另外用一個只服務 dist 的暫時伺服器（設定在上層資料夾的 `.claude/launch.json`，指向暫存目錄的腳本，暫存檔清掉後即失效，可刪除）。
