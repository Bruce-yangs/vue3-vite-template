<template>
  <div class="menu-container">
    <el-menu
      style="overflow-y: auto"
      :collapse="menu.collapse"
      router
      :default-active="menu.activePath"
      background-color="#323131"
      text-color="#fff"
      unique-opened
      :default-openeds="menu.openeds"
      :collapse-transition="false"
    >
      <!-- active-text-color="#fff"
      text-color="#fff"
       -->
      <div class="logo">
        <div>
          <img
            class="logo ml-auto mr-auto"
            style="display: inline-block;
                  border-radius: 50%;
                  width: 50px;" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
            width="38"
            alt="logo"
          />
        </div>
        <span v-show="!menu.collapse" style="color: #fff;">
          vue3-vite-template
        </span>
      </div>
      <div class="collapse-control" @click="toggleCollapse">
        <i
          class="iconfont"
          :class="{
            'icon-shouqi': !menu.collapse,
            'icon-zhankai': menu.collapse
          }"
        ></i>
      </div>
      <div v-for="item in menu.menus" :key="item.id">
        <el-submenu
          v-if="item.children && item.children.length"
          :index="item.powerUrl || ''"
          :key="item.powerUrl"
          popper-class="popper-class"
        >
          <template #title>
            <i class="iconfont title-icon" :class="item.icon"></i>
            <span>{{ item.powerName }}</span>
          </template>
          <el-menu-item
            v-for="subItem in item.children"
            :index="subItem.powerUrl"
            :key="subItem.powerUrl"
          >
            {{ subItem.powerName }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="item.powerUrl" :key="item.powerUrl">
          <i class="iconfont title-icon" :class="item.icon"></i>
          <template #title>
            <span>{{ item.powerName }}</span>
          </template>
        </el-menu-item>
      </div>
      <div v-show="!menu.collapse" class="bottom-title">
        <span>北京玥果科技有限公司</span>
      </div>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

interface MenuList {
  powerUrl: string
  powerName: string
  icon?: string
  children?: MenuList[]
}

interface Menu {
  collapse: boolean
  activePath: string
  openeds: string[]
  menus: MenuList[]
}

const useMenu = () => {
  const menusListString = window.sessionStorage.getItem('menuList')
  // const menusList = JSON.parse(menusListString as string)
  const menusList = [
    {
      btns: [],
      children: [],
      powerName: '首页',
      powerNo: '20001',
      powerUrl: '/index'
    },
    {
      btns: [],
      children: [
        {
          btns: [
            'issue_add',
            'issue_export',
            'issue_check',
            'issue_edit',
            'issue_copy',
            'issue_supplement'
          ],
          children: [],
          powerName: '问题管理',
          powerNo: '20008',
          powerUrl: '/problem-list'
        },
        {
          btns: [],
          children: [],
          powerName: '问题装备统计',
          powerNo: '20009',
          powerUrl: '/problem-report'
        }
      ],
      powerName: '表单设计',
      powerNo: '20002',
      powerUrl: '/problem-list'
    },
    {
      btns: [],
      children: [
        {
          btns: [
            'role_add',
            'role_edit',
            'role_check',
            'role_delete',
            'role_manage_user'
          ],
          children: [],
          powerName: '角色管理',
          powerNo: '20087',
          powerUrl: '/role-manage'
        },
        {
          btns: [
            'authority_add',
            'authority_edit',
            'authority_delete',
            'authority_check'
          ],
          children: [],
          powerName: '权限管理',
          powerNo: '20022',
          powerUrl: '/authority-manage'
        },
        {
          btns: [
            'user_add',
            'user_edit',
            'user_delete',
            'user_check',
            'user_edit_pwd'
          ],
          children: [],
          powerName: '用户管理',
          powerNo: '20023',
          powerUrl: '/user-manage'
        }
      ],
      powerName: '系统管理',
      powerNo: '20006',
      powerUrl: '系统设置'
    }
  ]

  // icon
  menusList.forEach((item: any) => {
    switch (item.powerName) {
      case '首页':
        item.icon = 'icon-2shouye'
        break
      // case '基础管理':
      //   item.icon = 'iconjichuguanlibeifen'
      //   break
      case '表单设计':
        item.icon = 'icon-2wentigenzong'
        break
      case '演习管理':
        item.icon = 'icon-2yanxipinggu'
        break
      case '演习任务管理':
        item.icon = 'iconyanxirenwuguanli'
        break
      case '用户管理':
        item.icon = 'iconfeihangguijihuifangzuolan'
        break
      case '基础数据管理':
        item.icon = 'icon-2jichushujuguanli'
        break
      // case '基础数据管理':
      //   item.icon = 'iconshishiguijizuolan'
      //   break
      case '装备型号':
        item.icon = 'iconfeihangguijihuifangzuolan'
        break
      case '演习任务':
        item.icon = 'iconshishiguijizuolan'
        break
      case '操作日志':
        item.icon = 'icon-2caozuorizhi'
        break
      case '装备数据管理':
        item.icon = 'icon-2zhuangbeishujuguanli'
        break
      case '系统管理':
        item.icon = 'icon-2xitongguanli'
        break
      default:
        break
    }
  })
  const route = useRoute()
  const menu = reactive<Menu>({
    activePath: '/',
    collapse: false,
    openeds: [''],
    menus: menusList as MenuList[]
  })

  // 切换展开收起
  const toggleCollapse = () => {
    menu.collapse = !menu.collapse
  }

  // activePath
  watch(
    () => route.path,
    value => {
      const activePathArr = value.split('/')
      const activeManage = activePathArr.length >= 2 ? activePathArr[1] : ''
      menu.activePath = `/${activeManage}`
      // 寻找父级URL，当前不需要,未测试
      // menu.menus.forEach(item => {
      //   if (item.powerUrl === menu.activePath) {
      //     return;
      //   }
      //   item?.children?.forEach(subItem => {
      //     if (subItem.powerUrl === menu.activePath) {
      //       menu.openeds = [item.powerUrl];
      //     }
      //   });
      // });
    },
    { immediate: true }
  )
  return {
    menu,
    toggleCollapse
  }
}

export default defineComponent({
  setup(_, { emit }) {
    const { menu, toggleCollapse } = useMenu()
    const route = useRoute()

    watch(
      () => menu.collapse,
      state => {
        emit('toggleCollapse', state)
      }
    )

    return {
      menu,
      toggleCollapse,
      path: route.path
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../variables.scss';
.menu-container {
  cursor: pointer;
  height: 100%;
  :deep(.el-menu.el-menu--collapse) {
    height: 100%;
  }
  :deep(.el-menu) {
    height: calc(100% - 32px);
    border-right: none;
    // .el-menu-item.is-active {
    //   // background: #516fbf !important;
    // }

    // .el-submenu.is-opened .el-submenu__title {
    //   // background-color: #454545 !important;
    // }
    .el-submenu .el-submenu__title .title-icon,
    .el-menu-item .title-icon {
      padding-right: 4px;
    }
    .el-submenu .el-submenu__title:hover,
    .el-menu-item:hover,
    .el-submenu.is-active {
      background-color: $--color-menu;
      color: $--color-menu--font;
      i,
      .el-submenu__title {
        color: $--color-menu--font;
      }
    }
    .el-submenu.is-active.is-opened .el-submenu__title {
      background-color: $--color-menu;
      color: $--color-menu--font;
      i {
        color: $--color-menu--font;
      }
    }
    .el-submenu .el-menu-item {
      background-color: $--color-menu;
    }
    .el-submenu .el-menu-item.is-active,
    .el-submenu .el-menu-item:hover {
      background: $--color-menu;
    }
  }
  :deep(.el-menu--collapse) {
    .el-menu-item span,
    .el-submenu > .el-submenu__title span {
      height: 0;
      width: 0;
      overflow: hidden;
      visibility: hidden;
      display: inline-block;
    }
  }
}

.collapse-control {
  height: 40px;
  background: #323131;
  text-align: center;
  line-height: 40px;
  i {
    width: 16px;
    height: 16px;
    color: #fff;
  }
}
.logo {
  width: 100%;
  text-align: center;
  padding-top: 4px;
  font-weight: bold;
  color: #ccc;
  img {
    width: 38px;
  }
}
.bottom-title {
  width: 180px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  background-color: rgb(69, 69, 69);
  color: #b4b4b4;
  position: fixed;
  bottom: 0;
}
</style>
<style>
.menu-container .el-menu--collapse > .el-menu-item .el-submenu__icon-arrow,
.menu-container .el-submenu__title .el-submenu__icon-arrow.el-icon-arrow-right {
  display: none !important;
}
</style>
