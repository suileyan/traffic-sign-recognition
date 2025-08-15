<template>
  <div class="motion-demo-container">
    <div class="demo-header">
      <h1 class="demo-title">Motion for Vue 动画演示</h1>
      <p class="demo-subtitle">探索 Motion-v 动画库的强大功能</p>
    </div>

    <div class="demo-sections">
      <!-- 基础动画演示 -->
      <section class="demo-section">
        <h2>基础动画</h2>
        <div class="demo-grid">
          <motion.div
            class="demo-box"
            :initial="{ opacity: 0, scale: 0.5 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ duration: 0.5 }"
          >
            淡入缩放
          </motion.div>

          <motion.div
            class="demo-box"
            :initial="{ x: -100 }"
            :animate="{ x: 0 }"
            :transition="{ type: 'spring', stiffness: 100 }"
          >
            弹簧动画
          </motion.div>

          <motion.div
            class="demo-box"
            :initial="{ rotate: 0 }"
            :animate="{ rotate: 360 }"
            :transition="{ duration: 2, repeat: Infinity, ease: 'linear' }"
          >
            旋转动画
          </motion.div>
        </div>
      </section>

      <!-- 悬停动画演示 -->
      <section class="demo-section">
        <h2>交互动画</h2>
        <div class="demo-grid">
          <motion.div
            class="demo-box interactive"
            :whileHover="{ scale: 1.1, backgroundColor: '#3b82f6' }"
            :whileTap="{ scale: 0.95 }"
          >
            悬停缩放
          </motion.div>

          <motion.div
            class="demo-box interactive"
            :whileHover="{ rotate: 10, y: -10 }"
            :transition="{ type: 'spring', stiffness: 300 }"
          >
            悬停倾斜
          </motion.div>

          <motion.div
            class="demo-box interactive"
            :whileHover="{ boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }"
          >
            悬停阴影
          </motion.div>
        </div>
      </section>

      <!-- 列表动画演示 -->
      <section class="demo-section">
        <h2>列表动画</h2>
        <div class="list-controls">
          <el-button @click="addItem" type="primary">添加项目</el-button>
          <el-button @click="removeItem" type="danger" :disabled="items.length === 0">删除项目</el-button>
        </div>
        
        <AnimatePresence>
          <motion.div
            v-for="item in items"
            :key="item.id"
            class="list-item"
            :initial="{ opacity: 0, x: -50 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: 50 }"
            :transition="{ duration: 0.3 }"
          >
            <span>{{ item.text }}</span>
            <el-button @click="removeSpecificItem(item.id)" size="small" type="danger" circle>
              <el-icon><Close /></el-icon>
            </el-button>
          </motion.div>
        </AnimatePresence>
      </section>

      <!-- 路径动画演示 -->
      <section class="demo-section">
        <h2>SVG 路径动画</h2>
        <div class="svg-container">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <motion.path
              d="M50,150 Q100,50 150,150"
              stroke="#3b82f6"
              stroke-width="3"
              fill="none"
              :initial="{ pathLength: 0 }"
              :animate="{ pathLength: 1 }"
              :transition="{ duration: 2, repeat: Infinity, repeatType: 'reverse' }"
            />
          </svg>
        </div>
      </section>

      <!-- 复杂动画序列 -->
      <section class="demo-section">
        <h2>动画序列</h2>
        <div class="sequence-container">
          <motion.div
            class="sequence-box"
            :animate="sequenceAnimation"
            :transition="{ duration: 0.5, times: [0, 0.2, 0.5, 0.8, 1] }"
            @click="triggerSequence"
          >
            点击触发序列动画
          </motion.div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Close } from '@element-plus/icons-vue'
import { ElButton, ElIcon } from 'element-plus'

// 列表动画数据
const items = ref([
  { id: 1, text: '项目 1' },
  { id: 2, text: '项目 2' },
  { id: 3, text: '项目 3' }
])

let nextId = 4

const addItem = () => {
  items.value.push({
    id: nextId++,
    text: `项目 ${nextId - 1}`
  })
}

const removeItem = () => {
  if (items.value.length > 0) {
    items.value.pop()
  }
}

const removeSpecificItem = (id: number) => {
  const index = items.value.findIndex(item => item.id === id)
  if (index > -1) {
    items.value.splice(index, 1)
  }
}

// 序列动画
const sequenceAnimation = ref({
  scale: [1, 1.2, 1.1, 1.3, 1],
  rotate: [0, 0, 180, 180, 0],
  backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#6366f1']
})

const triggerSequence = () => {
  // 重新触发动画
  sequenceAnimation.value = {
    scale: [1, 1.2, 1.1, 1.3, 1],
    rotate: [0, 0, 180, 180, 0],
    backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#6366f1']
  }
}
</script>

<style scoped>
.motion-demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.demo-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.demo-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.demo-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.demo-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.demo-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.demo-box {
  width: 150px;
  height: 150px;
  background: #6366f1;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.demo-box.interactive {
  background: #8b5cf6;
}

.list-controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  border-left: 4px solid #6366f1;
}

.svg-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.sequence-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.sequence-box {
  width: 200px;
  height: 100px;
  background: #6366f1;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}

@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: 1fr;
    justify-items: center;
  }
  
  .demo-title {
    font-size: 2rem;
  }
  
  .motion-demo-container {
    padding: 1rem;
  }
}
</style>