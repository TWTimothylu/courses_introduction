# 課程探索互動卡片｜2026-10-19

原詳細頁 hero 的 concept-art 抽象符號改為真實照片＋三步驟互動卡片。保留各課程橘、藍、紫、綠配色。

資料由 scripts/course-details.json 的 exploration 定義 title / asset / alt / steps，每個步驟為按鈕名稱、說明、重點標記。build-course-pages.mjs 產生預設第一步 HTML。course.js 控制 tab 選擇、焦點與照片標記，不自動輪播、不改變照片內容。

簡易班使用 essential-project 作品特寫；其他課程使用相應現有素材。兩門 Python 保留「非 Python 課堂實拍」的情境來源註記，不捏造作品成果。

使用 role=tablist/tab/tabpanel、aria-selected、aria-controls；左右鍵循環、Home/End；預設第一步不互動也能讀懂。切換有輕微淡入，尊重 reduced-motion。640/1200 WebP 與 srcset 沿用，沒有新增原始大圖。

驗證：五頁生成、所有圖片檔存在、JS 語法；390px 簡易班切換第二步及鍵盤第三步時，選中樣式、說明、標記同步且無水平溢出。
