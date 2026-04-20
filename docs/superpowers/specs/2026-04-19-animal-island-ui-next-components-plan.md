# animal-island-ui-vue Next Components Plan

## 目标

在保持当前 `animal-island-ui-vue` 视觉语言完全连续的前提下，规划下一批可扩展组件，形成一条适合开源长期维护的组件演进路线。

这个规划的目标不是“把主流组件库全做一遍”，而是：

- 先补齐最影响实际可用性的高频组件
- 保证每个新组件都能自然继承现有视觉系统
- 避免引入会破坏当前气质的企业后台型重组件
- 让后续组件目录、命名、交互模式保持大师级开源仓库的一致性

## 现有风格基线

后续所有组件都必须继承以下视觉基线，不能另起体系：

- 色彩：奶油白底、暖棕文字、薄荷绿主色、低饱和辅色
- 轮廓：圆角偏大，整体接近豆荚形、软胶囊形、圆片形
- 质感：轻 3D、轻按压、轻描边、温和阴影，不走扁平商务风
- 装饰：允许叶片、NookPhone 色板、手账式标签、圆点与柔和分隔线
- 字体与间距：低压迫感，信息密度偏低，阅读节奏偏舒缓
- 动效：时长短、幅度小、阻尼柔和，强调“弹性”和“触感”

凡是不符合这 6 条基线的组件形态，即使功能常见，也不应直接照搬主流库默认样式。

## 参考方式

热门开源组件库的“组件类型”可以参考其分类逻辑，但不能照搬其视觉实现。适合作为类型参考的主要是：

- Ant Design：布局、导航、数据录入、数据展示、反馈
- Element Plus：基础、表单、数据、导航、反馈
- Arco Design：通用、布局、数据输入、数据显示、反馈、导航
- Naive UI：基础交互、浮层、表单、数据展示
- PrimeVue / Vuetify：补充移动端和业务组件覆盖面的视角

对本项目而言，可借鉴的是“分类方法”和“组件谱系”，不是它们的视觉密度、信息结构和企业后台导向。

## 组件扩展原则

### 1. 先做高频轻组件，再做复杂业务壳

优先补齐：

- 用户每天都能用到的输入、选择、提示、导航组件
- 可以复用当前按钮、卡片、弹窗、色板语言的组件

延后处理：

- 表格、树、穿梭框、级联选择、复杂日期体系
- 明显偏企业中后台的数据密集型组件

### 2. 先做能“自然长出来”的组件

最适合当前风格继续生长的，是这些视觉上和现有组件天然相邻的组件：

- 胶囊选择类
- 卡片信息类
- 轻浮层类
- 反馈提示类

### 3. 新组件必须直接复用现有 token

新增组件只能优先使用当前这套变量：

- `--animal-primary-color`
- `--animal-bg-color`
- `--animal-bg-color-secondary`
- `--animal-text-color`
- `--animal-text-color-secondary`
- `--animal-border-color`
- `--animal-border-radius-*`
- `--animal-shadow-*`
- `--animal-spacing-*`
- `--animal-motion-*`

如果一个新组件必须新增大量 token 才能成立，说明它大概率还不适合当前阶段进入。

## 推荐分类与组件池

下面的分类参考主流组件库的常见体系，但已经按当前仓库风格和现阶段成熟度做了筛选。

### A. 数据录入

这是最优先的一组，因为当前库已经有 `Input`、`Switch`、`Button`，但缺少完整表单闭环。

推荐组件：

- `Checkbox`
- `Radio`
- `Textarea`
- `Select`
- `Form`
- `FormItem`
- `Slider`
- `Rate`

设计落点：

- `Checkbox` 与 `Radio` 应做成 Nook 风格圆角选择控件，不要走系统默认勾选框
- `Textarea` 应沿用 `Input` 的边框、阴影、聚焦态和文字节奏
- `Select` 应优先做单选基础版，再扩展搜索、多选
- `Form` / `FormItem` 不是视觉主角，重点是统一 label、help、error、extra 的排版语义
- `Slider` 和 `Rate` 非常适合当前软萌触感风格，容易做出高辨识度

优先级：

- P0: `Checkbox` `Radio` `Textarea` `Select`
- P1: `Form` `FormItem`
- P2: `Slider` `Rate`

### B. 导航与切换

当前 demo 已经有左侧菜单，但库内还没有沉淀出通用导航组件。

推荐组件：

- `Tabs`
- `Segmented`
- `Breadcrumb`
- `Pagination`
- `Anchor`

设计落点：

- `Tabs` 应做成“圆角页签”或“卡片页签”，不能用细线条商务风 tab
- `Segmented` 很适合直接复用 `Button` 的触感与圆角系统
- `Breadcrumb` 要弱化层级压迫感，偏轻标签感
- `Pagination` 应更像“游戏内翻页控件”，不是后台列表页分页条
- `Anchor` 更适合文档站，不一定作为首批对外重点组件

优先级：

- P0: `Tabs` `Segmented`
- P1: `Pagination`
- P2: `Breadcrumb` `Anchor`

### C. 反馈与提示

这是非常适合当前风格扩张的一组，且实现成本相对可控。

推荐组件：

- `Tag`
- `Badge`
- `Tooltip`
- `Popover`
- `Message`
- `Notification`
- `Progress`
- `Skeleton`
- `Empty`

设计落点：

- `Tag` 与 `Badge` 应做成手账贴纸感或圆角徽章感
- `Tooltip` 和 `Popover` 应延续 `Modal` 的柔和浮层语气，但做更轻量
- `Message` 和 `Notification` 适合引入岛屿广播、系统提示牌式视觉
- `Progress` 可做成圆点、叶片、进度条三种同风格表达
- `Skeleton` 不能用工业感灰条，应保留奶油底和柔和闪动
- `Empty` 很适合做成当前库的标志性组件，最能拉开与普通 UI 库的差异

