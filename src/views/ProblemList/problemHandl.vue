<template>
  <div class="common-check-container drill-detail-edit">
    <div class="breadcrumb-container">
      <i class="iconfont el-icon-arrow-left" @click="router.go(-1)"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/problem-list' }">
          问题管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          问题分析
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
          :rules="rules"
        >
          <!-- 基本信息组件 -->
          <ProblemListBaseInfo v-model:form="datas.baseInfo" />
          <hr class="mb-5" />
          <!-- 历史记录组件 -->
          <ProblemListHistory v-model:form="datas.historyData" />

          <div class="common-one-box">
            <el-form-item label="问题定位" prop="problemParts">
              <el-input
                v-model.trim="form.problemParts"
                maxlength="100"
                size="medium"
                placeholder="请填写发生问题的具体部件，如发动机、油门、刹车器、刹车系统"
              ></el-input>
            </el-form-item>
          </div>
          <div class="common-one-box findUnit">
            <el-form-item label="问题分类" prop="problemAttributesIds">
              <el-cascader
                :show-all-levels="false"
                v-model="form.problemAttributesIds"
                :options="problemClassSelectList1"
                :props="{ label: 'name', children: 'children', value: 'id' }"
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="common-one-box">
            <el-form-item label="问题等级" prop="problemLevel">
              <el-radio-group v-model="form.problemLevel" size="small">
                <el-radio-button label="1">一般</el-radio-button>
                <el-radio-button label="2">严重</el-radio-button>
                <el-radio-button label="3">重大</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="common-one-box">
            <el-form-item label="原因分析">
              <el-input
                size="medium"
                type="textarea"
                :rows="3"
                resize="none"
                placeholder="请输入内容"
                v-model="form.causeAnalysis"
              ></el-input>
            </el-form-item>
          </div>
          <div class="common-one-box">
            <el-form-item label="分析建议" prop="managementProposal">
              <el-input
                size="medium"
                type="textarea"
                :rows="3"
                resize="none"
                placeholder="请输入内容"
                v-model="form.managementProposal"
              ></el-input>
            </el-form-item>
          </div>
          <div class="common-one-box">
            <el-form-item label="">
              <el-radio-group v-model="form.auditType">
                <el-radio :label="1">关闭归零</el-radio>
                <el-radio :label="2">提供解决方案</el-radio>
                <el-radio :label="3">指派</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <!-- 提供解决方案 -->
          <div v-if="form.auditType == 2">
            <div class="common-one-box">
              <el-form-item label="解决方案" prop="solution">
                <el-input
                  size="medium"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="请输入内容"
                  v-model="form.solution"
                ></el-input>
              </el-form-item>
            </div>
            <div class="common-one-box uploadFile">
              <el-form-item label="附件">
                <el-upload
                  class="upload-demo"
                  action="/api/common/upload"
                  :limit="10"
                  accept=".jpg,.jpeg,.png,.bmp,.xls,.xlsx,.doc,.docx,.pdf,.txt,.rar,.7z,.zip,.dat,.mp3,.mp4,.avi,.mov,.flv"
                  :on-success="handlesuccess"
                  :on-error="handleError"
                  :on-remove="handleRemove"
                  :on-progress="handleProgress"
                  :file-list="form.accessoryList"
                  :before-upload="beforeAvatarUpload"
                >
                  <el-button size="small">
                    <i class="el-icon-upload"></i>
                    上传文件
                  </el-button>
                </el-upload>
                <p>支持扩展名：jpg、jpeg、png、bmp、xls、xlsx、doc、docx、pdf、txt、rar、7z、zip、dat、mp3、mp4、avi、mov、flv</p>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="建议校验方案" prop="verificationProposal">
                <el-input
                  size="medium"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="请输入内容"
                  v-model="form.verificationProposal"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <!-- 指派 -->
          <div class="common-one-box findUnit" v-if="form.auditType == 3">
            <el-form-item label="指派给谁" prop="reportGroupId">
              <el-select
                v-model="form.reportGroupId"
                size="medium"
                filterable
                clearable
              >
                <el-option
                  v-for="item in equipmentSelectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="common-footer">
            <el-button plain @click="goBack()" class="viewBottom">
              返回
            </el-button>
            <el-button type="primary" @click="handleSave()" class="viewBottom">
              保存
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  useDataFillds,
  useParamOptions,
  useParamData,
  asyncGetData,
  rules
} from './hooks'
import axios from '../../utils/request'
import { useStore } from 'vuex'
import ProblemListBaseInfo from '../../components/ProblemListBaseInfo.vue'
import ProblemListHistory from '../../components/ProblemListHistory.vue'
const store = useStore()
const router = useRouter()
const route = useRoute()
const formRef = ref()
const form = reactive<any>({
  causeAnalysis: '', //原因分析
  accessoryList: [], //附件
  auditType: 1, // 分析结论（1=关闭归零 2=提供解决方案 3=问题上报）
  problemParts: '', //问题定位
  problemAttributesIds: '',
  problemLevel: '', //问题等级
  managementProposal: '', //分析建议
  solution: '',
  verificationProposal: '',
  reportGroupId: null, //指派
  isUploading: false //是否正在上传,
})

