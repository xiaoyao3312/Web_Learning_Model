import { ML_projects as projects } from "./ML_project_loader.js";

// --- 專案載入邏輯 ---
let currentProject = 1;
const mainTitle = document.getElementById("mainTitle"); // 取得標題元素
const BASE_TITLE = "互動式程式碼";

/**
 * 從按鈕元素中提取專案英文名稱並更新主標題
 * @param {HTMLElement} btn - 點擊的專案按鈕元素
 */
function updateMainTitle(btn) {
    if (!btn) return;
    // 獲取按鈕文本，例如 "linear_regression <br> 線性迴歸"
    const fullText = btn.innerHTML.trim();
    // 提取第一個單詞 (即英文專案名)，使用 <br> 作為分隔符
    const projectName = fullText.split('<br>')[0].trim();
    
    // 更新標題
    mainTitle.textContent = `${BASE_TITLE}（${projectName}）`;
}


function renderProject(id){
    const codeArea = document.getElementById("codeContent");
    const desc = document.getElementById("description");
    codeArea.innerHTML = "";
    desc.innerHTML = "<h4>程式碼說明</h4><p>滑鼠點擊程式碼行以查看說明</p>";

    const lines = projects[id]?.code || [];
    lines.forEach(lineObj=>{
        const span = document.createElement("span");
        span.className = "code-line";
        span.dataset.desc = lineObj.desc;
        span.textContent = lineObj.line;

        span.addEventListener("click", ()=>{
            document.querySelectorAll(".code-line").forEach(el=>el.classList.remove("active"));
            if(!span.classList.contains("active")){
                span.classList.add("active");
                desc.innerHTML = lineObj.desc + "</p>";
            } else {
                span.classList.remove("active");
                desc.innerHTML = "<h4>程式碼說明</h4><p>滑鼠點擊程式碼行以查看說明</p>";
            }
            desc.scrollTop = 0;
        });

        codeArea.appendChild(span);
        codeArea.appendChild(document.createElement("br"));
    });
}

document.querySelectorAll(".project-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
        currentProject = btn.dataset.id;
        updateMainTitle(btn); // 在點擊時更新標題
        renderProject(currentProject);
    });
});

document.getElementById("toggleBtn").addEventListener("click", ()=>{
    document.getElementById("projectBtns").classList.toggle("show");
});

