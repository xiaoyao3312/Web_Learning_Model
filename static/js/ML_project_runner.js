import { ML_projects as projects } from "./ML_project_loader.js";

let currentProject = 1;

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
renderProject(currentProject);

document.querySelectorAll(".project-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    currentProject = btn.dataset.id;
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
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById('sendChatBtn').addEventListener('click', ()=>{
  const input = document.getElementById('chatInput').value;
  if(!input) return;

  const chatDisplay = document.getElementById('chatDisplay');
  const userMsg = document.createElement('div'); userMsg.textContent = "你: " + input;
  chatDisplay.appendChild(userMsg);

  const botMsg = document.createElement('div'); botMsg.textContent = "ChatGPT: 我收到你的訊息了!";
  botMsg.style.color = "blue";
  chatDisplay.appendChild(botMsg);

  document.getElementById('chatInput').value = '';
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

// ---------------------------
// 拖拉功能
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
