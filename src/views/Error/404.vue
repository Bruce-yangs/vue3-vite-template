<template>
  <div class="container">
    <img src="https://panjiachen.github.io/vue-element-admin/static/img/404.a57b6f31.png" class="img" />
    <p>没有找到您的页面，可联系管理员处理</p>
    <el-button
      class="button"
      size="large"
      @click="router.push('/index')"
      type="primary"
    >
      返回到首页
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()

    return {
      router
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 910px;
  margin: 0 auto;
  text-align: center;
  color: #888;
  .img {
    width: inherit;
  }
  .button {
    margin-top: 40px;
  }
}
</style>
