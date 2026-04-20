# animal-island-ui-vue

一套基于 Vue 3、TypeScript 与 Vite 的 Animal 风格组件库。

- GitHub: https://github.com/yanstu/animal-island-ui-vue
- 在线预览: https://animal-island-ui-vue.netlify.app

## 介绍

`animal-island-ui-vue` 面向内容展示、活动页面、社区互动页与轻量业务页面，提供统一的圆润轮廓、温暖配色、柔和动效与可复用组件语义。

当前版本已经覆盖输入、反馈、导航、展示与浮层场景，适合作为 Vue 3 项目的界面基础层。

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

        <Pagination
            v-model:current="current"
            :total="60"
            :page-size="10"
        />
    </div>
</template>
```

## 组件范围

- `Avatar`
- `Badge`
- `Button`
- `Checkbox`
- `Descriptions`
- `Drawer`
- `Empty`
- `Form`
- `FormItem`
- `Input`
- `List`
- `Message`
- `Modal`
- `Notification`
- `Pagination`
- `Popover`
- `Progress`
- `Radio`
- `Rate`
- `Select`
- `Slider`
- `Switch`
- `Tabs`
- `Tag`
- `Textarea`
- `Tooltip`
- `Card`
- `Collapse`
- `Cursor`
- `Divider`

## 开发

```bash
npm install
npm run dev
npm run build
npm run build:demo
npm test
```

## 设计原则

- 组件 API 优先遵循 Vue 3 的使用习惯
- 样式统一由 Less 模块与 CSS 自定义属性管理
- 视觉表达保持圆润、轻盈、低压迫感
- 组件命名、目录结构与类型导出保持稳定

## 版权与说明

- 本项目为非官方开源项目，与任天堂株式会社无任何关联、授权或合作关系。
- 组件库中的视觉表达仅用于风格研究与界面实现练习。
- 如有版权相关问题，可通过仓库 Issue 联系处理。

## License

MIT

## 致谢

感谢开源项目 [guokaigdg/animal-island-ui](https://github.com/guokaigdg/animal-island-ui) 提供的风格灵感与界面参考。
