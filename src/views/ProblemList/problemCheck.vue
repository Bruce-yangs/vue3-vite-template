<template>
  <div class="common-check-container drill-detail-edit">
    <div class="breadcrumb-container">
      <i class="iconfont el-icon-arrow-left" @click="router.go(-1)"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/problem-list' }">
          问题管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          校验问题
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

          <!-- 校验操作/-->
          <div>
            <div class="common-two-box">
              <el-form-item label="校验人/单位" prop="verifier">
                <el-input
                  v-model.trim="form.verifier"
                  maxlength="50"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item
                label="校验时间"
                class="date-picker"
                prop="verificationTime"
              >
                <el-date-picker
                  v-model="form.verificationTime"
                  type="datetime"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="检验结果" prop="verificationType">
                <el-radio-group v-model="form.verificationType">
                  <el-radio :label="1">未解决问题</el-radio>
                  <el-radio :label="2">解决问题</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="校验结果描述" prop="verificationResult">
                <el-input
                  size="medium"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="请输入内容"
                  v-model="form.verificationResult"
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
                  :file-list="form.checkAccessoryList"
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
          </div>
        </el-form>
      </div>
      <div class="common-footer">
        <el-button plain @click="goBack()" class="viewBottom">
          返回
        </el-button>
        <el-button type="primary" @click="handleSave()" class="viewBottom">
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent, reactive, ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { asyncGetData, useParamData, rules } from './hooks'
  import axios from '../../utils/request'
  import ProblemListBaseInfo from '../../components/ProblemListBaseInfo.vue'
  import ProblemListHistory from '../../components/ProblemListHistory.vue'
  import dayjs from 'dayjs'

  const router = useRouter()
  const route = useRoute()
  const formRef = ref()
  const form = reactive<any>({
    verificationType: '', // 校验结果
    verifier: '', // 校验人/单位
    inspectionTime: '', // 校验时间
    verificationResult: '', //校验结果描述
    checkAccessoryList: [],

    isUploading: false, //是否正在上传,
  })

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
    router.go(-1)
  }
  const asyncSave = () => {
    let url = '/conductorIssueRecord/conductorCheckIssueRecordLog'
    axios.post(url, { issueRecordId: route.query.id, ...form ,
      verificationTime: form.verificationTime ? dayjs(form.verificationTime).format('YYYY-MM-DD HH:mm:ss') : form.verificationTime
    }).then(res => {
      if (res.data.code === 200) {
        ElMessage.success('保存成功')
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
      form.checkAccessoryList = _fileList
    }
    
    
    // const fillArr: any = []
    // fileList.forEach((item: any) => {
    //   fillArr.push(item.response.data)
    // })
    // form.checkAccessoryList = fillArr
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
    form.checkAccessoryList = fileList
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
}
</style>
<style lang="scss">
  .date-picker .el-input--small .el-input__inner {
    width: 200px;
  }
</style>