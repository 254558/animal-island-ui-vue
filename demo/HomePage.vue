<script setup lang="ts">
import { Button, Card, Collapse, Divider } from '../src';
import CodeBlock from './CodeBlock.vue';

const emit = defineEmits<{
    (event: 'navigate', path: string): void;
}>();

const logoUrl = new URL('./img/animal_icon.svg', import.meta.url).href;
const icons = {
    nook1: new URL('./img/nook-phone/nook1.svg', import.meta.url).href,
    apps: new URL('./img/nook-phone/AppIcons.svg', import.meta.url).href,
    camera: new URL(
        './img/nook-phone/Property-Camera.svg',
        import.meta.url
    ).href,
    recipes: new URL(
        './img/nook-phone/Property-Recipes.svg',
        import.meta.url
    ).href,
};

const githubRepo = 'https://github.com/yanstu/animal-island-ui-vue';

const features = [
    {
        icon: icons.nook1,
        title: 'Animal 风格',
        desc: '有机轮廓、圆润阴影与轻微弹性反馈，把熟悉的岛屿气质带进页面。',
    },
    {
        icon: icons.apps,
        title: '30 个组件',
        desc: '覆盖输入、反馈、导航、展示与浮层场景，开箱即可运转。',
    },
    {
        icon: icons.camera,
        title: '主题定制',
        desc: 'CSS 自定义属性支持运行时换肤，覆盖几行变量即可改变全局风格。',
    },
    {
        icon: icons.recipes,
        title: '类型完备',
        desc: 'TypeScript 类型声明完整，接入即有代码提示，减少查文档次数。',
    },
];

const components = [
    ['avatar', 'Avatar', '头像、尺寸与文案回退'],
    ['badge', 'Badge', '数量提醒、小红点式徽标'],
    ['button', 'Button', '5 种类型、3 种尺寸、加载/危险/幽灵模式'],
    ['checkbox', 'Checkbox', '布尔勾选、受控/非受控切换'],
    ['descriptions', 'Descriptions', '标签与内容成组展示的详情信息块'],
    ['empty', 'Empty', '空状态占位与说明文案'],
    ['drawer', 'Drawer', '轻量抽屉浮层与侧边内容承载'],
    ['form', 'Form', '表单容器与布局骨架'],
    ['form-item', 'FormItem', '标签、帮助文案与状态承载'],
    ['input', 'Input', '前后缀、一键清空、状态反馈'],
    ['list', 'List', '轻量事项列表与说明型列表'],
    ['message', 'Message', '岛屿广播式轻提示条'],
    ['notification', 'Notification', '声明式通知卡片与状态样式'],
    ['pagination', 'Pagination', '圆角分页按钮与页码切换'],
    ['popover', 'Popover', '点击展开的轻气泡内容卡'],
    ['progress', 'Progress', '进度条与百分比状态展示'],
    ['radio', 'Radio', '单选值回传、圆点风格选择器'],
    ['rate', 'Rate', '星级评分与基础交互反馈'],
    ['select', 'Select', '单选下拉、占位文案、基础选项面板'],
    ['slider', 'Slider', '数值滑动选择与实时反馈'],
    ['switch', 'Switch', '受控与非受控、自定义文案'],
    ['tabs', 'Tabs', '圆角页签切换与受控键值'],
    ['tag', 'Tag', '轻量标签与低饱和彩色状态'],
    ['textarea', 'Textarea', '多行输入、清空按钮、状态反馈'],
    ['tooltip', 'Tooltip', '悬停文字提示与轻浮层反馈'],
    ['modal', 'Modal', '有机形态弹窗、Teleport、ESC 关闭'],
    ['card', 'Card', '默认卡片与标题卡片'],
    ['collapse', 'Collapse', 'FAQ 折叠面板与展开动画'],
    ['cursor', 'Cursor', '自定义手指光标'],
    ['divider-comp', 'Divider', '装饰性分割线'],
] as const;

const quickStartCode = `import { ref } from 'vue';
import { Button, Input, Pagination, Popover, Select, Switch, Tag, Tabs } from 'animal-island-ui-vue';

const keyword = ref('');
const checked = ref(false);
const activity = ref('');
const current = ref(1);

<Button type="primary">开始</Button>
<Popover content="今天适合钓鱼">
  <Button>查看提示</Button>
</Popover>
<Input v-model="keyword" allow-clear />
<Select v-model="activity" :options="[{ label: '钓鱼大赛', value: 'fishing' }]" />
<Switch v-model:checked="checked" />
<Tag color="mint">岛民活动</Tag>
<Tabs :items="[{ key: 'fish', label: '鱼类' }]" />
<Pagination v-model:current="current" :total="60" :page-size="10" />`;
</script>

