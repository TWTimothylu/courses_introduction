# 營隊維護

本目錄是營隊網站的唯一維護來源，與常態課共同由 courses_introduction 儲存庫發布。

- 2027-winter/data/camps.json 為課程資料；2027-winter/public 為前端來源。
- 2027-winter/dist 是產物；教室根目錄 dist 是維護來源，不可清除。
- 從儲存庫根目錄執行 node scripts/build-site.mjs 組合 _site。
- 修改後執行 node scripts/test-seo.mjs、node scripts/test-schedule.mjs、node scripts/test-site.mjs，並在 2027-winter 執行 npm test。
- 常態課與營隊使用各自既有 Apps Script。前端設定連接正式收件服務；測試不可任意送出正式報名。
- 不因搬移更動價格、日期、年級、像素 ID、收件服務或課表資料分支。
- 既有營隊歷史與原始素材仍保留在工作區的營隊課程資料夾。其 website 僅作舊網址轉址與歷史保留，不再編輯營隊內容。
