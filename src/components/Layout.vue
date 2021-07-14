<template>
  <el-container class="container">
    <el-aside class="menu-container" :width="asideWidth">
      <Menu @toggleCollapse="toggleCollapse" />
    </el-aside>
    <el-container class="main-container">
      <el-header class="header">
        <div
          class="msg-box"
          @click="router.push('/problem-list?auditStatus=2')"
        >
          消息 {{ waitResolve }}
        </div>

        <div class="avatar-container">
          <el-dropdown @command="handleCommand">
            <div>
              <!-- <i class="iconfont icon-yonghu avatar"></i> -->
              <img
                style="display: inline-block;
                  border-radius: 50%;
                  width: 38px;  margin-right: 7px;"
                src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
              />
              <span>{{ username }}</span>
              <!-- https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80 -->
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="signOut">登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <router-view :menu-open="menuOpen" />
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Menu from './Menu.vue'
import axios from '../utils/request'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const router = useRouter()
    const menuOpen = ref(false)
    const asideWidth = ref('180px')
    const username = window.localStorage.getItem('username')

    const toggleCollapse = (collapse: boolean) => {
      asideWidth.value = collapse ? '64px' : '180px'
      menuOpen.value = collapse
    }
    const asyncLogout = () => {
      axios.get('conductorUser/logout').then(res => {
        if (res.data.code === 200) {
          ElMessage.success('登出成功')
          router.push('/login')
        }
      })
    }
    const handleCommand = (command: string) => {
      if (command === 'signOut') {
        asyncLogout()
      }
    }
    const store = useStore()
    store.dispatch('asyncGetCount')

    return {
      username,
      waitResolve: computed(() => store.state.waitResolve),
      router,
      asideWidth,
      menuOpen,
      handleCommand,
      toggleCollapse
    }
  },
  components: {
    Menu
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  max-width: 100%;
  background: rgb(241, 242, 245);
  .header {
    background-color: #e4e6eb;
    line-height: 60px;
    .avatar-container {
      float: right;
      line-height: 60px;
      .avatar {
        margin-left: 4px;
        font-size: 30px;
        vertical-align: middle;
      }
    }
  }
  .main-container {
    position: relative;
  }
  .msg-box {
    position: absolute;
    left: 50px;
    top: 13px;
    height: 34px;
    line-height: 34px;
    padding: 0 10px;
    background-color: #dd1d35;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
