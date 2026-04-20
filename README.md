# animal-island-ui-vue

一套基于 Vue 3、TypeScript 与 Vite 的 Animal 风格组件库。

- GitHub: https://github.com/yanstu/animal-island-ui-vue
- 在线预览: https://animal-island-ui-vue.netlify.app

## 介绍

`animal-island-ui-vue` 是一套 Animal Island 风格的 Vue 3 组件库，提供圆润轮廓、温暖配色与柔和动效，适合内容展示、活动页面、社区互动页与轻量业务页面。

当前版本包含 30 个组件，覆盖输入、反馈、导航、展示与浮层场景，可直接作为 Vue 3 项目的界面基础层使用。

## 安装

```bash
npm install animal-island-ui-vue
```

也可以从 GitHub Packages 安装 scoped 包：

```bash
npm login --scope=@yanstu --auth-type=legacy --registry=https://npm.pkg.github.com
npm config set @yanstu:registry https://npm.pkg.github.com
npm install @yanstu/animal-island-ui-vue
```

## 快速开始

```ts
import { createApp } from 'vue';
import App from './App.vue';
import AnimalIslandUIVue from 'animal-island-ui-vue';

createApp(App).use(AnimalIslandUIVue).mount('#app');
```

GitHub Packages 对应的导入路径为：

```ts
import AnimalIslandUIVue from '@yanstu/animal-island-ui-vue';
```

## 按需使用

```vue
<script setup lang="ts">
import { ref } from 'vue';
import {
    Button,
    Input,
    Pagination,
    Popover,
    Select,
    Switch,
    Tag,
    Tabs,
} from 'animal-island-ui-vue';

const keyword = ref('');
const checked = ref(true);
const activity = ref('');
const current = ref(1);
</script>

<template>
    <div>
        <Button type="primary">开始冒险</Button>

        <Popover content="今天适合钓鱼">
            <Button>查看提示</Button>
        </Popover>

        <Input v-model="keyword" allow-clear placeholder="搜索岛屿活动" />

        <Select
            v-model="activity"
            :options="[
                { label: '钓鱼大赛', value: 'fishing' },
                { label: '捉虫大会', value: 'bug' },
            ]"
        />

        <Switch
            v-model:checked="checked"
            checked-children="开"
            un-checked-children="关"
        />

        <Tag color="mint">岛民活动</Tag>

        <Tabs
            :items="[
                { key: 'fish', label: '鱼类' },
                { key: 'bug', label: '昆虫' },
            ]"
        />

        <Pagination v-model:current="current" :total="60" :page-size="10" />
    </div>
</template>
```

## 组件范围

**输入**
`Input` · `Textarea` · `Select` · `Checkbox` · `Radio` · `Switch` · `Slider` · `Rate` · `Form` · `FormItem`

**反馈**
`Button` · `Progress` · `Message` · `Notification` · `Empty`

**导航**
`Tabs` · `Pagination`

**展示**
`Avatar` · `Badge` · `Tag` · `Descriptions` · `List` · `Card` · `Collapse` · `Divider`

**浮层**
`Modal` · `Drawer` · `Popover` · `Tooltip`

**通用**
`Cursor`

## 开发

```bash
npm install
npm run dev
npm run build
npm run build:demo
npm test
```

## 设计原则

- 组件 API 对齐 Vue 3 惯用语，减少学习负担
- 样式由 Less 模块与 CSS 自定义属性统一管理，支持运行时主题覆盖
- 视觉风格圆润轻盈，温和而不强迫
- 组件命名、目录结构与类型导出保持稳定

## 版权与说明

- 本项目为个人开源项目，与任天堂株式会社无任何关联或授权。
- 视觉风格仅作界面实现参考，如有版权问题欢迎通过仓库 Issue 联系。

## License

MIT

## 致谢

本项目基于 [guokaigdg/animal-island-ui](https://github.com/guokaigdg/animal-island-ui) React版重构为Vue版。
