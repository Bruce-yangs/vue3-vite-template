<template>
  <div class="common-check-container drill-detail-edit">
    <div class="breadcrumb-container">
      <i class="iconfont el-icon-arrow-left" @click="router.go(-1)"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/problem-list' }">
          问题管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          问题补充
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

          <!-- 补充显示内容 -->
          <div class="common-one-box">
            <div>
              <el-form-item label="补充信息" prop="supplementDescription">
                <el-input
                  size="medium"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="请输入内容"
                  v-model="form.supplementDescription"
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
          </div>
          <div class="common-footer ">
            <el-button plain  @click="goBack" class="viewBottom">
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
import { reactive, ref, } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { rules, asyncGetData, useParamData } from './hooks'
import axios from '../../utils/request'
import ProblemListBaseInfo from '../../components/ProblemListBaseInfo.vue'
import ProblemListHistory from '../../components/ProblemListHistory.vue'

    const router = useRouter()
    const route = useRoute()
    const formRef = ref()
    const form = reactive<any>({
      supplementDescription: '',
      accessoryList: []
    })


    const getBaseInfo = asyncGetData()  // 引入根据id获取数据
    const datas = reactive<any>({
      historyData:[],
      baseInfo: {}
    })
    // 获取基本信息数据
    getBaseInfo('conductorIssueRecord/getConductorIssueRecordInfoVo', route.query.id, (res:any)=>{
      datas.baseInfo = res
    })
    // 获取历史记录数据
    datas.historyData = useParamData('conductorIssueRecord/getIssueRecordLogList', route.query.id)


    const asyncSave = () => {
      let url = '/conductorIssueRecord/conductorSupplementIssueRecordLog'
      const{supplementDescription, accessoryList} = form
      let issueRecordId = route.query.id
      axios.post(url, {issueRecordId, supplementDescription, accessoryList }).then(res => {
        if (res.data.code === 200) {
          ElMessage.success('保存成功')
          goBack()
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    }
    const goBack = () => {
      router.go(-1)
    }
    const handleSave = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) asyncSave()
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
  .btn {
    button {
      color: #fff;
      width: 140px;
      height: 40px;
      background: #3bc6bc;
      border-radius: 2px;
      margin-right: 20px;
      font-size: 16px;
      border-radius: 5px;
    }
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