优先级：

- P0: `Tag` `Badge` `Tooltip` `Empty`
- P1: `Popover` `Message` `Skeleton`
- P2: `Notification` `Progress`

### D. 数据展示

这一组要谨慎，只做与当前风格兼容度高、信息密度适中的组件。

推荐组件：

- `Avatar`
- `List`
- `Descriptions`
- `Stat`
- `Timeline`

设计落点：

- `Avatar` 可以直接吸收 NookPhone 色板和圆角系统
- `List` 应偏“岛民事项列表”，不要做重表格感
- `Descriptions` 更适合详情卡片页，和 `Card` 很容易协同
- `Stat` 可作为“资源、积分、里程数”等数字展示组件
- `Timeline` 可以做成旅行日志、岛屿纪事式风格

优先级：

- P0: `Avatar`
- P1: `List` `Descriptions`
- P2: `Stat` `Timeline`

### E. 浮层与容器

当前已有 `Modal` 与 `Card`，这一组可以继续扩，但要控制节奏。

推荐组件：

- `Drawer`
- `Dropdown`
- `Menu`
- `Panel`

设计落点：

- `Drawer` 应先做移动端友好的底部抽屉，再做侧边抽屉
- `Dropdown` 可作为 `Select`、`Menu`、`Popover` 的基础交互壳
- `Menu` 适合作为库级导航抽象，但要明确是“轻导航”而不是后台系统导航
- `Panel` 可理解为比 `Card` 更偏信息容器、更偏模块区块的壳组件

优先级：

- P1: `Dropdown` `Drawer`
- P2: `Menu` `Panel`

## 建议的正式路线图

### Phase 1：补齐基础使用闭环

目标：让这个库能独立支撑一个中小型内容站、活动页、轻应用页面。

建议组件：

- `Checkbox`
- `Radio`
- `Textarea`
- `Select`
- `Tabs`
- `Segmented`
- `Tag`
- `Badge`
- `Tooltip`
- `Empty`
- `Avatar`

这一阶段的价值最大，因为：

- 表单与选择能力补齐
- 页面切换与状态提示补齐
- 可以明显提升示例站内容丰富度
- 这些组件都能自然复用现有视觉体系

### Phase 2：补齐反馈与轻浮层能力

目标：让组件库具备更完整的交互反馈体验。

建议组件：

- `Popover`
- `Message`
- `Skeleton`
- `Pagination`
- `List`
- `Descriptions`
- `Dropdown`
- `Drawer`

这一阶段应重点处理：

- 浮层定位一致性
- 层级、阴影、边框、入场动画的一致性
- 文档 demo 中的组合场景

### Phase 3：补齐增强型展示组件

目标：提升“组件库完整度”，但仍然不走后台重组件路线。

建议组件：

- `Form`
- `FormItem`
- `Progress`
- `Notification`
- `Stat`
- `Timeline`
- `Slider`
- `Rate`

这一阶段的重点不再是“有没有”，而是：

- 表单校验视觉是否足够克制
- 展示组件是否延续当前空间感与节奏
- 组件之间是否能组合成完整业务模块

## 明确不建议优先开发的组件

以下组件不是不能做，而是不建议在当前阶段优先进入：

- `Table`
- `Tree`
- `TreeSelect`
- `Transfer`
- `Cascader`
- `AutoComplete`
- `DataGrid`
- `VirtualList`
- `ProTable` 类高级业务组件

原因很明确：

- 信息密度高，天然更偏企业后台
- 需要大量交互边界处理，投入大
- 很容易把当前“温暖、轻巧、游戏化”的视觉语言拖向“业务系统化”
- 这些组件一旦先做，反而会挤占真正能建立品牌辨识度的高价值组件

## 组件命名与结构规范

为了维持开源仓库级别的整洁度，后续新增组件建议保持和当前一致的结构：

```text
src/components/
  Checkbox/
    Checkbox.vue
    checkbox.module.less
    index.ts
  Radio/
    Radio.vue
    radio.module.less
    index.ts
```

规则：

- 目录名使用 PascalCase
- SFC 文件名与组件名一致
- 样式文件使用小写 kebab/语义名并保持 `*.module.less`
- 每个组件独立 `index.ts`
- demo 示例按组件分块，不把多个组件的示例逻辑硬塞到一个超大文件

## 文档站建议同步升级的内容

新增组件时，文档站不应只增加示例，还应同步补齐以下能力：

- 统一“基础用法 / 状态 / 组合 / API”区块
- 统一代码块高亮主题
- 统一左右布局与目录滚动行为
- 统一组件页顶部的标题卡、说明卡、标签系统
- 增加“适用场景”与“设计说明”小节

这样后续组件越多，文档越不会变乱。

## 推荐的首批开发名单

如果只选一批最值得立刻进入开发的组件，我建议是：

1. `Checkbox`
2. `Radio`
3. `Textarea`
4. `Select`
5. `Tabs`
6. `Tag`
7. `Badge`
8. `Tooltip`
9. `Empty`
10. `Avatar`

这 10 个组件有几个共同点：

- 使用频率高
- 能和现有 8 个组件自然组合
- 样式延展风险低
- 最容易体现这个库的独特审美
- 能明显提升 README、官网和 npm 展示面的完成度

## 最终建议

从产品化和开源传播两方面看，最合理的策略不是追求“组件数量看起来很多”，而是先把下面这条路线走稳：

- 先做高频、轻量、强风格组件
- 再做反馈和浮层
- 最后再考虑高密度数据组件

只要第一批新增组件做得足够稳，这个库就会从“风格化练手项目”提升成“有明确审美和边界的可持续开源组件库”。
