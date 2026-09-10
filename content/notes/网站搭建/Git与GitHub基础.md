---
title: "Git 与 GitHub 基础"
tags:
  - 教程
  - 网站
date: 2026-08-10
---

## 这篇指南是干什么的

本地用 Quartz 搭好网站后，通过 `npx quartz build --serve --port 8080` 能在自己电脑上预览，但别人访问不到。这篇指南说明如何把网站发布到公网，通过 GitHub Pages 托管。

发布方式：把项目推送到 GitHub，用 GitHub Actions 自动构建部署。

## 发布后的运作方式

- 网站源码（Markdown 笔记、配置文件）存放在 GitHub 仓库的 `v4` 分支
- 每次修改笔记后，执行 add、commit、push 三条命令即可更新网站
- GitHub Actions 在服务器上运行 `npx quartz build`，生成 HTML 文件，推到 `gh-pages` 分支
- 访问 `https://用户名.github.io` 看到的是 `gh-pages` 分支上的静态文件

整个过程只操作 Markdown 文件，服务器端的构建是自动的。

## 准备工作

| 东西 | 说明 |
|------|------|
| Git | 终端输入 `git --version` 检查是否已安装。没有的话去 [git-scm.com](https://git-scm.com) 下载 |
| GitHub 账号 | 在 [github.com](https://github.com) 注册。记住用户名，后面用来拼网址 |
| 本地项目 | 一个已经在 `localhost` 跑起来的 Quartz 网站 |

## 概念

**Git** 是一个版本管理工具。它记录文件夹里每次改了什么、谁改的、什么时候改的。安装在本地电脑上，在终端里用 `git` 命令操作。

**GitHub** 是一个托管 Git 仓库的网站。把本地仓库推到 GitHub 之后，代码就有了云端备份，GitHub Pages 也能从仓库自动部署网站。

**仓库（repository）** 就是一个被 Git 跟踪的文件夹。`PersonalWebsite/` 目录就是一个本地仓库。推送到 GitHub 之后，GitHub 上那份叫远程仓库。

**提交（commit）** 是 Git 的核心操作。把当前所有修改打成一个快照，附带一条说明信息。

**分支（branch）** 是一条独立的提交线。本站用 `v4` 分支（Quartz 默认），GitHub Actions 监听 `v4` 分支的变化自动部署。部署产物在 `gh-pages` 分支上，由 Actions 自动生成和维护，不需要手动操作。

## 第一步：创建 GitHub 仓库

打开 [github.com/new](https://github.com/new)，填写：

- **Repository name**：`用户名.github.io`。比如用户名是 `example`，就填 `example.github.io`。只有仓库叫这个名字，GitHub Pages 才会把网站挂在 `https://用户名.github.io`。
- **类型**：选 Public。GitHub Pages 要求公开仓库。
- **不要勾选** "Add a README file"、"Add .gitignore"、"Choose a license"。本地已经有完整的项目文件，GitHub 上创建额外文件会导致推送时冲突。

点击 Create repository。页面会跳转到一个显示 `git remote add origin ...` 命令的界面，后面会用到。

## 第二步：把本地项目推送到 GitHub

在终端中逐条执行。每条命令附解释。

### 2.1 进入项目目录

```powershell
D: ; cd D:\你的项目目录
```

路径换成自己的。若在 PowerShell 中操作，切换盘符需要先单独输入盘符名（如 `D:`）再 `cd`。

### 2.2 初始化 Git 仓库

```bash
git init
```

把当前文件夹变成 Git 仓库。执行后文件夹里出现隐藏的 `.git` 目录，Git 用它跟踪所有文件的改动历史。这个命令只需执行一次。

### 2.3 暂存所有文件

```bash
git add .
```

把当前目录下的所有文件和改动加入暂存区。暂存区是"待提交清单"——Git 不会自动决定哪些改动要保存，需要用 `add` 明确指定。

### 2.4 创建第一个提交

```bash
git commit -m "first commit"
```

把暂存区里的内容打成一个快照。`-m` 后面引号里的文字是提交说明，用来记录这次改动做了什么。

### 2.5 关联远程仓库

```bash
git remote add origin https://github.com/用户名/用户名.github.io.git
```

把本地仓库和 GitHub 上的远程仓库关联。`origin` 是远程仓库的别名，之后 `git push` 就是往这个地址推送。URL 就是第一步创建仓库后页面显示的那个。

### 2.6 切换分支并推送

```bash
git branch -M v4
```

把当前分支重命名为 `v4`。Quartz 的 GitHub Actions 默认监听 `v4` 分支，push 到这个分支才会触发自动部署。如果项目是从 Quartz ZIP 解压的，`git init` 后默认分支叫 `main` 或 `master`，需要这条命令统一名称。

```bash
git push -u origin v4
```

把 `v4` 分支推送到 GitHub。`-u` 参数会记住 `origin v4` 作为默认远端和分支，以后只需 `git push` 即可。

这一步可能弹出 `The authenticity of host 'github.com' can't be established`，输入 `yes` 回车。只在首次连接时出现。

如果推送中途报 `Connection was reset`，说明当前网络到 GitHub 不通。检查网络或代理后重新 `git push`。Git 支持断点续传，不会重复上传已推送过的内容。

## 第三步：启用 GitHub Pages

推送完成后，打开 GitHub 仓库页面，顶部的 **Actions** 标签页。应该能看到一条 "Deploy to GitHub Pages" 的工作流记录。它的执行步骤：

1. `checkout`：把仓库源码拉到 GitHub 的虚拟服务器
2. `setup-node`：安装 Node.js
3. `npm ci`：安装项目依赖
4. `npx quartz build`：执行构建，生成 `public/` 目录
5. `peaceiris/actions-gh-pages`：把 `public/` 目录的内容推到 `gh-pages` 分支

等工作流跑完（黄色圆点变成绿色勾）。如果变成红色叉号，点进去看具体哪一步失败。常见失败原因：

- **peaceiris/actions-gh-pages 失败**：缺少权限。检查 `.github/workflows/deploy.yml` 里是否有 `permissions: contents: write`。如果没有，在 `name:` 行和 `jobs:` 行之间加上。

工作流变绿后，进 Settings > Pages：
- Source 选 **Deploy from a branch**
- Branch 下拉选 **`gh-pages`**，目录选 `/ (root)`
- 点 Save

等几十秒，浏览器访问 `https://用户名.github.io` 即可看到网站。

## 第四步：清理多余分支

进 GitHub 仓库的 Branches 页面（`https://github.com/用户名/用户名.github.io/branches`）。除了 `v4` 和 `gh-pages` 之外，如果看到名字很长的分支（如 `gh-pages-deploy-preview-xxx`），这是 Quartz 自带的预览工作流生成的，点击右侧垃圾桶图标删除。

`v4` 是源码分支，不能删。`gh-pages` 上的内容由它生成。

## 第五步：日常更新流程

每次改了笔记内容：

```bash
cd 项目路径
git add .
git commit -m "描述改了什么"
git push
```

三步拆解：

| 命令 | 做什么 |
|------|--------|
| `git add .` | 把当前目录下所有改动加入暂存区 |
| `git commit -m "说明"` | 把暂存区内容保存为一个提交 |
| `git push` | 把新提交推送到 GitHub，触发自动部署 |

push 之后去 Actions 确认工作流变绿。变绿后刷新网站即可看到更新。整个过程通常 1-2 分钟。

提交信息用一句话说明改动：

```
更新关于页面
添加电路设计笔记：MOSFET选型
修正首页图片尺寸
```

## 常用命令速查

| 命令 | 作用 |
|------|------|
| `git status` | 查看哪些文件有改动 |
| `git add .` | 暂存所有改动 |
| `git add 文件名` | 只暂存某个文件 |
| `git commit -m "说明"` | 提交并附说明 |
| `git push` | 推送到 GitHub |
| `git pull` | 拉取远程的更新 |
| `git log --oneline` | 查看提交历史 |
| `git diff` | 看具体改了什么内容 |

## 换电脑时

```bash
git clone https://github.com/用户名/用户名.github.io.git
cd 用户名.github.io
npm install
```

`git clone` 把远程仓库下载到本地。`npm install` 安装依赖。之后就可以继续写笔记、push 更新。

在另一台电脑改动之前，先 `git pull` 同步远端的最新版本，避免冲突。

## 常见问题

### Push 时报 Connection was reset

网络问题。检查网络或代理后重新 `git push`。

### Actions 工作流跑红

点进去看具体哪一步失败：
- `npm ci` 失败：`package-lock.json` 和 `package.json` 不同步。把这两个文件一起 `git add` 提交。
- `peaceiris` 失败：缺权限。在 `.github/workflows/deploy.yml` 里加上 `permissions: contents: write`。

### Pages 里选不到 gh-pages 分支

说明工作流还没跑完或者跑失败了。先去 Actions 确认 "Deploy to GitHub Pages" 已变绿。

## 整体结构

```
GitHub 仓库
  ├── v4 分支            ← 源码（日常编辑的分支）
  │     content/
  │     quartz/
  │     quartz.config.ts
  │     .github/workflows/deploy.yml
  │
  └── gh-pages 分支      ← 构建产物（Actions 自动生成，不要手动改）
        index.html
        notes/
        static/

本地工作流：
  写 Markdown → npx quartz build 本地预览 → add/commit/push → Actions 构建 → 网站更新
```

## 速查

```bash
# 日常更新
cd 项目路径
git add .
git commit -m "说明"
git push

# 本地预览
npx quartz build --serve --port 8080

# 换电脑时下载
git clone https://github.com/用户名/用户名.github.io.git
cd 用户名.github.io
npm install
```
