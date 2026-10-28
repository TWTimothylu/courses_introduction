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

## 完成驗收
- 主站提交 7f58969、舊址轉址 d71251b 的 GitHub Actions 均成功。
- 正式首頁、營隊入口、營隊首頁、三課程頁、報名頁、設定與網站地圖均 HTTP 200。
- 本機 88 個公開檔案的 HTML 內部連結及 12 個 sitemap canonical 通過；原 SEO／課表檢查、14 項營隊測試、舊址參數保留測試通過。
- 瀏覽器確認正式首頁可進入營隊專區。手機預覽確認報名頁無水平溢出，預選小小樂高工程師與早鳥4700元正確。
- 正式舊 register.html?camp=essential&utm_source=migration-check#main 已跳至新報名頁，課程、追蹤參數與錨點保留。未送出報名或觸發通知，未重新驗收 Meta 收件。
- 原圖處理工具保留來源素材在工作區營隊課程，亦支援 --source-dir；通知信預覽寫入本營隊 previews/，不公開發布。

## 自訂網域切換（2026-10-28）
主站及營隊正式網址改為 https://www.creativstacks.info/ 與其 camps/ 路徑。Squarespace 根網域轉送至 HTTPS www 並保留路徑；使用者已完成 GitHub 網域驗證、DNS 與 Enforce HTTPS。
後台來源信件網址同步更新；雲端Apps Script維持原部署，舊信連結仍經舊站轉址可用。前端收件端點、像素與課表資料來源維持不變。網站地圖、標準網址、分享資訊、robots與已知舊頁轉址由建置流程維護。
本機SEO／課表／全站109檔案檢查、14項營隊測試、轉址參數測試通過。未提交真實報名或觸發寄信。

### 新網域發布驗收
主站2bc7092（Actions 40612245753）與舊營隊45b6e46（Actions 40612258358）皆發布成功。正式sitemap的12頁HTTP200且canonical精確相符；robots、已知Google Sites舊Python網址、原專案前綴相容網址及營隊報名頁皆HTTP200。
瀏覽器實測舊Python課程轉到新頁並保留utm；舊營隊報名轉到新網域並預選小小樂高工程師、早鳥4700元。HTTP營隊網址實測301到HTTPS。未提交報名。Search Console仍未登入或提交，不宣稱Google已更新索引。
