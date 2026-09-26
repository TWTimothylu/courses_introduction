# 體驗課報名：管理與交接

## 已啟用
- 正式網站：https://twtimothylu.github.io/courses_introduction/
- 表單直接顯示在 GitHub Pages，透過 credentials: omit 的 JSON POST 呼叫 Apps Script doPost，任何家長可填寫，不需登入。
- 執行與寄件帳號：teacher_lu@creativstacks.info。
- 報名管理表維持私人；ID 存於指令碼屬性 SPREADSHEET_ID。
- HOME_URL 指向正式 GitHub Pages 首頁。
- setup 已執行，每 5 分鐘 processMailQueue 檢查待寄郵件。
- 2026-09-26 已驗收一筆「系統測試」，確認信送達指定驗收信箱。

## 管理表
一位孩子一列，A:Y 共 25 欄。請勿改標題、刪除或重排欄位。
Q 欄聯絡進度、R 欄 LINE 聯絡狀態、S:U 寄信狀態與錯誤，V:Y 為去重和重試資料。
不要將管理表公開，也不要在空白資料列預填 FALSE，否則 appendRow 會從預填列之後開始。
已寄出表示 Google 寄信服務接受；待人工確認須先確認寄件結果，避免重複補寄。

## 更新網站
推送 main 會自動發布 GitHub Pages。發布範圍明列於 .github/workflows/pages.yml。
正式表單修改 dist/trial.html、trial.css、trial.js，推送 main 後生效。Registration.html 為舊 Apps Script 表單備用原稿。
更新 Code.gs 或 Registration.html 後，必須同步至 teacher_lu 的 Apps Script 專案，儲存後在「管理部署作業」選新版本並部署，保留既有網址。
新環境初始化時設定 SPREADSHEET_ID、HOME_URL，執行 setup，部署為自己執行、所有人可存取。
不可使用 no-cors 或假成功代替伺服器確認。

## 測試
node registration-backend/test-backend.mjs 執行離線測試，不寫入 Google、不寄真信。
正式整合測試需使用經授權的測試收件信箱，並清楚標示虛構資料。
