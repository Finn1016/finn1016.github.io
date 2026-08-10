---
title: "Git 与 GitHub 基础"
tags:
  - 教程
  - 网站
date: 2026-08-09
---

## 概念

**Git** 是一个版本管理工具。它记录文件夹里每次改了什么、谁改的、什么时候改的。安装在本地电脑上，在终端里用 `git` 命令操作。

**GitHub** 是一个托管 Git 仓库的网站。把本地仓库推到 GitHub 之后，代码就有了云端备份，GitHub Pages 也能从仓库自动部署网站。

**仓库（repository）** 就是一个被 Git 跟踪的文件夹。`PersonalWebsite/` 目录就是一个本地仓库。推送到 GitHub 之后，GitHub 上那份叫远程仓库。

**提交（commit）** 是 Git 的核心操作。把当前所有修改打成一个快照，附带一条说明信息。

**分支（branch）** 是一条独立的提交线。本站用 `v4` 分支（Quartz 默认），GitHub Actions 监听 `v4` 分支的变化自动部署。

## 首次推送

把本地项目上传到 GitHub（只需做一次）：

```bash
# 进入项目目录
cd D:/Finn/PersonalWebsite

# 把当前目录变成 Git 仓库
git init

# 把目录里所有文件加入暂存区
git add .

# 创建第一个提交
git commit -m "first commit"

# 关联在 GitHub 上创建的远程仓库
git remote add origin https://github.com/Finn1016/finn1016.github.io.git

# 切到 v4 分支并推送到 GitHub
git branch -M v4
git push -u origin v4
```

`-u` 的意思是记住 origin v4 作为默认上游。以后推送只需 `git push`。

## 日常更新流程

每次改了网站内容之后：

```bash
cd D:/Finn/PersonalWebsite

# 看哪些文件被改过
git status

# 把所有改动加入暂存区
git add .

# 提交
git commit -m "添加了一篇新笔记"

# 推送到 GitHub（触发自动部署）
git push
```

`add → commit → push` 就是以后最常用的操作。

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

## clone 和 pull

如果在另一台电脑上想继续编辑网站：

```bash
# 把远程仓库下载到本地
git clone https://github.com/Finn1016/finn1016.github.io.git
cd finn1016.github.io
npm install
```

在一台电脑改完并 push 之后，在另一台电脑用 `git pull` 同步：

```bash
git pull
```

## 提交信息怎么写

提交信息用一句话说清改了什么，不需要技术术语：

```
git commit -m "更新关于页面"
git commit -m "添加电路设计笔记：MOSFET选型"
git commit -m "修正首页图片尺寸"
```

## 注意事项

- `node_modules/` 和 `public/` 不提交到 Git（`.gitignore` 已配置排除）。`public/` 由 GitHub Actions 在服务器上构建生成。
- 本地构建测试用 `npx quartz build --serve --port 8080`。确认没问题后再 `git push`。
- 如果改动了 `quartz.config.ts` 或 `quartz.layout.ts`，push 之后需要等 Actions 跑完（约 1 分钟）才能看到效果。
