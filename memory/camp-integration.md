# 教室與營隊整合（2026-10-28）

- 主儲存庫：TWTimothylu/courses_introduction；主站網址維持不變。
- camps/index.html：固定寒暑假營隊入口。camps/2027-winter：營隊來源、資料、測試與後台程式。
- scripts/build-site.mjs 建置兩站，再依公開檔案白名單組合 _site；不刪除或覆蓋常態課來源 dist。
- 根 sitemap 統合原 7 頁、營隊入口及 4 個冬令營內容頁，共 12 頁。營隊報名頁維持 noindex。
- 原營隊倉庫保留 Git 歷史並發布舊路徑轉址；保留 query 與 hash，不會發出報名請求。GitHub Pages 靜態轉址使用瀏覽器 location.replace，並提供手動連結與 canonical，非伺服器 301。
- schedule-data 分支與課表來源、兩套 Apps Script 端點、Meta 像素設定與價格規則均維持原設定。
- 新營隊後台來源中的通知信連結已更新。雲端 Apps Script 本次未重新部署，現行信件舊網址經轉址仍可使用。
- 原常態課未提交的寄信草稿與搬移紀錄保留在工作區，不隨整合發布。
- 舊資料夾的營隊原始素材與歷史文件保留；今後課程內容以本儲存庫 camps/2027-winter 為準。

發布與驗證結果由本次完成紀錄補充。
