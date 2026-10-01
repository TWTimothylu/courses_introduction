# 創意方塊｜課程介紹與體驗報名

正式網站：https://twtimothylu.github.io/courses_introduction/

## 發布與報名
GitHub Actions 在 main 更新時自動將 dist 的公開網站檔案發布至 GitHub Pages。
課程頁的所有體驗按鈕開啟 GitHub Pages 上的 trial.html，保留課程預選。
表單使用不帶登入憑證的 JSON POST 連接 Apps Script，避免多個 Google 帳號造成的跳轉錯誤。收到後端確認才顯示成功。
報名資料寫入私人 Google Sheet，再由 teacher_lu@creativstacks.info 寄送確認信；失敗郵件每 5 分鐘重試。
Sheet ID 僅存放於 Apps Script 指令碼屬性，請勿公開管理表。

## 檔案
- dist/index.html、style.css、app.js：課程網站。
- dist/trial.html：正式報名表。
- registration-backend/Registration.html：保留的 Apps Script 表單版本；GitHub 正式網站使用 dist/trial.html。
- registration-backend/Code.gs、appsscript.json：Apps Script 後端與權限。
- registration-backend/Preview.html：舊本機示範原稿，未發布。
- dist/trial.css、trial.js：前端樣式及互動原稿。
- .github/workflows/pages.yml：GitHub Pages 自動發布。

## 驗證
node registration-backend/test-backend.mjs 可離線測試驗證、防重複、先存後寄、重試與寄送結果不確定時的保護，不會傳送真實郵件。
2026-09-26 已使用經授權的虛構資料驗證正式表單、Sheet 記錄、寄件帳號、收件與 LINE 引導。

2026-09-30：新報名另寄管理員通知至 arway.lu@gmail.com，管理員狀態獨立記錄於 AA:AE；既有報名不補寄。失敗由原有五分鐘排程重試，上限三次；寄送結果不明時標記人工確認。

## 課程內容外部記憶

[五門常態課程資料與改寫文案](memory/course-content.md)：來源、費用教具、年級差異、文案草稿及後續擴寫規則。

## 網站設計與功能外部記憶

[網站設計規格](memory/site-design-spec.md)：色彩、版面、元件、響應式、報名與寄信、發布與接續工作注意事項。修改前先閱讀根目錄 AGENTS.md。

## 獨立課程詳情頁

五個 course-*.html 由 scripts/course-details.json 與 scripts/build-course-pages.mjs 產生；修改後執行 node scripts/build-course-pages.mjs。共用 dist/course.css 與 course.js；首頁新增詳情入口，保留年級篩選。部署白名單已加入五頁及共用樣式／互動。

## 素材優化

2026-10-01：照片使用640／1280 WebP及srcset，Logo另輸出128px；影片使用壓縮 MP4，封面點擊後才下載。原始素材保留。詳見memory/site-design-spec.md第16節，重建腳本scripts/optimize-media.py。
