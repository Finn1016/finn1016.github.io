# 个人网站

这里是个人网站的内容仓库，记录学习笔记与知识整理。

网站地址：<https://finn1016.github.io>

## 技术栈

使用 [Quartz](https://quartz.jzhao.xyz/) 构建。内容用 Markdown 编写，构建后生成纯静态 HTML，通过 GitHub Pages 托管。

## 目录结构

```
content/              内容目录（只需关心这里）
  index.md            首页
  archive.md          归档
  categories.md       分类
  friends.md          友链
  about.md            关于
  assets/             图片等静态资源
  notes/              笔记（按主题分目录）
quartz/               框架源码（不要手动修改）
quartz.config.ts      站点配置
quartz.layout.ts      页面布局配置
public/               构建输出（自动生成，不提交）
```

## 本地预览

```bash
npm install
npx quartz build --serve --port 8080
```

浏览器打开 <http://localhost:8080>。按 `Ctrl+C` 停止。

## 发布

内容改动推送到 `v4` 分支后，GitHub Actions 会自动构建并部署到 `gh-pages` 分支。

```bash
git add .
git commit -m "描述本次改动"
git push
```

推送后约 1-2 分钟，在仓库的 Actions 页面可以看到构建状态。

## 写笔记的约定

1. 在 `content/notes/<分类>/` 下新建 `.md` 文件
2. 文件开头写 frontmatter：

   ```yaml
   ---
   title: "标题"
   tags:
     - 标签
   date: 2026-01-01
   ---
   ```

3. 图片放在 `content/assets/`，用 `![[assets/图片名.jpg]]` 引用
4. 笔记之间用 `[[路径|显示文字]]` 建立双向链接
5. 在 `content/archive.md` 中补一行归档记录

## 许可

`quartz/` 目录下的框架代码来自 Quartz 项目，遵循 MIT 协议（见 `LICENSE.txt`）。
