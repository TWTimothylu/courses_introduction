# 創意方塊網站｜設計與功能規格外部記憶

版本 1.1｜2026-09-30｜依目前本機實作整理
基準：a6ea352 後新增五門獨立詳情頁，實作入口見第15節。
本文件記錄已實作的現況，不是新改版提案。本次讀取原始碼、樣式、素材清單與既有操作紀錄，未重新逐頁進行線上視覺或端到端驗收。

## 1. 接續工作先讀

1. 閱讀本文件，掌握設計、流程與維護界線。
2. 閱讀 [課程資料與文案](course-content.md)，區分原始課程事實、文案草稿與年級差異。
3. 以當下程式碼確認是否已有後續改動；文件與程式不同時，不要直接覆蓋任何一方，先確認修改來源。
4. 使用者新指示優先。完成變更後同步記錄規格與驗證結果，避免以聊天記憶代替專案資料。

## 2. 專案定位與已確認方向

對象是替孩子找樂高機器人、Scratch 或 Python 課程的家長。目的為減少找課程所需步驟，快速回答「適合誰、學什麼、怎麼上、如何體驗」。使用者希望像買 iPhone 一樣容易理解：簡潔、有設計感、有適度動態，透過實際照片、影片及成果建立信任。

- 主語言為繁體中文，英文字眉用作輔助層次，不取代主要資訊。
- 視覺以白／淺灰、深藍、暖橘為主；照片與課程內容為重點。
- 寬留白、大標題、圓角卡片、短句、明確主按鈕。不要把重要資訊藏進多層導覽。
- 品牌主標「讓孩子的想像，真的動起來。」
- 使用者已要求移除「現行課程資訊」區塊及課程費用警語。現有課程下方仍有班別評估、堂數與開班名額的短說明，不能誤認為完全禁止任何補充文字。
- 目前包含課程首頁、五門獨立詳情頁、體驗報名頁；首頁卡片「認識這門課」通往獨立頁。

## 3. 路徑、檔案與權威來源

本機根目錄：C:/Users/Lu Shih Wei/Desktop/ok lego/homepage
舊位置 course-site 已搬離，不要繼續修改舊路徑。
GitHub repository：https://github.com/TWTimothylu/courses_introduction.git
正式根網址：https://twtimothylu.github.io/courses_introduction/

| 檔案 | 責任 |
|---|---|
| dist/index.html | 首頁結構、照片、影片、實績與連結 |
| dist/style.css | 首頁樣式、響應式與後段覆寫 |
| dist/app.js | 五門課程資料、分組篩選、課程卡片、影片互斥播放 |
| dist/trial.html | 正式體驗報名欄位、提示、個資說明、成功彈窗 |
| dist/trial.css | 報名頁與彈窗視覺 |
| dist/trial.js | 預選課程、表單狀態、驗證、後端呼叫、LINE 訊息複製 |
| dist/assets/ | 正式照片、Logo、影片 |
| registration-backend/Code.gs | 收件、Sheet、家長／管理員寄信、重試 |
| registration-backend/appsscript.json | Google 權限、V8、Asia/Taipei 時區 |
| registration-backend/Registration.html | 保留的 Apps Script 託管表單版本；不是 GitHub 正式前端 |
| registration-backend/Preview.html | 歷史預覽原稿，不是正式入口 |
| registration-backend/test-backend.mjs | 離線後端測試，模擬 Google 服務 |
| .github/workflows/pages.yml | GitHub Pages 發布白名單 |
| memory/、AGENTS.md、README.md | 持久說明、設計決策與接續入口 |

採原生 HTML/CSS/JavaScript，無需 npm 建置框架；不可僅為小改動改造成另一套框架。dist 是目前直接編輯與發布的來源，不是可任意刪除重建的輸出資料夾。

## 4. 視覺規格

### 4.1 色彩

