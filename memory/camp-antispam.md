# 營隊垃圾報名處理（2026-11-07）

- 正式表「報名紀錄」第 9、10 列已標記「垃圾報名」，保留原始內容及已交寄狀態。先前寄出的信不能撤回。
- 總覽與三營隊頁的計數、金額及 FILTER 名單均排除 AB 欄為「垃圾報名」的資料；正常紀錄仍為 7 筆。
- Code.gs 搭配 AntiSpam.gs：一次性伺服器驗證題目，30 分鐘有效、至少等待 3 秒；隱藏欄位必須為空；寫入後消耗驗證，同請求重試先查已存紀錄。
- 垃圾來源以管理表已標記資料的 Email 比對，Gmail 大小寫、點及加號別名正規化；移除垃圾標記即可解除封鎖。不同 Email 不會只因電話相同而永久封鎖。
- 同 Email 或電話每小時最多 3 筆；電話比對相容試算表數值遺失前導 0、國碼及空白符號。此為基本防垃圾機制，不保證阻止會解算式或更換身分的機器人；大量濫用應升級託管 CAPTCHA／邊緣流量限制。
- 通知工作略過「垃圾報名」，不變更已交寄紀錄。沒有新增對外通知。
- 前端增加「送出前驗證」，載入失敗時停止送出並保留 LINE 管道；明確未儲存的失敗重新載入題目，未知結果維持原請求重試以免重複寫入。
- 部署：保留原 Apps Script 專案、部署 ID、執行者及權限；以線上原始程式為底只套用防護，保留現行費用與信件。備份在工作區「營隊課程/專案文檔/後台準備/20261107-before-antispam.gs」，不放公開網站。
- 驗證：營隊 22 項測試通過（含 8 項防垃圾測試）；主站 SEO、課表、整站檢查通過。正式頁驗證題可載入及更新；正式 API 無驗證請求回 saved:false，未建立測試報名或寄信。
- 後台部署需包含 Catalog.gs、Code.gs、AntiSpam.gs；勿執行 Acceptance.gs，避免暫時切換正式服務設定。舊分頁須重新整理後作答。

## 改用 Google reCAPTCHA v2（2026-11-07，已正式上線）
- 算術驗證題已移除，營隊報名表與常態課體驗報名表（trial.html）都改用「我不是機器人」勾選框。前端共用根目錄 dist/recaptcha.js（只含公開 site key）；營隊 app.js 以 ../../recaptcha.js 引用，build-site.mjs 白名單已加入。
- 後台兩個 Apps Script 都新增相同的 Recaptcha.gs，需在指令碼屬性設定 RECAPTCHA_SECRET_KEY（不可寫入程式或文件），並新增 script.external_request 權限（部署時須重新授權）。後台只接受 hostname 為 www.creativstacks.info／creativstacks.info 的驗證；reCAPTCHA 管理後台的網域清單也要包含這兩個網域。
- 營隊後台順序：同 requestId 已存紀錄先回傳 → 開放狀態與規則版本 → checkAbuse_ → reCAPTCHA。隱藏欄位及每小時 3 筆限制保留。常態課後台在每日上限檢查後、寫入前驗證。
- 狀態查核（唯讀 GET）：營隊 endpoint 的 protection 應為 recaptcha-v2-20261107；常態課 endpoint 加 ?action=status 應回 {"protection":"recaptcha-v2-20261107"}。2026-11-07 正式查核兩者均回傳新版。
- 後台與前端均已部署；舊分頁須重新整理後使用新的 reCAPTCHA。
- 同一批未提交修改含常態課管理員通知精簡模板草稿；本次以雲端原始碼套用驗證變更，保留線上信件版本，不部署或提交該草稿。
- 雲端：營隊 v10、體驗課 v7，保留原部署 ID、執行身分、存取設定。兩邊已保存私人 RECAPTCHA_SECRET_KEY；使用者完成 Google 授權，checkRecaptchaConnection 實際連線通過，無效 probe 被拒。營隊 manifest 採自動權限推導；體驗課新增 script.external_request 並保留 webapp 設定。舊 Apps Script 體驗入口顯示官方報名連結。
- 本機 build-site、SEO、課表、全站 111 檔案、22 項營隊、體驗課後台及共用驗證器錯誤處理檢查均通過；CI 已加入體驗課及共用驗證器測試。

### 正式驗收
- 網站提交 1152941，GitHub Actions 42373675664 成功。正式營隊與體驗頁皆可載入 Google v2 checkbox，體驗頁取得 form token 後送出按鈕正常啟用。
- 兩個正式 endpoint 各送出缺少／無效 CAPTCHA 的合成資料，4 次均回 ok:false、saved:false 與驗證錯誤，未新增報名或寄信。通過 CAPTCHA 的收件路徑由離線模擬測試涵蓋；未替使用者解 CAPTCHA 或提交真實報名。
- 原費用、收件欄位與雲端信件保持原樣。常態課管理員信件草稿仍留本機，未納入提交。
- 正式畫面證據位於工作區 營隊課程/專案文檔/後台準備/recaptcha-trial-live.png 與 recaptcha-camp-live.png，不公開發布。
