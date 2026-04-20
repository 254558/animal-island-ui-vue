# animal-island-ui-vue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成 `animal-island-ui-vue` 的 Vue 3 + TypeScript 实现，在保持视觉风格和核心行为一致的前提下完成构建、组件、demo 与文档基础迁移。

**Architecture:** 保留现有 `src/styles` 和各组件 `*.module.less` 作为视觉基线，逐个将组件等形迁移为 Vue 单文件组件；用最少的内部抽象解决受控状态和 class 拼接；demo 一并迁移到 Vue，作为视觉验证载体。

**Tech Stack:** Vue 3, TypeScript, Vite, Less, CSS Modules, Vue TSC, Vitest, Vue Test Utils

---

## File Structure

本轮实施会创建或修改以下关键文件：

- 修改：`package.json`
- 修改：`tsconfig.json`
- 修改：`tsconfig.build.json`
- 修改：`vite.config.ts`
- 修改：`vite.config.demo.ts`
- 修改：`src/typings.d.ts`
- 修改：`src/index.ts`
- 创建：`src/plugin.ts`
- 创建：`src/internal/classNames.ts`
- 创建：`src/internal/useControllable.ts`
- 修改：`src/components/*/index.ts`
- 替换：`src/components/*/*.tsx` → `src/components/*/*.vue`
- 创建：`tests/setup.ts`
- 创建：`tests/unit/*.test.ts`
- 替换：`demo/*.tsx` → `demo/*.vue` / `demo/*.ts`
- 修改：`README.md`

### Task 1: 迁移工具链到底座可编译状态

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `tsconfig.build.json`
- Modify: `vite.config.ts`
- Modify: `vite.config.demo.ts`
- Modify: `src/typings.d.ts`
- Create: `src/plugin.ts`
- Create: `src/internal/classNames.ts`
- Create: `src/internal/useControllable.ts`
- Create: `tests/setup.ts`

- [ ] **Step 1: 写出会失败的最小单元测试骨架**

```ts
import { describe, expect, it } from 'vitest';

describe('tooling bootstrap', () => {
  it('loads test runner', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: 运行测试验证当前配置失败**

Run: `npx vitest run`
Expected: FAIL with missing `vitest` or missing Vue test environment configuration

- [ ] **Step 3: 最小实现 Vue 工具链和测试配置**

```ts
// src/internal/classNames.ts
export function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}
```

```ts
// src/internal/useControllable.ts
import { computed, ref, watch } from 'vue';

interface UseControllableOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllable<T>(options: UseControllableOptions<T>) {
  const innerValue = ref(options.defaultValue) as { value: T };

  watch(
    () => options.value,
    (value) => {
      if (value !== undefined) innerValue.value = value;
    },
    { immediate: true }
  );

  const currentValue = computed(() =>
    options.value !== undefined ? options.value : innerValue.value
  );

  const setValue = (nextValue: T) => {
    if (options.value === undefined) {
      innerValue.value = nextValue;
    }
    options.onChange?.(nextValue);
  };

  return {
    currentValue,
    setValue,
  };
}
```

```ts
// src/plugin.ts
import type { App, Plugin } from 'vue';
import { Button, Card, Collapse, Cursor, Divider, Input, Modal, Switch } from './index';

const components = [Button, Card, Collapse, Cursor, Divider, Input, Modal, Switch];

const AnimalIslandUIVue: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name, component);
    });
  },
};

