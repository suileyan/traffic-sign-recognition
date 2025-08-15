# Motion for Vue 动画库使用指南

## 简介

本项目已成功集成 Motion for Vue 动画库，这是一个强大且易用的 Vue 3 动画库，提供了丰富的动画效果和交互功能。

## 安装

动画库已经安装并配置完成：

```bash
npm install motion-v
```

## 基本使用

### 1. 导入组件

在需要使用动画的组件中导入：

```vue
<script setup>
import { motion, AnimatePresence } from 'motion-v'
</script>
```

### 2. 基础动画

```vue
<template>
  <!-- 淡入动画 -->
  <motion.div
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :transition="{ duration: 0.5 }"
  >
    内容
  </motion.div>

  <!-- 滑入动画 -->
  <motion.div
    :initial="{ x: -100 }"
    :animate="{ x: 0 }"
    :transition="{ type: 'spring' }"
  >
    内容
  </motion.div>
</template>
```

### 3. 交互动画

```vue
<template>
  <!-- 悬停效果 -->
  <motion.button
    :whileHover="{ scale: 1.1 }"
    :whileTap="{ scale: 0.95 }"
  >
    按钮
  </motion.button>

  <!-- 复杂悬停效果 -->
  <motion.div
    :whileHover="{
      scale: 1.05,
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    }"
  >
    卡片
  </motion.div>
</template>
```

### 4. 列表动画

```vue
<template>
  <AnimatePresence>
    <motion.div
      v-for="item in items"
      :key="item.id"
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -20 }"
    >
      {{ item.text }}
    </motion.div>
  </AnimatePresence>
</template>
```

### 5. SVG 动画

```vue
<template>
  <svg>
    <motion.path
      d="M10,10 L90,90"
      :initial="{ pathLength: 0 }"
      :animate="{ pathLength: 1 }"
      :transition="{ duration: 2 }"
    />
  </svg>
</template>
```

## 动画属性

### initial

- 定义元素的初始状态
- 只在组件首次渲染时应用

### animate

- 定义元素的目标状态
- 当值改变时自动触发动画

### exit

- 定义元素退出时的动画
- 需要配合 `AnimatePresence` 使用

### transition

- 控制动画的执行方式
- 支持 duration、ease、type 等属性

### whileHover / whileTap

- 交互状态下的动画
- 鼠标悬停或点击时触发

## 动画类型

### 弹簧动画

```javascript
:transition="{ type: 'spring', stiffness: 100, damping: 10 }"
```

### 缓动动画

```javascript
:transition="{ duration: 0.5, ease: 'easeOut' }"
```

### 关键帧动画

```javascript
:animate="{
  scale: [1, 1.2, 1.1, 1.3, 1],
  rotate: [0, 0, 180, 180, 0]
}"
```

## 性能优化

1. **使用 transform 属性**：优先使用 x、y、scale、rotate 等 transform 属性，它们由 GPU 加速

2. **避免动画 layout 属性**：避免动画 width、height、padding 等会触发重排的属性

3. **合理使用 AnimatePresence**：只在需要退出动画时使用

4. **控制动画数量**：避免同时运行过多动画

## 示例页面

访问 `/motion-demo` 查看完整的动画演示，包括：

- 基础动画效果
- 交互动画
- 列表动画
- SVG 路径动画
- 复杂动画序列

## 常见问题

### Q: 动画不生效？

A: 确保正确导入了 motion 组件，并且使用了正确的属性名。

### Q: 如何调试动画？

A: 可以在浏览器开发者工具中查看元素的 style 变化，或者添加 console.log 来跟踪状态。

### Q: 动画性能问题？

A: 优先使用 transform 属性，避免动画会触发重排的 CSS 属性。

## 更多资源

- [Motion for Vue 官方文档](https://motion.dev/docs/vue-animation)
- [动画最佳实践](https://motion.dev/docs/vue-motion-component)
- [性能优化指南](https://motion.dev/docs/vue-animate-presence)
