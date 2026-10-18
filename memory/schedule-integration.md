# 每週課表整合｜2026-10-18

## 來源與版面
- 首頁 #schedule 位於課程卡片之後；主導覽新增每週課表。五門詳情頁有 course 屬性篩選與可開班時段展開區。
- 原生 Web Component + Shadow DOM，深藍／淺灰／暖橘、20px 圓角。桌面依星期分欄，650px 以下單欄，沒有水平表格捲動。
- scripts/schedule-markup.mjs 是區塊標記來源；詳情頁仍由 build-course-pages.mjs 產生。
- dist/schedule-config.js 唯一來源設定；schedule-model.mjs 嚴格驗證公開 v1 白名單；schedule.js 處理讀取、分類與狀態；schedule.css 控制元件內部樣式。

## 已接通的自動同步
- 唯一正式資料仍在 A_學生課表系統2026/data/schedule.json，禁止複製至網站倉庫。
- 管理端成功儲存 → publicSchedule(state) → 本機磁碟待傳佇列 → GitHub schedule-data 分支的 schedule.json。
- 公開入口：https://raw.githubusercontent.com/TWTimothylu/courses_introduction/schedule-data/schedule.json
- 管理端 public-sync-config.json 指定現有網站 repository 與獨立分支。使用本機 Git 的既有授權；沒有新增密鑰或把寫入權限交給公開網站。
- 資料分支變動不觸發 main 的 Pages 工作流程。GitHub 保存最後快照，管理電腦關機後仍可讀取。
- 每次寫入只提交公開快照；拒絕較舊 revision、相同 revision 不同內容、Git 非快進覆蓋；相同內容重送不新增提交。
- 失敗後每 30 秒重試，重啟從磁碟佇列與最新正式資料恢復。管理端顯示本機儲存與公開上傳狀態；網站可能仍受 GitHub CDN 快取延遲數分鐘，不能宣稱 15 秒內更新。
- 公開 API 的 Access-Control-Allow-Origin 為 *，讀取 credentials:omit，無管理 cookie。公開 GitHub 寫入仍須授權。

## 顯示規則與容錯
- 只依 courseKey 分類；未分類保留為其他課程，不按 title 猜測。
- open-class 為「無課程，一人可開班」，不代表剩餘名額；不導向任一課程。
- settings.days 決定星期及順序，保留重疊時段。固定週課表不推算日期／假日。
- 台北時區顯示來源 updatedAt，未提供時不以讀取時間替代。
- 初次載入、無資料、未設定、錯誤重試、保留上次資料等狀態。10 秒逾時、可見頁面每 15 秒檢查、資料不變時不重建選單。
- 標題跳脫 HTML，不採用來源任意顏色，額外學生欄位導致整份資料拒收。

## 驗證與維護
- scripts/test-schedule.mjs：白名單、時間邊界、重複 ID、未分類／可開班、重疊時段。
- 管理端原有 16 項測試及新增 3 項 public-sync.test.mjs 通過。新增測試使用隔離暫存 Git 倉庫，不改正式排課。
- 本機瀏覽器已讀取 GitHub 真實 12 個時段，詳情 essential 篩出 1 個對應時段，另保留可開班區。390px 手機實測無水平溢出。
- 正式資料不變地重新儲存至 revision 63，確認後端上傳成功；GitHub raw 回應 Cache-Control:max-age=300，主要網址在首次短時間驗收仍讀到 62，refs/heads 路徑於 19:06 已讀到 63。不可宣稱即時或保證 15 秒；須待主要網址快取更新後核對。
- 本次不處理原有 registration-backend/Code.gs 與 site-design-spec.md 的寄信草稿。
- 修改管理端後更新其 PROJECT_MEMORY.md；修改網站需重新發布 main。只變動課表不需重新發布網站。