| 用途 | 首頁 | 報名頁 |
|---|---|---|
| 主要文字／深藍 | #152640 | #152640 |
| 暖橘 | #df591b | #b94413 |
| 次要文字 | #5e6877 | #637083 |
| 淺灰 | 卡片 #f5f6f8 | 整頁 #f5f7fa |
| 邊線 | #dce1e7 | #dce2ea |
| 一般表面 | #ffffff | 表單 #ffffff |
| 鍵盤焦點 | #2771d8，3px，外距5px | #367edb，3px，外距3px |

補充：首頁選課主按鈕 #ba4612，hover #96380e；深色影片區 #112239；交錯課程卡片頂部 #edf3fa；頁尾邀請區 #f0f3f7。報名送出 hover #93330b；LINE 按鈕 #087e42；錯誤文字 #a12323；勾選時段背景 #ecf3fc。

上述為實際兩份 CSS 的值，並非已統一的共用 token 系統；不要假設全站橘色只有一種。

### 4.2 字體與尺寸

全站 font-family：Arial, Microsoft JhengHei, sans-serif；無外掛字體。內文基準 16px，行高 1.65。

| 元件 | 首頁 | 報名頁 |
|---|---|---|
| 主標 h1 | clamp(36px,4.1vw,60px)，行高1.22，字距-2px | clamp(36px,4.2vw,58px)，行高1.28，字距-1.7px |
| 區段 h2 | clamp(29px,3.1vw,42px)，行高1.35 | 表單標題27px，手機25px |
| 課程標題 | 24px，手機25px | 欄組 legend 19px |
| 字眉 | 12px，字距2.3px | 12px，字距2px |
| 輔助文字 | 多為13–15px | 多為13–14px |
| 表單控制項 | 選課選單繼承16px | input/select/textarea 16px，placeholder 14px |

### 4.3 元件形狀與動態

- 首頁一般按鈕為膠囊形（radius 100px）；選課主按鈕為全寬圓角矩形（12px），最低54px高。
- 課程卡 radius 22px、1px邊框，頂部淺灰／淺藍、內文白底；內距約24–26px。
- 首頁主照片 radius 26px；成果照片22px；影片18px。
- 報名卡片 radius 24px，padding38px，柔和陰影 0 12px 48px #15264006。
- 輸入框 radius9px，min-height48px，padding12px 13px，文字區可垂直調整。
- 首頁卡片 appear：0.4秒淡入並由下8px移入；按鈕hover約上移2px。沒有自動輪播或影片自動播放。
- 首頁平滑錨點捲動、scroll-padding-top95px；reduced-motion 關閉動畫與transition。報名頁也尊重 reduced-motion。

## 5. 首頁：區段與互動

### 5.1 由上到下的資訊架構

1. 頁首：Logo＋教室名稱；探索課程、課堂現場、學習成果三個錨點；預約免費體驗。
2. Hero：左邊品牌字眉、主標、短介紹、選課器；右邊上課照片與指向影片區的播放形狀連結。
3. #courses：動態結果標題、課程卡片、班別與堂數說明。
4. #classroom：深藍底、两支課堂影片與簡短介紹。
5. #results：左邊實績文字、右邊競賽照片。
6. 結尾：先體驗，再決定；預約免費體驗、LINE 課程諮詢。
7. 頁尾：教室名稱、地址及 Google Maps 導航。

頁首不是 sticky。主照片播放形狀的按鈕是移動到 #classroom，不是開啟影片彈窗。

### 5.2 年級選課器（重要歷史修正）

家長曾反映選完年級後，不知道接著做什麼。因此標籤與說明移到選單上方，結果數與醒目的橘色 CTA 放在同一淺灰容器內，不能退回分散的文字小連結。

- 標籤：先選年級，找到適合的課程。
- 說明：選好後，點下方按鈕查看課程內容與費用。
- 選項：所有年級、1–3、3–7、6–12。
- change 立刻篩選並重繪卡片，不等待按鈕提交；CTA 只負責捲到 #courses。
- 同時更新 #count、#course-cta-label、#course-results-title；count 使用 role=status、aria-live=polite。
- 程式以 course.group === value 分組相等判斷，不是 min/max 區間交集。1–3 顯示1門、3–7顯示2門、6–12顯示2門；all顯示5門。邊界重疊不會自動顯示別組課程。
- 課程順序 essential、prime、scratch、robot-python、python。年級與舊站的差異詳見 course-content.md。

