<template>
  <div class="common-check-container drill-detail-edit">
    <div class="breadcrumb-container">
      <i class="iconfont el-icon-arrow-left" @click="router.go(-1)"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/problem-list' }">
          问题管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ titleNames }}
          <!-- route.params.id ? "编辑" : "添加" -->
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
          <!-- 添加 / 编辑 -->
          <div>
            <h4>问题基本信息</h4>
            <div class="common-two-box">
              <el-form-item label="演习任务" prop="taskId">
                <el-select
                  v-model="form.taskId"
                  filterable
                  @change="taskChange"
                  clearable>
                  <el-option
                    v-for="(item) in taskSelectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="演习阶段" prop="exercisePhaseId">
                <el-radio-group v-model="form.exercisePhaseId" size="small">
                  <el-radio-button label="1">准备阶段</el-radio-button>
                  <el-radio-button label="2">实施阶段</el-radio-button>
                  <el-radio-button label="3">结束阶段</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="发现单位" prop="discoverUnitIds">
                <el-cascader
                  :options="datas.cascaderList"
                  v-model="form.discoverUnitIds" 
                  :props="{ label: 'name', children: 'children', value: 'id' }"
                  clearable>
                </el-cascader>
              </el-form-item>
              <el-form-item
                label="发现时间"
                prop="occurrenceTime"
                class="date-picker"
              >
                <el-date-picker
                  v-model="form.occurrenceTime"
                  type="datetime"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="发现人" prop="discoverPeople">
                <el-input
                  v-model.trim="form.discoverPeople"
                  maxlength="50"   placeholder="请填写"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="contactNumber">
                <el-input
                  v-model.trim="form.contactNumber"
                  maxlength="11"   placeholder="请填写"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="问题装备型号" prop="equipmentModelIds">
                <el-cascader
                  :show-all-levels="false"
                  v-model="form.equipmentModelIds"
                  :options="selectEquipmentIdsList"
                  :props="{ label: 'name', children: 'children', value: 'id' }"
                ></el-cascader><!-- , multiple: true -->
              </el-form-item>
              <el-form-item label="具体编号" prop="equipmentNumber">
                 <el-input
                  v-model.trim="form.equipmentNumber"
                  maxlength="11"  placeholder="请填写"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="问题装备能力" prop="equipmentCapabilityId">
                <el-select
                  v-model="form.equipmentCapabilityId"
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
            <div class="common-one-box">
              <el-form-item label="发生环境">
                <el-input
                  v-model.trim="form.occurrenceEnvironment"
                  maxlength="100"
                  size="medium"
                  placeholder="请填写发生问题的具体部件，如发动机、油门、刹车器、刹车系统"
                ></el-input>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="详细描述">
                <el-input
                  size="medium"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="请输入内容"
                  v-model="form.detailedDescription"
                ></el-input>
              </el-form-item>
            </div>
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
              <el-form-item label="问题等级">
                <el-radio-group v-model="form.problemLevel" size="small">
                  <el-radio-button label="1">一般</el-radio-button>
                  <el-radio-button label="2">严重</el-radio-button>
                  <el-radio-button label="3">重大</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="common-item-box uploadFile">
              <el-form-item label="问题附件">
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
            <hr class="mb-5" />
          </div>
        </el-form>
        <div class="common-footer " ><!-- btn -->
          <el-button plain @click="goBack">返回</el-button>
          <el-button type="primary" @click="handleSave()" class="viewBottom">
            保存
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { useParamOptions, rules, useTreeData, useDataFillds } from './hooks'
import axios from '../../utils/request'
import { Desc } from './types'


