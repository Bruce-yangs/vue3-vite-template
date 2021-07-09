<template>
  <div class="common-check-container drill-detail-edit">
    <div class="breadcrumb-container">
      <i class="iconfont el-icon-arrow-left" @click="router.go(-1)"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/exercise-manage' }">
          演习任务
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          演习评估
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
          <h3>{{ form.taskName }}</h3>
          <div class="title-h4">
            <h4>基本信息</h4>
          </div>
          <div class="toolbar"></div>
          <div  id="editor1"
            class="editor1 ql-editor"
            style="min-height: 200px"
          />
          <div class="title-h4">
            <h4>过程信息</h4>
          </div>
          <div class="toolbar"></div>
          <div  id="editor2"
            class="editor2 ql-editor"
            style="min-height: 200px"
          />
          <div class="title-h4">
            <h4>过程总结</h4>
          </div>
          <div class="toolbar"></div>
          <div
            id="editor3"
            class="editor3 ql-editor"
            style="min-height: 200px"
          />
        </el-form>
      </div>
      <div class="common-footer">
        <el-button
          plain
          @click="handleEvent(1)"
          class="mr-8"
        >
          返回
        </el-button>
        <el-button
          @click="handleEvent(2)"
          type="primary"
          class="mr-8"
        >
          保存
        </el-button>
        <el-button
          type="primary"
          @click="handleEvent(3)"
          class="mr-8"
        >
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
import { reactive, ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from '../../utils/request'

import Quill from 'quill'
import 'quill/dist/quill.core.css'
import '../../assets/css/quill.snow.css'
import addQuillTitle from '../../utils/quill-title'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const exportForm = ref()
const form = reactive({
  id: '',
  taskId: '',
  taskBaseInfo: '', // 基本信息
  taskProcess: '', // 过程信息
  taskName: '', // 演习名称
  summary: '' // 总结
})
let params = route.params
form.taskId = params.id

let quillEditor1: any = null // 富文本编辑器实例
let quillEditor2: any = null // 富文本编辑器实例
let quillEditor3: any = null // 富文本编辑器实例
// 富文本编辑器初始化
const initQuill = () => {
  // 富文本编辑器 - 工具栏 功能表
  const toolbarOptions = [
    [{ size: ['small', 'large', 'huge'] }],
    ['bold', 'italic', { color: [] }], // 字号 加粗 斜体 字体颜色
    [{ indent: '-1' }, { indent: '+1' }, { align: ['', 'right', 'center'] }], // 向左缩进 向右缩进 对齐方式
    [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表 无序列表
    // ['image'] // 'link', 添加链接 添加图片
  ]
  const options = {
    modules: {
      // 模块
      toolbar: {
        // 工具栏配置
        modules: { toolbar: '.toolbar' }, // target
        container: toolbarOptions // options
      }
    },
    // 文本域默认展示信息
    placeholder: '请输入',
    // 编辑器主题
    theme: 'snow'
  }
  // init 富文本编辑器
  quillEditor1 = new Quill('#editor1', options)
  quillEditor2 = new Quill('#editor2', options)
  quillEditor3 = new Quill('#editor3', options)
  // 工具栏增加 hover 效果
  addQuillTitle()
}

// 保存 / 编辑 评估报告
const asyncSave = () => {
  // 获取富文本内容长度
  const editor1 = quillEditor1.getLength()
  const editor2 = quillEditor2.getLength()
  const editor3 = quillEditor3.getLength()
  if (editor1 > 20000) {
    ElMessage.error('基本信息, 正文长度不超过20000个字')
    return
  } else if (editor2 > 20000) {
    ElMessage.error('过程信息, 正文长度不超过20000个字')
    return
  } else if (editor3 > 20000) {
    ElMessage.error('过程总结, 正文长度不超过20000个字')
    return
  }

  let url = '/conductorExerciseTask/saveExerciseTaskAssessmentReport'
  if (form.id) {
    /*  && route.params.action === 'edit' */
    url = '/conductorExerciseTask/updateExerciseTaskAssessmentReport'
  }
  form.taskBaseInfo = quillEditor1.container.firstChild.innerHTML
  form.taskProcess = quillEditor2.container.firstChild.innerHTML
  form.summary = quillEditor3.container.firstChild.innerHTML
  axios.post(url, { ...form }).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('保存成功')
      router.push('/exercise-manage')
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const handleEvent = (num: number) => {
  // 返回报告
  if (num === 1) return router.go(-1)
  // 保存报告
  if (num === 2) {
    formRef.value.validate((valid: boolean) => {
      if (valid) asyncSave()
    })
    return
  }
  // 导出报告
  if (num === 3) {
    exportForm.value.submit()
  }
}

// 请求报告详情数据
const asyncData = () => {
  // const id = route.params.id
  axios
    .get(
      '/conductorExerciseTask/getExerciseTaskAssessmentReportVo?taskId=' +
        form.taskId
    )
    .then(res => {
      if (res.data.code === 200) {
        Object.assign(form, res.data.data)
        nextTick(() => {
          // 向富文本插入内容
          quillEditor1.pasteHTML(form.taskBaseInfo)
          quillEditor2.pasteHTML(form.taskProcess)
          quillEditor3.pasteHTML(form.summary)
        })
      } else {
        ElMessage.error(res.data.msg)
      }
    })
}

onMounted(() => {
  // if (route.params.action !== 'add') {
  //   const viewBottom = document.querySelector('.viewBottom')
  //   viewBottom && viewBottom.scrollIntoView()
  // }
  initQuill()
  asyncData()
})
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
  }
}
</style>
