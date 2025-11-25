// Runner_Core.js

// 核心設定
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

/* * API_KEY 現在是一個 'let' 變數，以便從 UI 輸入框更新。
 * 初始值為空字串，等待使用者從介面輸入。
 */
let API_KEY = ""; 

// DOM 元素參考 (假設這些元素在 HTML 中存在)
const mainTitle = document.getElementById("mainTitle");
const chatDisplay = document.getElementById('chatDisplay');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const toggleBtn = document.getElementById("toggleBtn");
const projectBtnsContainer = document.getElementById("projectBtns");

// 聊天歷史記錄，用於保持對話上下文
let chatHistory = [];
// 追蹤 AI 正在輸入的 DOM 元素容器
let typingIndicatorElement = null; 

// 專案載入邏輯
let projects = {}; // 將由 initRunner 設置
let currentProject = 1;
const BASE_TITLE = "互動式程式碼";

// -------------------------------------------------------------------
// --- 專案/UI 輔助函數 ---
// -------------------------------------------------------------------

/**
 * 從按鈕元素中提取專案英文名稱並更新主標題
 * @param {HTMLElement} btn - 點擊的專案按鈕元素
 * @param {string} projectID - 專案ID
 * @returns {string} 當前專案的英文名稱
 */
function updateMainTitle(btn) {
    if (!btn) return "未指定專案";
    // 獲取按鈕文本，例如 "linear_regression <br> 線性迴歸"
    const fullText = btn.innerHTML.trim();
    // 提取第一個單詞 (即英文專案名)，使用 <br> 作為分隔符
    const projectName = fullText.split('<br>')[0].trim();
    
    // 更新標題
    mainTitle.textContent = `${BASE_TITLE}（${projectName}）`;
    return projectName;
}

/**
 * 渲染指定的專案程式碼和初始描述
 * @param {number|string} id - 專案 ID
 */
function renderProject(id){
    const codeArea = document.getElementById("codeContent");
    const desc = document.getElementById("description");
    
    // 清空現有內容
    codeArea.innerHTML = "";
    desc.innerHTML = "<h4>程式碼說明</h4><p>滑鼠點擊程式碼行以查看說明</p>";

    const lines = projects[id]?.code || [];
    lines.forEach(lineObj=>{
        const span = document.createElement("span");
        span.className = "code-line";
        span.dataset.desc = lineObj.desc;
        span.textContent = lineObj.line;

        span.addEventListener("click", ()=>{
            // 移除所有行的 active 狀態
            document.querySelectorAll(".code-line").forEach(el=>el.classList.remove("active"));
            
            // 如果點擊的行不是 active，則設置 active 並顯示描述
            if(!span.classList.contains("active")){
                span.classList.add("active");
                // 註：這裡假設 lineObj.desc 已經包含所需的 HTML 標籤
                desc.innerHTML = lineObj.desc; 
            } else {
                // 如果已經 active，則移除 active 並顯示預設提示
                span.classList.remove("active");
                desc.innerHTML = "<h4>程式碼說明</h4><p>滑鼠點擊程式碼行以查看說明</p>";
            }
            desc.scrollTop = 0; // 描述區捲動到頂部
        });

        codeArea.appendChild(span);
        codeArea.appendChild(document.createElement("br"));
    });
}

// -------------------------------------------------------------------
// --- API/聊天 輔助函數 ---
// -------------------------------------------------------------------

/**
 * 檢查 API 金鑰狀態並更新 UI
 */
function checkApiKeyStatus() {
    const isKeySet = API_KEY.trim().length > 0;
    
    chatInput.disabled = !isKeySet;
    sendChatBtn.disabled = !isKeySet;
    
    if (isKeySet) {
        apiKeyInput.placeholder = "API 金鑰已設定 (本頁面有效)";
        apiKeyInput.classList.remove('is-invalid');
        apiKeyInput.classList.add('is-valid');
        apiKeyInput.value = ''; 
        saveApiKeyBtn.textContent = "已設定 ✅";
        saveApiKeyBtn.disabled = true;
        chatInput.placeholder = "在此輸入訊息...";
        chatInput.focus();
    } else {
        apiKeyInput.placeholder = "請輸入 Gemini API 金鑰 (臨時使用)";
        apiKeyInput.classList.remove('is-valid');
        saveApiKeyBtn.textContent = "設定金鑰";
        saveApiKeyBtn.disabled = false;
        chatInput.placeholder = "請先設定 API 金鑰...";
    }
}

/**
 * 處理 API 呼叫的指數退避重試機制
 */