### 5.3 課程卡片

固定順序：小標 → 名稱 → 一句介紹 → 年級徽章 → 三項特色 → 價格及12堂／1.5小時 → 教具簡述 →「認識這門課」詳情頁連結 → 預約免費體驗。

課程詳情跳往各自 course-<id>.html；卡片 flex 讓詳情入口及預約按鈕往底部對齊。價格 essential 6,600，其餘7,800；以實際 course-content.md 的來源規則為準，不能誤寫含所有教具費。

五張卡片各導向 trial.html?course=對應ID；頁首與結尾導向 trial.html。首頁總計七個預約入口，不能改回舊 Google Forms 或 Google Drive 頁。

### 5.4 影片與實績

兩支影片用原生 controls、playsinline、preload=metadata；src 帶 #t=1，機器人影片有 class.jpg poster，Scratch 無明確poster。一支播放時 JavaScript 暫停另一支；不自動播放。影片桌面高度340px、object-fit:contain、深底。

現有實績文字（僅記錄目前頁面，不代表本次重新核實）：WRO全國第三名／北區第二與第四名；2024貓咪盃 Scratch 優等與佳作（澎湖優等、臺北佳作）；2023全國程式力競賽 Python 佳作。WRO年份未列；新增實績前要有可核對來源。五個課程來源頁本身不包含這些實績證據。

## 6. 響應式尺寸

| 範圍 | 首頁 |
|---|---|
| 大於1000px | wrap max1280px、左右48px；header max1440px、高88px；Hero等寬雙欄、gap58px；課程三欄gap20px；成果雙欄gap76px |
| ≤1000px | wrap/header左右28px；Hero gap30px；課程兩欄；成果gap40px |
| ≤650px | header高76px、左右20px、隱藏nav；wrap左右22px；Hero一欄、主標41px、照片290px；課程／影片／成果一欄；成果照片400px；closing標題38px；footer區塊堆疊 |

桌面Hero照片420px高；成果照片660px高、object-fit:cover。手機影片aspect-ratio:1、max-height450px。

| 範圍 | 報名頁 |
|---|---|
| 大於950px | topbar max1300px、padding20px 44px；layout max1220px、左右32px、上38px下70px、欄比.9fr/1.1fr、gap65px；intro sticky top32px；欄位兩欄 |
| ≤950px | layout gap30px、左右24px；表單padding25px；欄位單欄；intro取消sticky；h1 43px |
| ≤700px | 主版面單欄、左右18px、gap28px、上22px；表單padding24px 20px、radius20px；h1 38px、隱藏第二個換行；左側地址區隱藏；Logo46px |

時段選項維持兩欄，最後「時間彈性，可討論」跨滿；不是所有控制項在手機都變一欄。

## 7. Logo 與素材

| 素材（dist/assets/） | 用途 | 檔案大小 bytes |
|---|---|---|
| brand-logo.png | 兩頁品牌Logo；報名頁favicon | 690470 |
| class.jpg | Hero照片、機器人影片poster | 2129263 |
| competition.jpg | 學習成果競賽照片 | 1924905 |
| robot.mp4 | 機器人課堂影片 | 13862767 |
| scratch.mp4 | Scratch影片 | 14070543 |

首頁Logo64×64px、手機46×46px；報名頁56×56px、手機46×46px。Logo原始PNG有白底：報名頁以 mix-blend-mode:multiply 融入淺灰背景，沒有真的修改成透明PNG。更換背景或移除此樣式需重新檢查白框。

首頁favicon是內嵌四格橘色SVG，不同於報名頁PNG。Hero照片fetchpriority=high、成果照片loading=lazy，都有中文alt。Logo本身alt為空，旁邊文字承擔品牌名稱。素材身份與使用授權不能只憑檔名推定。