<template>
    <div class="page home-page">
        <section class="hero home-hero">
            <img :src="logoUrl" alt="Animal Island UI" class="hero-logo" />
            <h1 class="hero-title">
                Animal Island UI
                <span class="hero-version">v0.1.0</span>
            </h1>
            <p class="hero-subtitle">
                Animal Island 风格的 Vue 3 组件库
                <br />
                30 个开箱即用的温暖质感组件，基于 TypeScript + Vite 构建
            </p>
            <div class="hero-actions">
                <Button type="primary" size="large" @click="emit('navigate', '/quick-start')">
                    开始使用 →
                </Button>
            </div>
        </section>

        <section class="section">
            <h2 class="section-title">特性</h2>
            <p class="section-desc">让你的产品多一点岛屿气质</p>
            <div class="feature-grid">
                <Card v-for="feature in features" :key="feature.title" class="feature-card">
                    <img :src="feature.icon" :alt="feature.title" class="feature-icon" />
                    <div class="feature-title">{{ feature.title }}</div>
                    <div class="feature-desc">{{ feature.desc }}</div>
                </Card>
            </div>
        </section>

        <Divider class="divider" />

        <section class="section">
            <h2 class="section-title">组件一览</h2>
            <p class="section-desc">点击卡片查看详细文档和在线演示</p>
            <div class="component-grid">
                <Card
                    v-for="[key, name, desc] in components"
                    :key="key"
                    class="component-card"
                    @click="emit('navigate', `/${key}`)"
                >
                    <div class="component-name">{{ name }}</div>
                    <div class="component-desc">{{ desc }}</div>
                </Card>
            </div>
        </section>

        <Divider class="divider" />

        <section class="section">
            <h2 class="section-title">安装</h2>
            <p class="section-desc">5 分钟完成接入</p>
            <CodeBlock code="// 使用 npm 安装&#10;npm install animal-island-ui-vue" />
        </section>

        <Divider class="divider" />

        <section class="section">
            <h2 class="section-title">快速上手</h2>
            <p class="section-desc">按需引入或全量注册，样式随组件自动加载</p>
            <CodeBlock :code="quickStartCode" />
        </section>

        <Divider class="divider" />

        <section class="section">
            <h2 class="section-title">主题定制</h2>
            <p class="section-desc">通过覆盖 CSS 自定义属性实现运行时换肤，无需重新构建</p>
            <CodeBlock
                code=":root {&#10;  --animal-primary-color: #19c8b9;&#10;  --animal-text-color: #827157;&#10;  --animal-border-radius-base: 18px;&#10;}"
            />
        </section>

        <footer class="footer">
            <div class="footer-links">
                <span class="footer-link" @click="emit('navigate', '/button')">组件文档</span>
                <a :href="githubRepo" target="_blank" rel="noreferrer" class="footer-link">GitHub</a>
                <span class="footer-link" @click="emit('navigate', '/')">首页</span>
            </div>
            <div class="footer-meta">MIT License · Vue 3 + TypeScript + Vite</div>
        </footer>
    </div>
</template>

<style scoped>
.page {
    width: 100%;
    min-height: 100vh;
    overflow-y: auto;
}

.home-page {
    display: block;
}

.home-page::after {
    content: '';
    position: fixed;
    inset: auto 0 0;
    height: 220px;
    background: linear-gradient(180deg, rgba(125, 195, 149, 0) 0%, rgba(125, 195, 149, 0.28) 65%, rgba(125, 195, 149, 0.5) 100%);
    pointer-events: none;
}

.hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 60px 40px 40px;
    text-align: center;
    position: relative;
    z-index: 1;
}

.hero-logo {
    width: 172px;
    height: 172px;
    margin-bottom: 16px;
    filter: drop-shadow(0 8px 16px rgba(61, 48, 40, 0.12));
}

.hero-title {
    margin: 0 0 12px;
    color: #fff9e6;
    font-size: 50px;
    font-weight: 700;
    text-shadow: 0 4px 1px rgba(0, 0, 0, 0.4);
}

.hero-version {
    display: inline-block;
    margin-left: 8px;
    padding: 2px 10px;
    border-radius: 10px;
    background: #e6f9f6;
    color: #19c8b9;
    font-size: 12px;
    font-weight: 600;
    text-shadow: none;
    vertical-align: middle;
}

.hero-subtitle {
    max-width: 520px;
    margin: 0 0 28px;
    color: #7c5734;
    font-size: 17px;
    line-height: 1.7;
}

.section {
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 40px;
    position: relative;
    z-index: 1;
}

.section-title {
    margin: 0 0 8px;
    color: #725d42;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
}

.section-desc {
    margin: 0 0 32px;
    color: #7c5734;
    font-size: 14px;
    text-align: center;
}

.feature-grid,
.component-grid,
.repo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.feature-card,
.component-card {
    padding: 24px 20px;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}

.feature-card:hover,
.component-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(114, 93, 66, 0.15);
}

.component-card {
    cursor: pointer;
}

.repo-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.feature-icon {
    width: 42px;
    height: 42px;
    margin-bottom: 12px;
    transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
    transform: scale(1.1) rotate(-4deg);
    animation: iconBounce 0.4s ease forwards;
}

@keyframes iconBounce {
    0% {
        transform: scale(1) rotate(0deg);
    }

    50% {
        transform: scale(1.2) rotate(-5deg);
    }

    100% {
        transform: scale(1.1) rotate(-4deg);
    }
}

.feature-title,
.component-name {
    margin-bottom: 6px;
    color: #725d42;
    font-size: 15px;
    font-weight: 700;
}

.feature-desc,
.component-desc {
    color: #7c5734;
    font-size: 12px;
    line-height: 1.6;
}

.divider {
    width: min(800px, calc(100% - 80px));
    margin: 0 auto;
}

.footer {
    margin-top: 32px;
    padding: 32px 40px;
    color: #7c5734;
    font-size: 12px;
    text-align: center;
    position: relative;
    z-index: 1;
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 12px;
}

.footer-link {
    color: #7c5734;
    font-size: 13px;
    text-decoration: none;
    cursor: pointer;
}

.footer-meta {
    font-size: 12px;
}
</style>