export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const formRef = ref()
  
    const form = reactive<any>({
      id: '',
      taskId: '',
      exercisePhaseId: null, // 演习阶段 1 准备阶段 2 实施阶段 3 结束阶段
      discoverUnitIds: [],
      occurrenceTime: '', // 发现时间
      discoverPeople: '', // 发现人
      contactNumber: '', // 联系电话
      equipmentModelIds: '', // 问题装备型号
      equipmentNumber: '', //具体编号
      equipmentCapabilityId: '', // 问题装备能力
      occurrenceEnvironment: '', // 发生环境
      detailedDescription: '', // 详细描述
      accessoryList: [], // 附件
      problemParts: '', //问题定位
      problemAttributesIds: '', //问题分类id
      problemLevel: '', //问题等级（1=一般 2=严重 3=重大）
      causeAnalysis: '', //原因分析
      isUploading: false //是否正在上传
    })

    const action = route.params.action
    const params = route.query
    // const params = route.params
    const title: Desc = {
      supplement: '补充信息',
      add: '添加',
      edit: '编辑',
      copy: '复制',
      detail: '详情',
      examine: '审核',
      check: '校验'
    }
    const titleNames = title[action as keyof typeof title]
    // 是否是补充信息
    const isSupplement = ref(false)
    const isEdit = ref(false)
    if (action === 'supplement') isSupplement.value = true
    if (action === 'edit') isEdit.value = true
    // 演习任务下拉数据
    const taskSelectList: any  = useParamOptions('conductorExerciseTask/getExerciseTaskList', null)
    // 装备能力下拉数据
    const equipmentSelectList: any  = useParamOptions('equipment/capabilitySelectList', null)
    // 获取发现单位的数据
    const datas: any  = reactive({
      cascaderList: []
    })
    const taskChange = (e:any) => {
      form.discoverUnitIds = []
      datas.cascaderList= useDataFillds('/conductorExerciseTask/getDiscoverTree', form.taskId)
    }
    //获取问题装备型号 数据  树结构
    const selectEquipmentIdsList: any  = useDataFillds('/equipment/getTreeList', null)
    // 问题分类选择  树结构
    const problemClassSelectList1: any  = useDataFillds('/problemAttr/getTreeList', null)

    // onMounted(() => {
    //   if (action !== 'add') {
    //     const viewBottom = document.querySelector('.viewBottom')
    //     viewBottom && viewBottom.scrollIntoView()
    //   }
    // })

    //回显数据
    const asyncGetDetailData = () => {
      if(action === 'add') return  //添加不需要回显数据
      axios
        .get('/conductorIssueRecord/getConductorIssueRecordInfoVo?id=' + params.id)
        .then(res => {
          if (res.data.code === 200) {
            datas.cascaderList= useDataFillds('/conductorExerciseTask/getDiscoverTree', res.data.data.taskId)
            Object.keys(form).forEach((item: any) => {
              form[item] = res.data.data[item]
            })
            // Object.assign(form, res.data.data)
          } else {
            ElMessage.error(res.data.msg)
          }
        })
    }
    
    const asyncSave = () => {
      let url = '/conductorIssueRecord/conductorSaveIssueRecord'
      if (params.id && action === 'edit') {
        url = '/conductorIssueRecord/conductorUpdateIssueRecord'
      } else {
        form.id = ''
      }
      axios.post(url, { ...form, occurrenceTime: dayjs(form.occurrenceTime).format("YYYY-MM-DD HH:mm:ss") }).then(res => {
        if (res.data.code === 200) {
          ElMessage.success('保存成功')
          router.push('/problem-list')
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    }
    asyncGetDetailData()
    // 1：保存 事件 ； 2：保存并提交至组长 事件
    const handleSave = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          asyncSave()
        }
      })
    }

    // 返回事件
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
     * @param twoDimensionalList {Array} 最新结果集合 ?????
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
      /* if (response.code === 100023) {
        //表示已重复上传
        ElMessage.error(response.data.msg)
        return
      } */
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
    

    

    return {
      rules,
      route,
      router,
      formRef,
      form,
      isEdit,
      isSupplement,
      datas,
      selectEquipmentIdsList,
      taskSelectList,
      titleNames,
      equipmentSelectList,
      problemClassSelectList1,
      taskChange,
      beforeAvatarUpload,
      handlesuccess,
      handleProgress,
      handleError,
      handleRemove,
      handleSave,
      goBack,
    }
  }
})
</script>

<style lang="scss" scoped>
.padding-container {
  padding: 30px;
  padding-top: 15px;
  h3 {
    font-size: 21px;
  }
  h4 {
    font-size: 17px;
    font-weight: bold;
  }
  .common-one-box {
    padding-right: 30px;
    box-sizing: border-box;
  }
  .uploadFile {
    p {
      margin: 0;
      position: relative;
      color: #ccc;
      margin-top: -2px;
    }
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
}
</style>
<style lang="scss">
.drill-detail-edit {
  .uploadFile {
    .el-upload {
      text-align: left;
    }
  }
  // 发现单位的长度为100%
  .findUnit .el-select--medium {
    width: 100%;
  }
  .date-picker .el-input--small .el-input__inner {
    width: 220px !important;
  }
  .el-option .el-select {
    display: block;
    .el-input__inner {
      width: 100% !important;
    }
  }
}
</style>
