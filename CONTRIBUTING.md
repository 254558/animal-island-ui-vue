# Contributing to animal-island-ui-vue

感谢你关注 `animal-island-ui-vue`，欢迎提交 Issue 和 Pull Request。

## 提交 Issue

- 请在当前仓库的 GitHub Issues 中提交 Bug 报告或功能建议。
- Bug 报告建议附上复现步骤、预期结果、实际结果与环境信息。
- 功能建议请尽量说明使用场景、交互目标与期望 API。

## 提交 Pull Request

1. Fork 当前仓库并基于 `main` 创建分支。
2. 完成修改后，确保 `npm test`、`npm run build` 与 `npm run build:demo` 通过。
3. 提交信息建议遵循 [Conventional Commits](https://www.conventionalcommits.org/)。
4. 在 Pull Request 中简要说明改动内容、影响范围与验证方式。

## 本地开发

```bash
git clone https://github.com/yanstu/animal-island-ui-vue.git
cd animal-island-ui-vue

npm install
npm run dev
npm run build
npm run build:demo
npm test
```

## 项目结构

```text
src/
  components/
    Button/
      Button.vue
      button.module.less
      index.ts
    ...
  internal/
    classNames.ts
    useControllable.ts
  styles/
    variables.less
    themes/default.less
    reset.less
    index.less
  index.ts
  plugin.ts
demo/
tests/
```

## 新增组件规范

1. 在 `src/components/` 下创建同名目录。
2. 组件实现使用 Vue 单文件组件，样式使用 `*.module.less`。
3. 组件导出统一通过各自目录下的 `index.ts` 暴露。
4. 公共逻辑优先放在 `src/internal/`，避免重复实现。
5. 示例与文档演示需同步更新。

## 设计令牌

组件库通过 CSS 自定义属性支持主题覆盖，常用变量包括：

- `--animal-primary-color`
- `--animal-text-color`
- `--animal-bg-color`
- `--animal-border-color`
- `--animal-border-radius-base`
- `--animal-shadow-base`
- `--animal-spacing-md`
- `--animal-motion-duration-base`

覆盖示例：

```css
:root {
    --animal-primary-color: #19c8b9;
    --animal-text-color: #827157;
    --animal-bg-color: #f8f8f0;
}
```

## License

MIT