## 8. 報名頁：內容與欄位

左區：主標「一次體驗，發現孩子的無限可能。」；三步驟為填寫意願 → 收到確認信並加入LINE告知姓名 → 老師確認時間。桌面顯示地址與地圖。右區白卡片標題「認識孩子，從這裡開始。」每份表單只填一位孩子。

| 欄組 | 欄位／name | 限制 |
|---|---|---|
| 01關於孩子 | 小朋友名字 childName | 必填、40字 |
| 01 | 年級 grade | 必填、精確1–12年級；不是首頁的三個分組 |
| 01 | 學校 school | 必填、80字 |
| 02探索課程 | course | 必填、五門課＋unsure請老師推薦 |
| 02 | preferredTimes | 必選至少一項，可複選 |
| 02 | experience | 必選經驗種類 |
| 02 | experienceNotes | 選填、500字、2列textarea |
| 03聯絡 | parentName | 必填、40字 |
| 03 | phone | 必填、最長20；去空格連字號後須09加8碼，或+8869加8碼 |
| 03 | email | 必填、最長160、trim及小寫 |
| 03 | referrer | 選填、80字；範例「王小明的媽媽／爸爸」 |
| 03 | notes | 選填、800字、3列textarea |
| 同意 | consent | 必勾；個資說明可展開 |
| 隱藏 | website | honeypot，正常應空白，不可當作家長欄位顯示 |

時段：平日下午、平日晚上、週六上午、週六下午、週日上午、週日下午、時間彈性可討論（實際送值含逗號「時間彈性，可討論」）。
經驗：沒有，想第一次試試／玩過樂高，尚未接觸程式／學過機器人或 Scratch／學過 Python 或其他文字程式／其他經驗。

推薦人位於家長Email與其他安排需求之間；提示填孩子姓名的媽媽／爸爸，方便辨識，沒有可留白。

course query只預選合法課程，無效值保留預設。改年級只改提示，不會強制刪除課程選項。欄位label與錯誤提醒、電話/email輸入型態及autocomplete須保留。

## 9. 送出、錯誤與成功彈窗

現行 dist/trial.js 的 live=true，包括本機開啟也可能連到正式系統；不要因為localhost就當成假資料模式。

1. 頁面初始取得token，按鈕禁用、顯示「準備報名表…」。成功後啟用「送出體驗報名 →」。連線失敗保留禁用並提示重整或LINE。
2. 使用HTML必填驗證、時段自訂驗證、電話規則；資料以FormData整理，帶submissionId、token、privacyVersion。
3. 送出期間顯示「正在送出，請稍候…」、禁止重複操作。
4. 僅在後端回覆 ok=true 時顯示報名編號與成功dialog；不能僅因fetch沒有丟錯就宣告成功。
5. 失敗保留表單、允許同頁重送並沿用requestId；重新載入後會產生新requestId，不是跨分頁永久去重。
6. 成功後停用送出，按鈕「報名已收到」。確認信sent與pending文案不同，不把尚待寄送宣稱已寄。

彈窗：原生dialog.showModal；max-width510px、width calc(100% - 32px)、radius24px、padding36px、max-height90vh可捲；遮罩#102139aa搭配4px blur。手機padding28px 22px。具成功勾號、關閉×、我知道了；關閉不是撤銷報名。

標題「最後一步，讓我們在 LINE 找到你。」；綠色按鈕「加入 LINE，聯繫安排體驗課 ↗」。可複製訊息帶孩子姓名和所選課程；剪貼簿失敗則提示手動複製。LINE加入不會自動傳訊，也未串接LINE API查詢好友或訊息狀態。

成功代表收到意願，不代表體驗時間確定。所有相關文案保留「老師確認後才完成預約」的意思。

## 10. 連結與固定文案