document.getElementById('saveNotesBtn').addEventListener('click', ()=>{
    const notes = document.getElementById('userNotes').value;
    const blob = new Blob([notes], {type:'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user_notes.txt';
    // 確保下載可以正常觸發
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
});

// --- 初始化標題和專案 ---
// 確保在頁面加載時，初始專案 (ID 1) 的名稱正確顯示在標題中
const initialProjectButton = document.querySelector('.project-btn[data-id="1"]');
if (initialProjectButton) {
    updateMainTitle(initialProjectButton);
}
renderProject(currentProject); 
// ---------------------------


// --- Gemini AI 聊天串接邏輯 ---
// 核心設定
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

/* * API_KEY 現在是一個 'let' 變數，以便從 UI 輸入框更新。
 * 初始值為空字串，等待使用者從介面輸入。
 */
let API_KEY = ""; 

// DOM 元素參考
const chatDisplay = document.getElementById('chatDisplay');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
// 新增的金鑰相關 DOM 元素
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');

// 聊天歷史記錄，用於保持對話上下文
let chatHistory = [];
// 追蹤 AI 正在輸入的 DOM 元素容器
let typingIndicatorElement = null; 

// --- 輔助函數：檢查金鑰狀態並更新 UI ---
function checkApiKeyStatus() {
    // 簡單地檢查 API_KEY 是否有內容
    const isKeySet = API_KEY.trim().length > 0;
    
    // 啟用/禁用聊天輸入和按鈕
    chatInput.disabled = !isKeySet;
    sendChatBtn.disabled = !isKeySet;
    
    if (isKeySet) {
        apiKeyInput.placeholder = "API 金鑰已設定 (本頁面有效)";
        apiKeyInput.classList.remove('is-invalid');
        apiKeyInput.classList.add('is-valid');
        // 清空輸入框內容，避免金鑰一直顯示
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

// 首次載入時檢查金鑰狀態 (預設禁用聊天直到設定金鑰)
checkApiKeyStatus();

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
    messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;

    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`;
    
    if (isUser) {
        bubble.textContent = text;
    } else {
        const aiTitle = document.createElement('p');
        aiTitle.className = 'ai-name';
        aiTitle.textContent = 'AI 助理';
        bubble.appendChild(aiTitle);
        
        // 替換換行符號為 <br> 以便在 HTML 中正確顯示
        const aiText = document.createElement('p');
        // 使用 innerHTML 來渲染 <br>
        aiText.innerHTML = text.replace(/\n/g, '<br>'); 
        bubble.appendChild(aiText);
    }

    messageDiv.appendChild(bubble);
    chatDisplay.appendChild(messageDiv);
    
    // 保持捲動到底部
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
    return messageDiv; // 返回整個訊息容器
}

/**
 * 顯示或隱藏 AI 正在輸入的指示器
 * @param {boolean} show - 是否顯示指示器
 */
function toggleTypingIndicator(show) {
    if (show) {
        if (!typingIndicatorElement) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'flex justify-start';
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble ai-bubble typing-indicator';
            bubble.innerHTML = `
                <p class="ai-name">AI 助理</p>
                <div class="flex space-x-1">
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
      // 保持捲動到底部
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

/**
 * 處理使用者輸入並呼叫 Gemini API
 */
async function sendMessage() {
    // 再次檢查金鑰，防止禁用被繞過
    if (API_KEY.trim().length === 0) {
        appendMessage('ai', "請先在頂部輸入框中設定您的 Gemini API 金鑰，才能開始聊天。");
        apiKeyInput.classList.add('is-invalid');
        return;
    }
    
    const userText = chatInput.value.trim();

    if (!userText) return;

    // 1. 更新 UI 和狀態
    appendMessage('user', userText); // 顯示使用者訊息
    chatInput.value = ''; // 清空輸入框
    chatInput.style.height = 'auto'; // 重設輸入框高度
    sendChatBtn.disabled = true;
    chatInput.disabled = true;
    toggleTypingIndicator(true); // 顯示輸入指示器

    // 2. 更新聊天歷史記錄
    chatHistory.push({ role: "user", parts: [{ text: userText }] });

    // 3. 準備 API 請求的 Payload
    const payload = {
        contents: chatHistory, // 傳遞完整的聊天歷史記錄以保持上下文
        tools: [{ "google_search": {} }], // 啟用 Google 搜尋工具
        systemInstruction: {
            parts: [{ text: "你是一個友善且樂於助人的程式碼教學助理。你的目標是幫助使用者理解左上角區域中顯示的程式碼。請使用繁體中文進行回應，並保持專業和耐心的語氣。" }]
        }
    };

    const fetchOptions = {
        method: 'POST',
        // 【關鍵】這裡的 headers 保持簡潔，不包含 API Key
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload)
    };

    let aiResponseText = "抱歉，與 AI 服務連線失敗，請稍後再試。";
    
    // 4. 執行 API 呼叫
    try {
        // 【修復點】將 API Key 作為查詢參數添加到 URL 中，這是您原始可用的方式
        const response = await exponentialBackoff(() => fetch(`${API_URL}?key=${API_KEY}`, fetchOptions));
        
        if (!response.ok) {
            // 解析錯誤回應
            const errorBody = await response.json();
            const errorMessage = errorBody.error?.message || `API 請求失敗，狀態碼: ${response.status}`;

            // --- 專門處理 401 和 403 錯誤 ---
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
        // 錯誤時將錯誤訊息作為 AI 回應加入歷史記錄
        chatHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
    } finally {
        // 6. 恢復 UI 狀態
        toggleTypingIndicator(false); // 隱藏輸入指示器
        
        // 新增正式的 AI 回覆
        appendMessage('ai', aiResponseText); 
        
        // 恢復聊天輸入狀態
        sendChatBtn.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();
    }
}

// --- 事件監聽器設定 ---

// 1. 處理 API 金鑰儲存
saveApiKeyBtn.addEventListener('click', () => {
    // 使用 trim() 移除空白
    const key = apiKeyInput.value.trim();
    
    // 簡單檢查長度，API 金鑰通常很長
    if (key.length > 10) { 
        API_KEY = key; // 設置臨時金鑰
        checkApiKeyStatus(); // 更新 UI
        // 提示成功
        appendMessage('ai', 'API 金鑰已成功設定（僅本次瀏覽器會話有效）。現在您可以開始提問了！');
    } else {
        // 無效金鑰處理
        API_KEY = ""; 
        apiKeyInput.classList.add('is-invalid');
        checkApiKeyStatus();
        // 替換 alert 為聊天訊息提示
        appendMessage('ai', '[設定錯誤]：請輸入有效的 Gemini API 金鑰。');
    }
});


// 2. 處理點擊送出按鈕
sendChatBtn.addEventListener('click', sendMessage);

// 3. 處理 Enter 鍵送出 (Shift+Enter 換行)
chatInput.addEventListener('keypress', function(e) {
    // 只有在按下 Enter 鍵且沒有按住 Shift 鍵，且按鈕未被禁用時才觸發
    if (e.key === 'Enter' && !e.shiftKey && !sendChatBtn.disabled) {
        e.preventDefault(); // 阻止默認的換行行為
        sendMessage();
    }
});

// 4. 自動調整輸入框高度
chatInput.addEventListener('input', function() {
    this.style.height = 'auto'; 
    this.style.height = (this.scrollHeight) + 'px';
});


// ---------------------------
// 拖拉功能 (保持原樣)
const container = document.getElementById("fourPanel");
const hResizer = document.getElementById("hResizer");
const vResizer = document.getElementById("vResizer");

let isDraggingH = false, isDraggingV = false;
let rowPercent = 50, colPercent = 50;
const minPercent = 10, maxPercent = 90;

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
document.addEventListener("mouseup", e=>{
    if(isDraggingH){
        container.classList.remove("dragging");
        hResizer.classList.remove("dragging");
    }
    isDraggingH = false;
    document.body.style.cursor = "default";
});

// 垂直拖拉
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
document.addEventListener("mouseup", e=>{
    if(isDraggingV){
        container.classList.remove("dragging");
        vResizer.classList.remove("dragging");
    }
    isDraggingV = false;
    document.body.style.cursor = "default";
});

// 初始化拖拉桿位置
updateHResizer();
updateVResizer();