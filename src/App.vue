<template>
  <el-config-provider :locale="zhCn">
      <router-view />
  </el-config-provider>
</template>
<script setup>
  import zhCn from 'element-plus/lib/locale/lang/zh-cn'
  </script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #2c3e50;
  font-size: 14px;
}
:root {
    --el-color-primary: #2E76CA;
}
.el-button--primary {
    --el-button-font-color: #ffffff;
    --el-button-background-color: #2E76CA!important;
    --el-button-border-color: #2E76CA!important;
    --el-button-hover-color: #3F98FF!important;
    // --el-button-hover-color: #2d73c4!important;
    --el-button-active-font-color: #e6e6e6!important;
    --el-button-active-background-color: #2E76CA!important;
    --el-button-active-border-color: #2E76CA!important;
}
</style>