export default AnimalIslandUIVue;
```

- [ ] **Step 4: 运行测试和构建，确认底座通过**

Run: `npx vitest run`
Expected: PASS with at least 1 test passing

Run: `npm run build`
Expected: PASS after Vite/Vue/Vue TSC configuration migration

- [ ] **Step 5: 提交底座迁移**

```bash
git add package.json tsconfig.json tsconfig.build.json vite.config.ts vite.config.demo.ts src/typings.d.ts src/plugin.ts src/internal/classNames.ts src/internal/useControllable.ts tests/setup.ts
git commit -m "feat: migrate tooling to vue 3"
```

### Task 2: 先迁移静态基础组件

**Files:**
- Modify: `src/components/Card/index.ts`
- Modify: `src/components/Cursor/index.ts`
- Modify: `src/components/Divider/index.ts`
- Replace: `src/components/Card/Card.tsx`
- Replace: `src/components/Cursor/Cursor.tsx`
- Replace: `src/components/Divider/Divider.tsx`
- Test: `tests/unit/card.test.ts`
- Test: `tests/unit/cursor.test.ts`
- Test: `tests/unit/divider.test.ts`

- [ ] **Step 1: 为 Card 写失败测试**

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Card } from '../../src/components/Card';

describe('Card', () => {
  it('renders slot content and color class', () => {
    const wrapper = mount(Card, {
      props: { color: 'app-blue', type: 'title' },
      slots: { default: 'hello' },
    });

    expect(wrapper.text()).toContain('hello');
    expect(wrapper.classes().some((name) => name.includes('card-title'))).toBe(true);
  });
});
```

- [ ] **Step 2: 运行 Card 测试确认失败**

Run: `npx vitest run tests/unit/card.test.ts`
Expected: FAIL because Vue component export does not exist yet

- [ ] **Step 3: 最小实现 Card / Cursor / Divider 的 Vue 版本**

```vue
<script setup lang="ts">
defineOptions({ name: 'Card' });
</script>

<template>
  <div>
    <slot />
  </div>
</template>
```

要求：

- Card 透传 `class`、`style`、`click`
- Cursor 保持根节点包裹
- Divider 保持单根节点装饰线

- [ ] **Step 4: 运行静态组件测试**

Run: `npx vitest run tests/unit/card.test.ts tests/unit/cursor.test.ts tests/unit/divider.test.ts`
Expected: PASS

- [ ] **Step 5: 提交静态组件迁移**

```bash
git add src/components/Card src/components/Cursor src/components/Divider tests/unit/card.test.ts tests/unit/cursor.test.ts tests/unit/divider.test.ts
git commit -m "feat: migrate static components to vue"
```

### Task 3: 迁移 Button / Input / Switch

**Files:**
- Replace: `src/components/Button/Button.tsx`
- Replace: `src/components/Input/Input.tsx`
- Replace: `src/components/Switch/Switch.tsx`
- Modify: `src/components/Button/index.ts`
- Modify: `src/components/Input/index.ts`
- Modify: `src/components/Switch/index.ts`
- Test: `tests/unit/button.test.ts`
- Test: `tests/unit/input.test.ts`
- Test: `tests/unit/switch.test.ts`

- [ ] **Step 1: 为 Button / Input / Switch 写失败测试**

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { Switch } from '../../src/components/Switch';

describe('Button', () => {
  it('renders loading and icon states', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: '提交', icon: '☆' },
    });

    expect(wrapper.text()).toContain('提交');
    expect(wrapper.attributes('disabled')).toBeDefined();
  });
});
```

要求：

- Input 测试覆盖 `v-model`、`allowClear`
- Switch 测试覆盖 `defaultChecked`、`checked`、`change`

- [ ] **Step 2: 运行行为组件测试确认失败**

Run: `npx vitest run tests/unit/button.test.ts tests/unit/input.test.ts tests/unit/switch.test.ts`
Expected: FAIL because old React components cannot mount in Vue tests

- [ ] **Step 3: 最小实现 Button / Input / Switch Vue 组件**

要求：

- Button 保留 `type`、`size`、`danger`、`ghost`、`block`、`loading`、`disabled`、`htmlType`
- Input 支持 `modelValue`、`value`、`defaultValue`、`update:modelValue`、`change`、`clear`
- Switch 支持 `checked`、`modelValue`、`defaultChecked`、`update:checked`、`update:modelValue`、`change`

- [ ] **Step 4: 运行行为组件测试**

Run: `npx vitest run tests/unit/button.test.ts tests/unit/input.test.ts tests/unit/switch.test.ts`
Expected: PASS

- [ ] **Step 5: 提交基础交互组件迁移**

```bash
git add src/components/Button src/components/Input src/components/Switch tests/unit/button.test.ts tests/unit/input.test.ts tests/unit/switch.test.ts
git commit -m "feat: migrate button input and switch to vue"
```

### Task 4: 迁移 Collapse / Modal

**Files:**
- Replace: `src/components/Collapse/Collapse.tsx`
- Replace: `src/components/Modal/Modal.tsx`
- Modify: `src/components/Collapse/index.ts`
- Modify: `src/components/Modal/index.ts`
- Test: `tests/unit/collapse.test.ts`
- Test: `tests/unit/modal.test.ts`

- [ ] **Step 1: 为 Collapse / Modal 写失败测试**

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Collapse } from '../../src/components/Collapse';

describe('Collapse', () => {
  it('opens when defaultExpanded is true', () => {
    const wrapper = mount(Collapse, {
      props: {
        question: 'q',
        answer: 'a',
        defaultExpanded: true,
      },
    });

    expect(wrapper.text()).toContain('a');
  });
});
```

