# 創意方塊｜課程介紹與體驗報名

正式網站：https://twtimothylu.github.io/courses_introduction/

## 發布與報名
GitHub Actions 在 main 更新時自動將 dist 的公開網站檔案發布至 GitHub Pages。
課程頁的所有體驗按鈕經 trial.html 導向正式 Apps Script 報名頁，保留課程預選。
報名資料寫入私人 Google Sheet，再由 teacher_lu@creativstacks.info 寄送確認信；失敗郵件每 5 分鐘重試。
Sheet ID 僅存放於 Apps Script 指令碼屬性，請勿公開管理表。

## 檔案
- dist/index.html、style.css、app.js：課程網站。
- dist/trial.html：正式報名入口。
- registration-backend/Registration.html：正式表單（內含樣式及互動）。
- registration-backend/Code.gs、appsscript.json：Apps Script 後端與權限。
- registration-backend/Preview.html：舊本機示範原稿，未發布。
- dist/trial.css、trial.js：前端樣式及互動原稿。
- .github/workflows/pages.yml：GitHub Pages 自動發布。

## 驗證
node registration-backend/test-backend.mjs 可離線測試驗證、防重複、先存後寄、重試與寄送結果不確定時的保護，不會傳送真實郵件。
2026-09-26 已使用經授權的虛構資料驗證正式表單、Sheet 記錄、寄件帳號、收件與 LINE 引導。
