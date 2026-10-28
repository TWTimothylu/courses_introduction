# SEO 維護

更新日期：2026-10-19。使用者確認以目前 GitHub Pages 網站為主。

## 正式網址與範圍

- 網站：https://twtimothylu.github.io/courses_introduction/
- 網站地圖：https://twtimothylu.github.io/courses_introduction/sitemap.xml
- 納入首頁、五個課程詳細頁與體驗報名頁，共七個頁面。
- canonical 不含年級篩選、課程預選或快取版本查詢參數。互動參數仍可使用。

## 已實作

- 每頁獨立 title、description、canonical、robots 與 Open Graph / Twitter 分享資訊。
- 真實課堂照片作為分享圖；Python 情境照片沿用既有如實描述，不冒稱實際 Python 課堂。
- JSON-LD：EducationalOrganization、WebSite、WebPage；首頁 ItemList；詳細頁 Course；內頁 BreadcrumbList。未虛構評價、名額或開課日期。
- 首頁五張課程卡片由建置腳本輸出為靜態 HTML，讓未執行 JavaScript 時也可讀取課程和連結；瀏覽器仍可篩選年級。
- sitemap.xml 僅列七個正式網址，不納入內部預覽、資料檔或查詢參數，也不製造 lastmod。

## 更新與驗證

1. 課程來源仍為 scripts/course-details.json；首頁卡片來源仍為 dist/app.js。
2. 執行 `node scripts/build-course-pages.mjs`，會自動載入 scripts/build-seo.mjs。
3. 執行 `node scripts/test-seo.mjs`，檢查唯一標題、單一 H1、canonical、JSON-LD、分享圖、五張靜態卡片與網站地圖。
4. GitHub Pages workflow 自動執行以上建置與檢查，並只發布公開 dist 檔案。

build-seo.mjs 內的正式網域、機構地址與分享圖需隨品牌資料同步維護。若首頁 renderCourses 或 DOM 結構改動，需核對靜態卡片產生流程；測試失敗應修正原因，不能跳過。

## 尚待帳號或舊站管理權限

- Google Search Console 所有權驗證、提交 sitemap、確認索引狀態尚未完成；不能宣稱已收錄或保證排名。
- 舊 creativstacks.info 網站的相應課程頁轉址需在舊站設定。尚未改動舊站，避免逕自變更網域或破壞既有服務。
- 目前網域根目錄 /robots.txt 回傳 404，沒有該檔案的封鎖規則。GitHub 專案子路徑的 robots.txt 不能代替網域根目錄規則，所以本專案沒有新增無效的 robots.txt。

## 2026-10-28 營隊整合
正式根 sitemap 改由 scripts/build-site.mjs 在 _site 統合：原7頁＋營隊入口＋冬令營4頁，共12頁。原 dist/sitemap.xml 保持7頁供常態課單站檢查。營隊報名頁維持 noindex,follow。舊營隊各頁以 canonical 與瀏覽器轉址導向新站；非伺服器301。詳見 camp-integration.md。