要求：

- Modal 测试覆盖 `open`、`v-model:open`、遮罩关闭、ESC 关闭、`footer = null`

- [ ] **Step 2: 运行复杂组件测试确认失败**

Run: `npx vitest run tests/unit/collapse.test.ts tests/unit/modal.test.ts`
Expected: FAIL because Vue implementations do not exist yet

- [ ] **Step 3: 最小实现 Collapse / Modal Vue 组件**

要求：

- Collapse 支持 `question`、`answer` prop 和 slot 兼容
- Modal 使用 `Teleport`
- Modal 保留 `open`、`title`、`width`、`maskClosable`、`closable`
- Modal 事件提供 `update:open`、`close`、`ok`

- [ ] **Step 4: 运行复杂组件测试**

Run: `npx vitest run tests/unit/collapse.test.ts tests/unit/modal.test.ts`
Expected: PASS

- [ ] **Step 5: 提交复杂组件迁移**

```bash
git add src/components/Collapse src/components/Modal tests/unit/collapse.test.ts tests/unit/modal.test.ts
git commit -m "feat: migrate collapse and modal to vue"
```

### Task 5: 更新公共导出、demo 和 README

**Files:**
- Modify: `src/index.ts`
- Replace: `demo/main.tsx`
- Replace: `demo/App.tsx`
- Replace: `demo/HomePage.tsx`
- Replace: `demo/ComponentPage.tsx`
- Modify: `README.md`

- [ ] **Step 1: 写 demo 入口可渲染的失败验证**

Run: `npm run build:demo`
Expected: FAIL after React 依赖移除、demo 仍然使用 TSX/React

- [ ] **Step 2: 最小实现 Vue demo**

要求：

- demo 继续保留当前页面结构和视觉资源
- 组件展示内容与当前 React demo 尽量对齐
- Vue demo 作为当前视觉验收载体

- [ ] **Step 3: 更新 README 与包信息**

要求：

- 包名改为 `animal-island-ui-vue`
- 快速开始示例切换为 Vue 3
- 明确这是 Vue 版本

- [ ] **Step 4: 运行 demo 构建和库构建**

Run: `npm run build`
Expected: PASS

Run: `npm run build:demo`
Expected: PASS

- [ ] **Step 5: 提交对外入口迁移**

```bash
git add src/index.ts demo README.md package.json
git commit -m "feat: migrate public entry and demo to vue"
```

### Task 6: 完整验证并清理 React 依赖

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: remaining config/test files as needed

- [ ] **Step 1: 运行完整测试**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 2: 运行完整构建**

Run: `npm run build`
Expected: PASS

Run: `npm run build:demo`
Expected: PASS

- [ ] **Step 3: 检查 React 残留**

Run: `rg -n "react|ReactDOM|@vitejs/plugin-react|react-dom" src demo package.json vite.config.ts vite.config.demo.ts tsconfig.json tsconfig.build.json README.md`
Expected: no matches except migration 文档中的对照说明

- [ ] **Step 4: 清理残留并复验**

Run: `npx vitest run && npm run build && npm run build:demo`
Expected: all PASS

- [ ] **Step 5: 提交完整 Vue 迁移**

```bash
git add .
git commit -m "feat: complete vue 3 component library migration"
```