const getBaseInfo = asyncGetData() // 引入根据id获取数据
// 指派下拉列表
const equipmentSelectList: any = useParamOptions(
  'conductorExerciseTask/getTaskGroupList',
  route.query.taskId
)
// 问题分类选择  树结构
const problemClassSelectList1: any = useDataFillds(
  '/problemAttr/getTreeList',
  null
)

const datas = reactive<any>({
  historyData: [],
  baseInfo: {}
})
// 基础信息组件数据
getBaseInfo(
  'conductorIssueRecord/getConductorIssueRecordInfoVo',
  route.query.id,
  (res: any) => { datas.baseInfo = res }
)
// 历史记录组件数据
datas.historyData = useParamData(
  'conductorIssueRecord/getIssueRecordLogList',
  route.query.id
)

const asyncSave = () => {
  let url = 'conductorIssueRecord/conductorAuditIssueRecordLog'
  axios.post(url, { issueRecordId: route.query.id, ...form }).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('保存成功')
      store.dispatch('asyncGetCount')
      goBack()
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}
// 1：保存 事件 ； 2：保存并提交至组长 事件
const handleSave = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      asyncSave()
    }
  })
}
const goBack = () => {
  router.go(-1)
}

//图片上传前限制校验
const beforeAvatarUpload = (file: any) => {
  const isLt5M = file.size / 1024 / 1024 < 500
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 500MB!')
  }
  return isLt5M
}
/**
 * @desc 上传图片成功后的回调
 * @param response {object} 接口响应
 * @param file {object} 当前文件详情
 * @param twoDimensionalList {Array} 最新结果集合
 */
const handlesuccess = (response: any, file: any, fileList: any) => {
  //错误处理
  if (response.code !== 200) return ElMessage.error('上传失败')
      
  let completed = false
  if (fileList && fileList.length > 0) {
    completed = fileList.every((item: any) => {
      return item.status === 'success'
    })
  }
  if (completed) {
    let _fileList: any = []
    fileList.forEach((item: any) => {
      if (!item.response) {
        _fileList.push(item)
      } else if (item.response.code === 200) {
        _fileList.push(item.response.data)
      }
    })
    form.accessoryList = _fileList
  }
  
  
  // const fillArr: any = []
  // fileList.forEach((item: any) => {
  //   fillArr.push(item.response.data)
  // })
  // form.accessoryList = fillArr
  // if (response.code === 100023) {
  //   //表示已重复上传
  //   ElMessage.error(response.data.msg)
  //   return
  // }
  form.isUploading = false
}
//文件上传时
const handleProgress = () => {
  form.isUploading = true
}
//文件上传失败时
const handleError = () => {
  form.isUploading = false
}
//文件列表移除文件时
const handleRemove = (file: any, fileList: any) => {
  form.accessoryList = fileList
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
  .record-title {
    font-size: 15px;
    font-weight: bold;
    margin-left: 20px;
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
