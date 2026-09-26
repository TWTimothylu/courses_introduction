# 體驗課報名：啟用與交接

## 目前狀態
- 本機預覽：http://127.0.0.1:4173/trial.html
- 確認信預覽：http://127.0.0.1:4173/email-preview.html
- 網站尚未發布。預覽表單不儲存資料、不寄信。
- Google Sheet 已建立：（私人管理表，請由管理者提供）
- 表格屬於 表格管理帳號；經使用者明確同意，已分享 teacher_lu@creativstacks.info 編輯權限。
- 發信程式尚未安裝、授權或部署；尚未實際寄出確認信。

## 正式啟用（等使用者同意啟用後）
1. 在 Google Apps Script 使用 teacher_lu@creativstacks.info 建立專案。
2. 將 Code.gs、Registration.html、appsscript.json 匯入同名檔案。Registration.html 已包含樣式、互動與 Logo。
3. 用 teacher_lu 執行 setup 並由帳號持有人核准 Google 授權。請先在專案設定的指令碼屬性新增 SPREADSHEET_ID，填入私人報名表 ID；setup 會建立每 5 分鐘的寄信補送排程。禁止從 表格管理帳號 部署寄信，程式會檢查執行帳號。
4. 同意正式開放收件後，部署網頁應用程式，以自己（teacher_lu）身分執行，允許家長存取。若組織政策不允許公開存取，先由管理員確認。
5. 使用一筆取得同意的測試報名，確認表格新增、實際寄件帳號、信件收取、LINE 訊息與重試流程。模擬測試不能取代真實整合測試。
6. 以部署的 /exec 網址更新首頁的體驗報名連結，保留 ?course= 課程參數；Registration.html 返回課程連結應改為最終網站網址。網站發布仍需依使用者之後提供的 GitHub 安排。

## 管理表
一位孩子一列，A:Y 共 25 欄。請勿改標題、刪除或重排欄位；後端會核對欄位。Q 欄是聯絡進度、R 欄是 LINE 聯絡狀態、S:U 是寄信狀態與錯誤。V:Y 為重複報名與重試識別資料。不要把管理表設為公開。

已寄出表示 Google 寄信服務已接受，不保證家長收件匣送達。待人工確認表示寄送結果不確定或多次失敗，請先查寄件結果再決定補寄，避免重複通知。

## 測試
執行 test-backend.mjs 可離線驗證：輸入與同意驗證、防重複送出、先存資料再寄信、郵件重試、不確定結果避免重寄、信件 HTML 跳脫。測試不寫入 Google，也不實際寄信。

## 日後編輯
前端原稿在 dist/trial.html、trial.css、trial.js。修改後須同步重新產生 Registration.html；Apps Script 發布版本也需更新。正式收件透過 google.script.run，請勿將本機模擬模式改為假成功或跨網域 no-cors 送出。
