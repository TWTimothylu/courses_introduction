# 創意方塊｜課程介紹與體驗報名

靜態課程介紹網站與體驗課報名頁，包含教室照片、課堂影片、課程篩選及 LINE 聯絡引導。

## 本機預覽

在專案目錄執行 `python -m http.server 4173 --bind 127.0.0.1 --directory dist`，開啟 http://127.0.0.1:4173/ 。

- 首頁：`dist/index.html`
- 報名頁：`dist/trial.html`
- 確認信預覽：`dist/email-preview.html`
- Google Apps Script：`registration-backend/`

## 目前狀態

報名頁為本機示範模式，不會寫入 Google Sheet 或寄出確認信。Apps Script 程式已備妥，尚未安裝、授權及部署；詳細啟用步驟見 [後端說明](registration-backend/README.md)。

上傳此 repository 不會自動啟用網站發布或自動寄信；未包含自動部署工作流程。

## 驗證

使用 Node.js 執行 `node registration-backend/test-backend.mjs`，可離線測試報名驗證、防重複送出及寄信重試。測試不會傳送真實郵件。
