import { ML_projects as projects } from "./ML_project_loader.js"; // 匯入資料層

let currentProject = 1;

function renderProject(id) {
  const codeArea = document.getElementById("codeContent");
  const desc = document.getElementById("description");
  codeArea.innerHTML = "";
  desc.innerHTML = "<h4>程式碼說明</h4><p>滑鼠點擊程式碼行以查看說明</p>";

  const lines = projects[id]?.code || [];
  lines.forEach((lineObj) => {
    const span = document.createElement("span");
    span.className = "code-line";
    span.dataset.desc = lineObj.desc;
    span.textContent = lineObj.line;

    // 點擊高亮
    span.addEventListener("click", () => {
      // 先移除所有行的 active
      document.querySelectorAll(".code-line").forEach((el) => el.classList.remove("active"));

      if (!span.classList.contains("active")) {
        // 高亮目前行
        span.classList.add("active");
        desc.innerHTML = lineObj.desc + "</p>";
      } else {
        // 如果已高亮，取消高亮並顯示預設文字
        span.classList.remove("active");
        desc.innerHTML = "<h4>程式碼說明</h4><p>點擊程式碼行以查看說明</p>";
      }
    });

    codeArea.appendChild(span);
    codeArea.appendChild(document.createElement("br"));
  });
}

renderProject(currentProject);

// 專案按鈕事件
document.querySelectorAll(".project-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentProject = btn.dataset.id;
    renderProject(currentProject);
  });
});

// Top-bar 展開/收起
const toggleBtn = document.getElementById("toggleBtn");
const projectBtns = document.getElementById("projectBtns");

toggleBtn.addEventListener("click", () => {
  projectBtns.classList.toggle("show");
});

// Top-bar 拖曳左右滑動
let isDown = false;
let startX;
let scrollLeft;

projectBtns.addEventListener('mousedown', (e) => {
  isDown = true;
  projectBtns.classList.add('active');
  startX = e.pageX - projectBtns.offsetLeft;
  scrollLeft = projectBtns.scrollLeft;
});

projectBtns.addEventListener('mouseleave', () => {
  isDown = false;
  projectBtns.classList.remove('active');
});

projectBtns.addEventListener('mouseup', () => {
  isDown = false;
  projectBtns.classList.remove('active');
});

projectBtns.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - projectBtns.offsetLeft;
  const walk = (x - startX) * 2;
  projectBtns.scrollLeft = scrollLeft - walk;
});
