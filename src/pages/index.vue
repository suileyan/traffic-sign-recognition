<template>
  <div class="min-h-screen bg-base-100">
    <!-- 英雄区域 -->
    <div class="hero min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div class="hero-content text-center">
        <div class="max-w-md" v-motion-fade-visible>
          <h1 class="text-5xl font-bold mb-5" v-motion-slide-up :delay="200">
            {{ heroSection.title }}
          </h1>
          <p class="py-6 text-lg" v-motion-slide-up :delay="400">
            {{ heroSection.description }}
          </p>
          <div class="flex gap-4 justify-center" v-motion-slide-up :delay="600">
            <button :class="heroSection.primaryButton.class">
              {{ heroSection.primaryButton.text }}
            </button>
            <button :class="heroSection.secondaryButton.class">
              {{ heroSection.secondaryButton.text }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 特性展示 -->
    <div class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16" v-motion-fade-visible>
          <h2 class="text-4xl font-bold mb-4">{{ featuresSection.title }}</h2>
          <p class="text-lg text-base-content/70">{{ featuresSection.subtitle }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(feature, index) in featuresSection.features" :key="feature.id" class="card bg-base-100 shadow-xl"
            v-motion-slide-visible-once :delay="feature.delay">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">
                {{ feature.icon }}
              </div>
              <h3 class="card-title justify-center">{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="py-20 bg-primary text-primary-content">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div v-for="(stat, index) in statsSection.stats" :key="stat.id" v-motion-slide-visible-once-up
            :delay="stat.delay">
            <div class="stat">
              <div class="stat-value text-4xl font-bold">{{ stat.animatedValue }}{{ stat.suffix }}</div>
              <div class="stat-title text-primary-content/80">{{ stat.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA 区域 -->
    <div class="py-20 bg-base-100">
      <div class="container mx-auto px-4 text-center" v-motion-fade-visible>
        <h2 class="text-4xl font-bold mb-6">{{ ctaSection.title }}</h2>
        <p class="text-lg mb-8 text-base-content/70">{{ ctaSection.description }}</p>
        <div class="flex gap-4 justify-center">
          <button v-for="(button, index) in ctaSection.buttons" :key="index" :class="button.class">
            {{ button.text }}
          </button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer footer-center p-10 bg-base-200 text-base-content">
      <div>
        <div class="grid grid-flow-col gap-4">
          <a class="link link-hover">关于我们</a>
          <a class="link link-hover">联系方式</a>
          <a class="link link-hover">隐私政策</a>
          <a class="link link-hover">服务条款</a>
        </div>
      </div>
      <div>
        <div class="grid grid-flow-col gap-4">
          <a class="text-2xl hover:text-primary transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>
          <a class="text-2xl hover:text-primary transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
            </svg>
          </a>
          <a class="text-2xl hover:text-primary transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
            </svg>
          </a>
        </div>
      </div>
      <div>
        <p>Copyright © 2024 - {{ serverConfig.VITE_APP_TITLE }}. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import serverConfig from '@/configs'
import { ref, onMounted } from 'vue'

interface Button {
  text: string
  class: string
}

interface Feature {
  id: number
  icon: string
  title: string
  description: string
  delay: number
}

interface Stat {
  id: number
  animatedValue: any
  targetValue: number
  suffix: string
  title: string
  delay: number
}

// 英雄区域数据
const heroSection: {
  title: string
  description: string
  primaryButton: Button
  secondaryButton: Button
} = {
  title: '欢迎来到现代化管理系统',
  description: '高效、安全、易用的企业级解决方案，助力您的业务数字化转型',
  primaryButton: {
    text: '立即开始',
    class: 'btn btn-primary btn-lg'
  },
  secondaryButton: {
    text: '了解更多',
    class: 'btn btn-outline btn-lg'
  }
}

// 特性数据
const featuresSection: {
  title: string
  subtitle: string
  features: Feature[]
} = {
  title: '核心特性',
  subtitle: '为您提供全方位的解决方案',
  features: [
    {
      id: 1,
      icon: '🚀',
      title: '高性能',
      description: '采用最新技术栈，确保系统运行流畅高效',
      delay: 200
    },
    {
      id: 2,
      icon: '🔒',
      title: '安全可靠',
      description: '多层安全防护，保障您的数据安全无忧',
      delay: 400
    },
    {
      id: 3,
      icon: '📱',
      title: '响应式设计',
      description: '完美适配各种设备，随时随地轻松使用',
      delay: 600
    }
  ]
}

// 统计数据
const statsSection: { stats: Stat[] } = {
  stats: [
    {
      id: 1,
      animatedValue: ref(0),
      targetValue: 10000,
      suffix: '+',
      title: '活跃用户',
      delay: 200
    },
    {
      id: 2,
      animatedValue: ref(0),
      targetValue: 500,
      suffix: '+',
      title: '项目数量',
      delay: 400
    },
    {
      id: 3,
      animatedValue: ref(0),
      targetValue: 99,
      suffix: '%',
      title: '系统稳定性',
      delay: 600
    },
    {
      id: 4,
      animatedValue: ref(0),
      targetValue: 95,
      suffix: '%',
      title: '客户满意度',
      delay: 800
    }
  ]
}

// CTA区域数据
const ctaSection: {
  title: string
  description: string
  buttons: Button[]
} = {
  title: '准备开始了吗？',
  description: '立即体验我们的系统，开启您的数字化转型之旅',
  buttons: [
    {
      text: '免费试用',
      class: 'btn btn-primary btn-lg'
    },
    {
      text: '联系我们',
      class: 'btn btn-outline btn-lg'
    }
  ]
}

// 数字动画函数
const animateNumber = (target: { value: number }, finalValue: number, duration: number = 2000): void => {
  const startTime = Date.now()
  const startValue = 0

  const updateNumber = (): void => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 使用缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    target.value = Math.floor(startValue + (finalValue - startValue) * easeOutQuart)

    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    }
  }

  requestAnimationFrame(updateNumber)
}

onMounted(() => {
  // 延迟启动数字动画
  setTimeout(() => {
    statsSection.stats.forEach(stat => {
      animateNumber(stat.animatedValue, stat.targetValue)
    })
  }, 1000)
})
</script>

<style scoped>
/* 自定义样式 */
.hero {
  background-image:
    radial-gradient(at 40% 20%, hsla(28, 100%, 74%, 1) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%),
    radial-gradient(at 80% 50%, hsla(340, 100%, 76%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 1) 0px, transparent 50%),
    radial-gradient(at 80% 100%, hsla(242, 100%, 70%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 1) 0px, transparent 50%);
}

.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>