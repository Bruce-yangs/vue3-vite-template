<template>
  <div class="common-check-container drill-detail-edit">
    <div class="breadcrumb-container">
      <i class="iconfont el-icon-arrow-left" @click="router.go(-1)"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/exercise-manage' }">
          演习任务
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          报告详情
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="common-content-box">
      <div class="common-detail-box padding-container">
        <el-form
          :model="form"
          ref="formRef"
          label-width="160px"
          label-suffix="："
        >
          <!-- status-icon -->
          <h3>{{ form.taskName }}</h3>
          <div class="title-h4">
            <h4>基本信息</h4>
          </div>
          <div class="border" v-if="form.taskBaseInfo">
            <p class="ql-editor" v-html="form.taskBaseInfo"></p>
          </div>
          <div class="title-h4">
            <h4>过程信息</h4>
          </div>
          <div class="border" v-if="form.taskProcess">
            <p class="ql-editor" v-html="form.taskProcess"></p>
          </div>

          <div class="title-h4">
            <h4>过程总结</h4>
          </div>
          <div class="border" v-if="form.summary">
            <p class="ql-editor" v-html="form.summary"></p>
          </div>
        </el-form>
      </div>
      <div class="common-footer">
        <el-button plain @click="goBack(1)" class="mr-8">
          返回
        </el-button>
        <el-button type="primary" @click="goBack(3)" class="mr-8">
          导出报告
        </el-button>
      </div>
    </div>
    <form
      action="/api/conductorExerciseTask/exportReport"
      hidden
      ref="exportForm"
      method="get"
    >
      <input type="hidden" name="taskId" v-model="form.taskId" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from '../../utils/request'
import 'quill/dist/quill.core.css'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const exportForm = ref(null)
const params = route.params

let form = reactive<any>({
  id: '',
  taskId: '', // 演习任务id
  taskBaseInfo: '', // 基本信息
  taskProcess: '', // 过程信息
  summary: '' // 总结
})
form.taskId = params.id
// 请求报告详情数据
const asyncData = () => {
  const id = route.params.id
  axios
    .get(
      '/conductorExerciseTask/getExerciseTaskAssessmentReportVo?taskId=' + id
    )
    .then(res => {
      if (res.data.code === 200) {
        Object.assign(form, res.data.data)
      } else {
        ElMessage.error(res.data.msg)
      }
    })
}
asyncData()
const goBack = (num: number) => {
  if (num === 1) {
    router.go(-1)
  } else if (num === 3) {
    exportForm.value.submit()
  }
}
</script>

<style lang="scss" scoped>
.padding-container {
  padding: 30px;
  padding-top: 15px;
  h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .title-h4 {
    display: flex;
    align-items: center;
    margin: 20px 0;
    h4 {
      font-size: 17px;
      font-weight: bold;
      margin-right: 15px;
    }
    i {
      margin-bottom: -3px;
      color: blue;
    }
  }
  hr {
    margin-bottom: 20px;
  }
  .common-one-box {
    padding-right: 30px;
    box-sizing: border-box;
  }
  // 鼠标手指样式
  .cursorPointer {
    cursor: pointer;
  }
  .border {
    padding: 10px;
    border: 1px solid #ccc;
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>