- LINE：https://lin.ee/7FoFpdM
- 首頁LINE：「加入LINE，讓我們為你推薦課程」；報名彈窗及確認信LINE：「加入 LINE，聯繫安排體驗課 ↗」。兩者目的不同，不統一替換。
- 地址：台北市萬華區莒光路347巷20號1樓。
- Google Maps：https://maps.app.goo.gl/Wwa9s3u1zihoFzgVA 。目前是另開分頁導航連結，沒有內嵌地圖。
- 外部新分頁連結保留 target=_blank 與 rel=noopener。
- 報名頁返回 index.html#courses；使用相對網址，適應 GitHub Pages /courses_introduction/ 子路徑。

## 11. 後端与寄信規格

前端以JSON字串POST到 Apps Script /exec，Content-Type=text/plain;charset=utf-8、credentials=omit、redirect=follow；action為token或submit。這是已修正的多Google帳號相容方式，不要改為報名頁直接跳轉Apps Script。也不要使用no-cors後無法讀取結果卻顯示成功。

部署端點以 dist/trial.js 為權威；程式專案ID：1Clp_utYWo5ZKfaYmx2qLxX9PA9Dz6rnRLgeQjLmUN1UDjsjEcftXBRvJ。
依2026-09-30操作紀錄，正式Apps Script第6版已部署成功，包含管理員通知；本次文件整理未再次向雲端查核。以 teacher_lu@creativstacks.info 身分執行，允許所有人存取報名服務，管理表仍私人。

- Sheet屬於 arway.lu@gmail.com；teacher_lu帳號已獲使用者授權編輯。
- Sheet ID存在Script Properties的SPREADSHEET_ID，首頁網址在HOME_URL；不要把管理表ID或家長資料寫進公開前端、截圖素材或此份可分享文件。
- 先驗證及去重，再appendRow持久保存，才寄家長與管理員信。報名編號CS-日期-UUID前8碼。
- 同submissionId＋相同指紋返回原收件結果；不同內容要求透過LINE更正。
- token有效6小時、至少2秒後可送出；honeypot拒收；同信箱每天最多3筆，全表每天最多100筆；輸入長度、合法課程／經驗／時段、個資版本均驗證。
- 使用LockService，處理試算表公式注入、電話開頭0保留、HTML跳脫。不是完整防機器人驗證或身分認證系統。
- 家長信：寄家長Email，reply-to teacher_lu；主旨「【創意方塊】已收到體驗課報名｜請加入 LINE 安排時間」。視覺深藍品牌條、白卡、淺灰摘要、綠色LINE按鈕；最大560px，標題「報名已收到，請加入 LINE 安排體驗時間。」不要恢復「下一步，在LINE聊聊」。
- 管理員信：另寄 arway.lu@gmail.com，reply-to家長Email；主旨含孩子與課程，內容含報名資料、推薦人、其他需求及私人管理表連結。管理員信採最大640px的欄位表格。
- 兩封信狀態與嘗試次數獨立。每5分鐘processMailQueue，各取最多15筆重試、最多3次；餘額不足不寄。寄送中超過15分鐘結果不明者標「待人工確認」，不可直接重寄。
- 舊報名的管理員通知狀態空白，不補寄。新增欄位只加末端，不搬動既有欄位。
- sendAdminNotificationTest會真的寄出測試信；不是純預覽。2026-09-30已寄一次標示系統測試的通知，執行成功不等同已由使用者確認收件匣。

### Sheet欄位位置（不得任意插欄或改標頭）

| 欄位 | 內容 |
|---|---|
| A–F | 報名時間、報名編號、孩子姓名、年級、學校、體驗課程 |
| G–L | 偏好時段、相關經驗、經驗補充、家長稱呼、手機、Email |
| M–R | 其他需求、個資同意、條款版本、來源、聯絡進度、LINE已聯絡 |
| S–U | 家長確認信狀態、寄信時間、錯誤 |
| V–Y | 請求識別碼、資料指紋、家長信嘗試次數、最後嘗試時間 |
| Z | 推薦人 |
| AA–AE | 管理員通知狀態、時間、錯誤、嘗試次數、最後嘗試時間 |

表名「體驗課報名」。程式比對完整HEADERS且多处按固定索引讀取；完整精確字串以Code.gs為準。LINE checkbox是管理欄位，不是LINE API自動回報。

