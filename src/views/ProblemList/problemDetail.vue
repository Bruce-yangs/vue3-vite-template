<template>
  <div class="common-check-container drill-detail-edit">
    <div class="breadcrumb-container">
      <i class="iconfont el-icon-arrow-left" @click="router.go(-'1')"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/problem-list' }">
          问题管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          问题详情
          <!-- route.params.id ? "编辑" : "添加" -->
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="common-content-box">
      <div class="common-detail-box padding-container">
        <el-form
          :model="form"
          label-width="160px"
          label-suffix="：">
          <!-- status-icon -->
          <div>
            <!-- 基本信息组件 -->
            <ProblemListBaseInfo v-model:form="datas.baseInfo" />
            <hr class="mb-5" />
            <!-- 历史记录组件 -->
            <ProblemListHistory v-model:form="datas.historyData" />
          </div>

        </el-form>
        <div class="common-footer">
          <el-button plain @click="goBack()" class="viewBottom">
            返回
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, reactive, ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProblemListBaseInfo from '../../components/ProblemListBaseInfo.vue'
import ProblemListHistory from '../../components/ProblemListHistory.vue'
import { ElMessage } from 'element-plus'
import { asyncGetData, useParamData } from './hooks'
import axios from '../../utils/request'
  const router = useRouter()
  const route = useRoute()
  const form = reactive<any>({})

  const asyncData = asyncGetData()  // 引入根据id获取数据
  const datas = reactive<any>({
    historyData:[],
    baseInfo: {}
  })
  asyncData('conductorIssueRecord/getConductorIssueRecordInfoVo', route.query.id, (res:any)=>{
    datas.baseInfo = res
  })
  // 历史记录数据
  datas.historyData = useParamData('conductorIssueRecord/getIssueRecordLogList', route.query.id)
  
  const goBack = () => {
    router.go(-'1')
  }
    
</script>

<style lang="scss" scoped>
.padding-container {
  padding: 30px;
  padding-top: 15px;
  h4 {
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .common-one-box {
    padding-right: 30px;
    box-sizing: border-box;
  }
  .history {
    margin-bottom: 20px;
    p {
      padding: 10px;
      border: 1px solid #ccc;
      span {
        font-weight: bold;
      }
    }
  }
  // 鼠标手指样式
  .cursorPointer {
    cursor: pointer;
  }
  .border {
    padding: 10px;
    border: 1px solid #ccc;
  }
}
</style>
