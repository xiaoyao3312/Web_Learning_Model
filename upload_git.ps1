# -------------------------------
# 上傳 Flask 專案到 GitHub 批次指令
# -------------------------------

# 設定專案路徑
$projectPath = "C:\Users\user\Desktop\Web_Learning_Model"

# 設定 GitHub 遠端 URL
$remoteURL = "https://github.com/xiaoyao3312/Web_Learning_Model.git"

# 切換到專案資料夾
Write-Host "切換到專案資料夾..."
Set-Location $projectPath

# 初始化 Git（如果已初始化會跳過）
if (!(Test-Path ".git")) {
    Write-Host "初始化 Git..."
    git init
} else {
    Write-Host "Git 已初始化，跳過 git init"
}

# 新增所有檔案
Write-Host "新增所有檔案..."
git add .

# Commit
Write-Host "Commit 檔案..."
git commit -m "Initial commit - add Flask project"

# 設定遠端（如果已設定會跳過）
$existingRemote = git remote
if ($existingRemote -notcontains "origin") {
    Write-Host "設定遠端..."
    git remote add origin $remoteURL
} else {
    Write-Host "遠端已設定，跳過 git remote add"
}

# 將分支改為 main
Write-Host "將分支改為 main..."
git branch -M main

# 推送到 GitHub
Write-Host "推送到 GitHub..."
git push -u origin main

Write-Host "完成！請打開 GitHub 確認專案是否上傳成功"