## 12. 發布、預覽與驗證

GitHub Pages由main push觸發workflow。發布只包含dist/assets及index.html、style.css、app.js、trial.html、trial.css、trial.js、course-*.html、course.css、course.js；memory與後端程式不被放入網站，但若push到公開repository，文件仍可能在repository被閱讀。

不要使用整個dist或專案根目錄作無差別公開：dist/setup-local.html、email-preview.html、歷史預覽及.openai不應成為公開頁面。不要因舊.openai設定或publish.cjs存在，就切換回其他託管方案。

前端更新：編輯對應dist檔 → 檢查顯示與互動 → commit/push main → 確認GitHub Pages正式內容。
後端更新：編輯Code.gs並離線測試 → 同步到正確Apps Script帳號／專案 → 若需新增欄位用updateRegistrationFields → 更新既有部署並建立新版本 → 驗證結果。只push GitHub不會更新雲端Apps Script。

本機預覽要以dist為服務根目錄，不能假設過去127.0.0.1:4173還在執行。不要直接file://驗證正式寄送。未明確要測試真實收件時，避開送出；離線測試用模擬資料。

node registration-backend/test-backend.mjs 驗證必填、去重、先存後寄、雙信重試、防重複、HTML跳脫、電話保留、欄位遷移與舊資料不補寄；不傳送外部郵件，但會重寫dist/email-preview.html，檢查diff避免混入無關預覽更新。

後續視覺驗收建議：桌面、1000/950附近、700/650附近與窄手機；檢查卡片、長中文、欄位、焦點、彈窗可捲與Logo白框。功能驗收：三組篩選及結果數、七個預約入口、課程預選、影片互斥、時段必選、推薦人選填、錯誤重送、成功後LINE文案。

## 13. 已知邊界與不應誤判之處

- 首頁篩選卡片由JS渲染；五門詳情頁為可直接讀取的靜態HTML。無CMS、無即時名額／排課系統、無付費或會員功能。
- CSS後半段的.hero .course-finder是有效覆寫；只讀前段.filter會得到過時排版。.hero-note保留DOM但display:none。
- 成果列為現有展示文字，本文件不新增佐證；課程素材文件中的改寫是草稿，未自動套到首頁。
- 頁面雖顯示準備報名等狀態，靜態網址或快取版本字串不能證明後端部署版本。
- 年級分組與招生資格差異需保留，不在本次記憶文件任務中擅自更改。
- 將來改善載入速度可處理大照片／影片，但先保留原始素材與視覺效果，不要任意換成生成圖片或虛構作品。

## 14. 歷史決策摘要

2026-09-26：GitHub直接報名、Google Sheet＋確認信；修正多帳號跳轉問題；確認信文字改為安排體驗時間。
2026-09-27：報名Logo以multiply融合背景；新增推薦人、同步Sheet；專案搬到homepage。
2026-09-30：新增獨立管理員Gmail通知並部署第6版；建立課程內容外部記憶及本設計規格。

後續規格變更請更新日期、相關章節、程式基準及驗證方式。

## 15. 獨立課程詳情頁（2026-09-30，選項一）

使用者選擇執行獨立頁方案。新增 course-essential.html、course-prime.html、course-scratch.html、course-robot-python.html、course-python.html，皆位於dist根目錄，以相對網址維持GitHub子路徑相容。

內容來源：scripts/course-details.json；由 node scripts/build-course-pages.mjs 產生五頁。修改詳情內容應更新JSON及產生器再執行，不僅修改產出HTML。首頁資料仍在app.js，價格、年級、工具政策變更要同步比對兩處。

頁面順序：返回列表／Hero主標與流程示意 → 可橫向捲動的sticky章節導覽 → 適合對象 → 三個學習重點 → 課堂影片或教室照片 → 創作、觀察、修正三步驟 → 費用與設備資訊 → 四項FAQ → 相關課程與返回列表。