async function exponentialBackoff(fn, retries = 5, delay = 1000) {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            console.warn(`API 請求失敗，剩餘重試次數: ${retries}。將在 ${delay / 1000} 秒後重試...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return exponentialBackoff(fn, retries - 1, delay * 2);
        } else {
            throw error;
        }
    }
}

/**
 * 將訊息新增到聊天顯示區域
 * @param {string} sender - 訊息發送者 ('user' 或 'ai')
 * @param {string} text - 訊息內容
 */
function appendMessage(sender, text) {
    const isUser = sender === 'user';
    const messageDiv = document.createElement('div');
    // 註：您的 CSS 已經處理了 flex 和對齊，這裡使用簡單的 div
    messageDiv.className = isUser ? 'text-end' : 'text-start';

    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`;
    
    if (isUser) {
        bubble.textContent = text;
    } else {
        const aiTitle = document.createElement('p');
        aiTitle.className = 'ai-name';
        aiTitle.textContent = 'AI 助理';
        bubble.appendChild(aiTitle);
        
        const aiText = document.createElement('p');
        // 使用 innerHTML 來渲染換行符號 <br>
        aiText.innerHTML = text.replace(/\n/g, '<br>'); 
        bubble.appendChild(aiText);
    }

    messageDiv.appendChild(bubble);
    chatDisplay.appendChild(messageDiv);
    
    // 保持捲動到底部
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
    return messageDiv;
}

/**
 * 顯示或隱藏 AI 正在輸入的指示器
 * @param {boolean} show - 是否顯示指示器
 */
function toggleTypingIndicator(show) {
    if (show) {
        if (!typingIndicatorElement) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'text-start';
            const bubble = document.createElement('div');
            // 確保這裡的 class 名稱與 CSS 保持一致
            bubble.className = 'message-bubble ai-bubble typing-indicator'; 
            bubble.innerHTML = `
                <p class="ai-name">AI 助理</p>
                <div class="d-flex align-items-center">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            `;
            messageDiv.appendChild(bubble);
            chatDisplay.appendChild(messageDiv);
            typingIndicatorElement = messageDiv;
        }
    } else {
        if (typingIndicatorElement && typingIndicatorElement.parentElement) {
            typingIndicatorElement.parentElement.removeChild(typingIndicatorElement);
            typingIndicatorElement = null;
        }
    }
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

/**
 * 處理使用者輸入並呼叫 Gemini API
 */
async function sendMessage() {
    if (API_KEY.trim().length === 0) {
        appendMessage('ai', "請先在頂部輸入框中設定您的 Gemini API 金鑰，才能開始聊天。");
        apiKeyInput.classList.add('is-invalid');
        return;
    }
    
    const userText = chatInput.value.trim();

    if (!userText) return;

    // 1. 更新 UI 和狀態
    appendMessage('user', userText); 
    chatInput.value = ''; 
    chatInput.style.height = 'auto';
    sendChatBtn.disabled = true;
    chatInput.disabled = true;
    toggleTypingIndicator(true);

    // 2. 更新聊天歷史記錄
    chatHistory.push({ role: "user", parts: [{ text: userText }] });

    // 獲取當前專案名稱以增強系統提示
    const currentProjectBtn = document.querySelector(`.project-btn[data-id="${currentProject}"]`);
    const currentProjectName = updateMainTitle(currentProjectBtn); // 使用現有函數來獲取和更新標題

    // 3. 準備 API 請求的 Payload
    const payload = {
        contents: chatHistory, 
        tools: [{ "google_search": {} }], 
        systemInstruction: {
            parts: [{ 
                text: `你是一個友善且樂於助人的程式碼教學助理。你目前正在幫助使用者理解【${currentProjectName}】的程式碼。你的目標是幫助使用者理解左上角區域中顯示的程式碼。請使用繁體中文進行回應，並保持專業和耐心的語氣。` 
            }]
        }
    };

    const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload)
    };

    let aiResponseText = "抱歉，與 AI 服務連線失敗，請稍後再試。";
    
    // 4. 執行 API 呼叫
    try {
        // 將 API Key 作為查詢參數
        const response = await exponentialBackoff(() => fetch(`${API_URL}?key=${API_KEY}`, fetchOptions));
        
        if (!response.ok) {
            const errorBody = await response.json();
            const errorMessage = errorBody.error?.message || `API 請求失敗，狀態碼: ${response.status}`;

            if (response.status === 401) {
                 throw new Error(`API 請求未經授權 (401 Unauthorized)。請確認您的金鑰是否正確。`);
            }
            if (response.status === 403) {
                 throw new Error(`API 請求被拒絕 (403 Forbidden)。請檢查金鑰是否有效或專案是否已啟用服務。`);
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        aiResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text || aiResponseText;

        // 5. 更新聊天歷史記錄
        chatHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
    } catch (error) {
        console.error("呼叫 Gemini API 發生錯誤:", error);
        aiResponseText = `[錯誤]：無法連接到服務或處理回應。詳細錯誤：${error.message}`;
        chatHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
    } finally {
        // 6. 恢復 UI 狀態
        toggleTypingIndicator(false); 
        appendMessage('ai', aiResponseText); 
        sendChatBtn.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();
    }
}

// -------------------------------------------------------------------
// --- 拖拉功能邏輯 (保持原樣) ---
// -------------------------------------------------------------------

const container = document.getElementById("fourPanel");
const hResizer = document.getElementById("hResizer");
const vResizer = document.getElementById("vResizer");

let isDraggingH = false, isDraggingV = false;
let rowPercent = 50, colPercent = 50;
const minPercent = 10, maxPercent = 90;

function setupResizers() {
    if (!container || !hResizer || !vResizer) {
        console.warn("拖拉元件未完全找到，拖拉功能將無法運行。");
        return;
    }
    
    function updateHResizer() { hResizer.style.top = rowPercent + "%"; }
    function updateVResizer() { vResizer.style.left = colPercent + "%"; }

    // 水平拖拉
    hResizer.addEventListener("mousedown", e=>{
        isDraggingH = true;
        container.classList.add("dragging");
        hResizer.classList.add("dragging");
        document.body.style.cursor = "row-resize";
    });
    document.addEventListener("mousemove", e=>{
        if(!isDraggingH) return;
        const rect = container.getBoundingClientRect();
        let y = e.clientY - rect.top;
        rowPercent = (y/rect.height)*100;
        if(rowPercent < minPercent) rowPercent = minPercent;
        if(rowPercent > maxPercent) rowPercent = maxPercent;
        container.style.gridTemplateRows = `${rowPercent}% ${100-rowPercent}%`;
        updateHResizer();
    });
    // 垂直拖拉 (保持原樣)
    vResizer.addEventListener("mousedown", e=>{
        isDraggingV = true;
        container.classList.add("dragging");
        vResizer.classList.add("dragging");
        document.body.style.cursor = "col-resize";
    });
    document.addEventListener("mousemove", e=>{
        if(!isDraggingV) return;
        const rect = container.getBoundingClientRect();
        let x = e.clientX - rect.left;
        colPercent = (x/rect.width)*100;
        if(colPercent < minPercent) colPercent = minPercent;
        if(colPercent > maxPercent) colPercent = maxPercent;
        container.style.gridTemplateColumns = `${colPercent}% ${100-colPercent}%`;
        updateVResizer();
    });

    // 結束拖拉
    document.addEventListener("mouseup", e=>{
        if(isDraggingH){
            container.classList.remove("dragging");
            hResizer.classList.remove("dragging");
            isDraggingH = false;
        }
        if(isDraggingV){
            container.classList.remove("dragging");
            vResizer.classList.remove("dragging");
            isDraggingV = false;
        }
        document.body.style.cursor = "default";
    });

    // 初始化拖拉桿位置
    updateHResizer();
    updateVResizer();
}


// -------------------------------------------------------------------
// --- 導出初始化函數 (核心入口點) ---
// -------------------------------------------------------------------

/**
 * 外部調用的初始化函數，設置專案列表並綁定所有事件
 * @param {Object} projectList - 從 project_loader 導入的專案列表
 */
export function initRunner(projectList) {
    projects = projectList; // 設置專案列表

    // 1. 專案按鈕點擊處理
    document.querySelectorAll(".project-btn").forEach(btn=>{
        btn.addEventListener("click", ()=>{
            currentProject = btn.dataset.id;
            updateMainTitle(btn); 
            renderProject(currentProject);
        });
    });

    // 2. 側邊欄開關按鈕
    if (toggleBtn) {
        toggleBtn.addEventListener("click", ()=>{
            if (projectBtnsContainer) {
                projectBtnsContainer.classList.toggle("show");
            }
        });
    }

    // 3. 筆記儲存按鈕
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', ()=>{
            const notes = document.getElementById('userNotes').value;
            const blob = new Blob([notes], {type:'text/plain'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'user_notes.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        });
    }

    // 4. 聊天相關事件
    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        // Enter 鍵送出
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey && !sendChatBtn.disabled) {
                e.preventDefault(); 
                sendMessage();
            }
        });

        // 自動調整輸入框高度
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto'; 
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    // 5. API 金鑰儲存事件
    if (saveApiKeyBtn) {
        saveApiKeyBtn.addEventListener('click', () => {
            const key = apiKeyInput.value.trim();
            
            if (key.length > 10 && key.startsWith('AIza')) { // 簡易判斷是否為有效金鑰
                API_KEY = key; 
                checkApiKeyStatus(); 
                appendMessage('ai', 'API 金鑰已成功設定（僅本次瀏覽器會話有效）。現在您可以開始提問了！');
            } else {
                API_KEY = ""; 
                apiKeyInput.classList.add('is-invalid');
                checkApiKeyStatus();
                appendMessage('ai', '[設定錯誤]：請輸入有效的 Gemini API 金鑰。');
            }
        });
    }

    // 6. 初始化狀態
    
    // 確保在頁面加載時，初始專案 (ID 1) 的名稱正確顯示在標題中
    const initialProjectButton = document.querySelector('.project-btn[data-id="1"]');
    if (initialProjectButton) {
        // 使用獲取到的第一個按鈕的 ID 作為初始專案 ID
        currentProject = initialProjectButton.dataset.id;
        updateMainTitle(initialProjectButton);
    }
    renderProject(currentProject); 
    
    // 首次載入時檢查金鑰狀態
    checkApiKeyStatus();

    // 設置拖拉功能
    setupResizers();
}