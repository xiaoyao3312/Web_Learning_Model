// static/JS/Color_BG_Control.js

(function(){
  const fabHTML=`
  <div id="colorFab">
    <div id="fabIcon">🎨</div>
    <div id="fabContent">
      <div class="panel-title">背景顏色調整</div>
      <div class="sliders">
        <label>R: <span id="valR">128</span></label>
        <input type="range" id="rangeR" min="0" max="255" value="128">
        <label>G: <span id="valG">128</span></label>
        <input type="range" id="rangeG" min="0" max="255" value="128">
        <label>B: <span id="valB">128</span></label>
        <input type="range" id="rangeB" min="0" max="255" value="128">
        <label>A: <span id="valA">1</span></label>
        <input type="range" id="rangeA" min="0" max="1" step="0.01" value="1">
      </div>
      <div class="themes">
        <button class="theme-btn" data-color="rgba(34,34,34,1)">深色</button>
        <button class="theme-btn" data-color="rgba(255,255,255,1)">淺色</button>
        <button class="theme-btn" data-color="rgba(128,128,128,1)">灰色</button>
      </div>
    </div>
  </div>`;
  if (!document.getElementById("colorFab")) {
    document.body.insertAdjacentHTML("beforeend",fabHTML);
  }

  const fab=document.getElementById("colorFab");
  const icon=document.getElementById("fabIcon");
  const content=document.getElementById("fabContent");
  const EDGE_MARGIN = 20; 

  const sliders={
    r: document.getElementById("rangeR"),
    g: document.getElementById("rangeG"),
    b: document.getElementById("rangeB"),
    a: document.getElementById("rangeA")
  };

  const labels={
    r: document.getElementById("valR"),
    g: document.getElementById("valG"),
    b: document.getElementById("valB"),
    a: document.getElementById("valA")
  };

  const themeBtns=document.querySelectorAll(".theme-btn");

  function applyColor(){
    const r = +sliders.r.value;
    const g = +sliders.g.value;
    const b = +sliders.b.value;
    const a = sliders.a.value;
    const color=`rgba(${r},${g},${b},${a})`;
    
    // 主背景亮度
    const avg=(r + g + b)/3; 
    
    // *******************************************************************
    // 關鍵修正：全域文字顏色計算（增強中灰對比度）
    // *******************************************************************
    let fontVal;
    
    if (avg > 127.5) {
        // 背景偏亮: 讓字體顏色往 0 (黑色) 推
        const normalized_avg = (avg - 127.5) / (255 - 127.5); // 0 到 1
        // 使用 Power Function 放大亮度差異，使 fontVal 更快接近 0
        fontVal = 127.5 * (1 - Math.pow(normalized_avg, 1.5)); // 1.5 可調整
    } else {
        // 背景偏暗: 讓字體顏色往 255 (白色) 推
        const normalized_avg = (127.5 - avg) / 127.5; // 0 到 1
        // 確保 fontVal 更快接近 255
        fontVal = 127.5 + 127.5 * Math.pow(normalized_avg, 1.5); // 1.5 可調整
    }
    
    // 確保值在 0 到 255 範圍內
    fontVal = Math.round(Math.min(255, Math.max(0, fontVal)));

    const globalFontColor = `rgb(${fontVal}, ${fontVal}, ${fontVal})`;
    
    // 頂部文字顏色 (純黑或純白，用於高對比標題)
    const headerFontColor = avg > 128 ? "#000" : "#fff";

    // 設定全域主題顏色
    document.documentElement.style.setProperty("--global-theme-color",color);
    document.documentElement.style.setProperty("--global-font-color", globalFontColor); 
    document.documentElement.style.setProperty("--header-font-color", headerFontColor);

    // 面板背景和文字色
    if (avg > 128) {
        // 主背景為淺色 -> 面板使用微淺灰，文字黑色
        document.documentElement.style.setProperty("--panel-bg-color", "rgba(230, 230, 230, 0.9)");
        document.documentElement.style.setProperty("--panel-font-color", "#000"); 
    } else {
        // 主背景為深色 -> 面板使用微深灰，文字白色
        document.documentElement.style.setProperty("--panel-bg-color", "rgba(50, 50, 50, 0.9)");
        document.documentElement.style.setProperty("--panel-font-color", "#fff"); 
    }

    saveSettings();
  }

  function updateLabels(){
    labels.r.textContent=sliders.r.value;
    labels.g.textContent=sliders.g.value;
    labels.b.textContent=sliders.b.value;
    labels.a.textContent=sliders.a.value;
  }

  Object.values(sliders).forEach(s=>{
    s.addEventListener("input",()=>{
      updateLabels();
      applyColor();
    });
  });

  themeBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
      const rgba=btn.dataset.color.match(/\d+(\.\d+)?/g);
      sliders.r.value=rgba[0];
      sliders.g.value=rgba[1];
      sliders.b.value=rgba[2];
      sliders.a.value=rgba[3]||1;
      updateLabels();
      applyColor();
    });
  });

  icon.addEventListener("click",()=>{
    content.style.display = content.style.display==="flex" ? "none" : "flex";
    positionPanel();
  });

  function stickToEdge(x, y){
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const fabW = fab.offsetWidth;
    const fabH = fab.offsetHeight;

    const isNearRight = (x + fabW/2) > (windowW/2);
    
    let finalY;

    if (isNearRight) {
        fab.style.right = EDGE_MARGIN + "px";
        fab.style.left = "auto";
    } else {
        fab.style.left = EDGE_MARGIN + "px";
        fab.style.right = "auto";
    }
    
    finalY = y;
    if (y < EDGE_MARGIN * 3) {
        finalY = EDGE_MARGIN; 
    } else if (y > windowH - fabH - EDGE_MARGIN * 3) {
        finalY = windowH - fabH - EDGE_MARGIN; 
    }

    fab.style.top = finalY + "px";
    fab.style.bottom = "auto";

    positionPanel();
  }

  let isDrag=false,offsetX=0,offsetY=0;
  icon.addEventListener("mousedown",e=>{
    e.stopPropagation(); 
    e.preventDefault(); 
    
    isDrag=true;
    offsetX=e.clientX-fab.offsetLeft;
    offsetY=e.clientY-fab.offsetTop;
    fab.style.cursor = 'grabbing';
  });

  document.addEventListener("mousemove",e=>{
    if(!isDrag) return;
    let newX=e.clientX-offsetX;
    let newY=e.clientY-offsetY;

    newX=Math.max(0, Math.min(window.innerWidth-fab.offsetWidth,newX));
    newY=Math.max(0, Math.min(window.innerHeight-fab.offsetHeight,newY));

    fab.style.left=newX+"px";
    fab.style.top=newY+"px";
    fab.style.right="auto";
    fab.style.bottom="auto";

    if(content.style.display==="flex") positionPanel();
  });

  document.addEventListener("mouseup",e=>{
    if(!isDrag) return;
    isDrag=false;
    fab.style.cursor = 'grab';
    
    stickToEdge(fab.offsetLeft, fab.offsetTop); 
    saveSettings();
  });

  function positionPanel(){
    const fabRect=fab.getBoundingClientRect();
    
    if (fab.style.right !== "auto" && fab.style.right !== "") {
      content.style.left="auto";
      content.style.right= fabRect.width + 15 + "px"; 
    } else {
      content.style.right="auto";
      content.style.left= fabRect.width + 15 + "px";
    }
    
    content.style.top = (fabRect.height / 2) - (content.offsetHeight / 2) + "px"; 
    
    const contentRect = content.getBoundingClientRect();
    if (contentRect.top < EDGE_MARGIN) {
        content.style.top = (fabRect.height / 2) - (contentRect.height / 2) + (EDGE_MARGIN - contentRect.top) + "px";
    }
    if (contentRect.bottom > window.innerHeight - EDGE_MARGIN) {
        const newTop = (fabRect.height / 2) - (contentRect.height / 2) - (contentRect.bottom - (window.innerHeight - EDGE_MARGIN));
        content.style.top = newTop + "px";
    }
  }

  function saveSettings(){
    localStorage.setItem("FABSettings",JSON.stringify({
      left: fab.style.left,
      right: fab.style.right,
      top: fab.style.top,
      bottom: fab.style.bottom,
      r: sliders.r.value,
      g: sliders.g.value,
      b: sliders.b.value,
      a: sliders.a.value
    }));
  }

  function loadSettings(){
    const s=JSON.parse(localStorage.getItem("FABSettings"));
    
    if(!s) {
      fab.style.left = "auto";
      fab.style.top = "auto";
      fab.style.right = EDGE_MARGIN + "px";
      fab.style.bottom = EDGE_MARGIN + "px";
    } else {
      fab.style.left = s.left;
      fab.style.right = s.right;
      fab.style.top = s.top;
      fab.style.bottom = s.bottom;
      
      sliders.r.value=s.r;
      sliders.g.value=s.g;
      sliders.b.value=s.b;
      sliders.a.value=s.a;
    }

    updateLabels();
    applyColor();
    window.dispatchEvent(new Event('resize')); 
  }

  window.addEventListener("resize",()=>{
    if (fab.style.left !== "auto" || fab.style.right !== "auto") {
        stickToEdge(fab.offsetLeft, fab.offsetTop); 
    }
    if(content.style.display==="flex") positionPanel();
  });

  loadSettings();
})();