沿用深藍、橘、留白；共享style.css並以course.css補充，詳情主橘#b94413。Hero各課有不同色調的HTML/CSS學習流程示意，明確標示為示意，不冒充學生作品。Scratch使用scratch.mp4、Prime使用robot.mp4；其他三頁使用class.jpg並標「創意方塊教室學習現場」，不宣稱照片為該課專屬作品。所有實際素材沿用既有檔案。

Hero桌面1.1fr/1fr，gap56px；h1 clamp(34px,3.8vw,52px)。主要學習區三欄；750px以下Hero及各區改單欄、標題38px，380px以下33px。750px以下顯示固定底部預約列，含課程名稱、費用、預約按鈕，底部safe-area及body空間避免遮住頁尾。章節導覽保留橫向捲动能力但隱藏捲軸；reduced-motion停用示意動畫。

首頁篩選保存在URL grade及sessionStorage course-grade。詳情入口帶grade，返回index.html?grade=原組別#courses；course.js只接受all、1-3、3-7、6-12，相關課程連結繼承組別。儲存不可用時仍可用URL往返。直接開詳情無既有篩選時，返回該課分組。

每門詳情三個預約入口（Hero、資訊卡、手機列）都帶固定course ID；FAQ用原生details。不修改報名後端、Sheet或寄信。首頁仍保留原有七個預約入口。

驗證：五頁靜態檔案／資產／錨點與各頁三個預約參數檢查通過；app.js與course.js語法檢查通過；瀏覽器桌面與390px手機檢查、返回3-7組兩門課、切換6-12後開Python、報名頁預選python與推薦人欄位存在確認通過。本次沒有送出真實報名或測試郵件。

## 16. 素材載入優化（2026-10-01）

此節取代前文原始素材的正式引用與preload=metadata設定。原始JPG/PNG/MP4仍保留，優化版使用獨立檔名，舊網址仍可用。
- 課堂照：class-640.webp 50,110 bytes／class-1280.webp 123,196 bytes；競賽照：59,264／151,288 bytes。以srcset及sizes依畫面與像素密度選擇，原圖不再由新頁面引用。
- Logo：brand-logo-small.webp 18,378 bytes；favicon.png 23,510 bytes。報名頁multiply保留。
- 影片：robot-web.mp4 3,989,739 bytes；scratch-web.mp4 2,440,901 bytes。兩支720×720 H.264／yuv420p，AAC96k，保留原有聲音、長度與比例，moov置於mdat之前（faststart）。
- 共用media.js/media.css，scripts/media-markup.mjs產生封面播放器。video初始無src且preload=none，data-src存路徑；封面圖lazy loading，只有使用者點擊才指派src並播放。播放一支會暫停其他支；載入錯誤可點封面重試，有無JS的直接影片連結。
- 首頁與Prime/Scratch詳情套用點播；其餘詳情用響應式照片。更新build-course-pages.mjs確保重新產頁不會回退。GitHub白名單新增media.js/media.css。
- scripts/optimize-media.py可重建優化素材，需要Pillow及.openai/ffmpeg.exe；FFmpeg來自imageio-ffmpeg 0.6.0官方PyPI套件，工具及中間圖不入庫。
- 驗證：本機HTTP請求紀錄確認點播前0筆MP4；兩支影片點播readyState4、currentTime增加，互斥播放正常。390px手機無橫向溢出、封面及Logo正常。七頁資產引用及faststart結構通過檢查。未實測行動網路秒數，不宣稱速度提升固定倍數。

## 17. 串流平台決策（2026-10-01）

曾以使用者提供的兩支 YouTube Shorts 測試延後嵌入，但使用者不希望影片顯示 YouTube 介面，因此正式網站已切回第16節的壓縮 MP4 播放器。YouTube 連結不納入正式頁面。未來若要改善特定網路下的播放緩衝，應優先評估 Cloudflare Stream 或 Vimeo 等可無品牌嵌入的串流服務，再替換 scripts/media-markup.mjs、dist/media.js、dist/media.css，並重新測試首頁與 Prime／Scratch 詳情頁。
