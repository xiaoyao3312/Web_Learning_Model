// ML_project_runner.js
import { ML_projects } from "./ML_project_loader.js";
import { initRunner } from "./Runner_Core.js"; // 導入核心模組

// 只執行一行：將 ML 專案列表傳入核心運行器
initRunner(ML_projects);