// DL_project_runner.js
import { DL_projects } from "./DL_project_loader.js";
import { initRunner } from "./Runner_Core.js"; // 導入核心模組

// 只執行一行：將 DL 專案列表傳入核心運行器
initRunner(DL_projects);