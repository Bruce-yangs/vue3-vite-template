<template>
  <div class="common-check-container exerciseMission">
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/exercise-manage' }">
          演习任务
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ route.params.id ? '编辑' : '添加' }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="common-content-box">
      <div class="common-detail-box padding-container">
        <div class="tabs">
          <el-steps :active="showTabIndex" finish-status="success">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
          </el-steps>
        </div>

        <!-- 基本信息 -->
        <el-form
          v-show="showTabIndex == 0"
          :model="essentialInfoForm"
          ref="essentialInfoFormRef"
          :rules="essentialInfoRules"
          label-width="160px"
          label-suffix="："
        >
          <div class="center-box essential-information">
            <div class="common-one-box">
              <el-form-item label="演习名称" prop="taskName">
                <el-input
                  v-model="essentialInfoForm.taskName"
                  size="medium"
                  maxlength="100"
                  placeholder="请填写"
                ></el-input>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="演习代号" prop="taskCode">
                <el-input
                  v-model="essentialInfoForm.taskCode"
                  maxlength="20"
                  size="medium"
                  placeholder="请填写"
                ></el-input>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="总导演" prop="userId">
                <el-select
                  v-model="essentialInfoForm.userId"
                  size="medium"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in selectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="date-picker" label="任务时间" required>
                <el-col :span="10">
                  <el-form-item prop="startDate">
                    <el-date-picker
                      v-model="essentialInfoForm.startDate"
                      type="date"
                      placeholder="开始日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line mx-2" :span="2">至</el-col>
                <el-col :span="10">
                  <el-form-item prop="endDate">
                    <el-date-picker
                      v-model="essentialInfoForm.endDate"
                      type="date"
                      placeholder="结束日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="任务基地" prop="exerciseBase">
                <el-input
                  v-model="essentialInfoForm.exerciseBase"
                  size="medium"
                  maxlength="100"
                  placeholder="请填写"
                ></el-input>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="任务描述">
                <el-input
                  size="medium"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="请输入内容"
                  v-model="essentialInfoForm.exercise"
                ></el-input>
              </el-form-item>
            </div>
            <div class="common-one-box upload-file">
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
                  :file-list="essentialInfoForm.accessoryList"
                  :before-upload="beforeAvatarUpload"
                >
                  <el-button size="small">
                    <i class="el-icon-upload"></i>
                    上传文件
                  </el-button>
                </el-upload>
                <p>
                  支持扩展名：jpg、jpeg、png、bmp、xls、xlsx、doc、docx、pdf、txt、rar、7z、zip、dat、mp3、mp4、avi、mov、flv
                </p>
              </el-form-item>
            </div>
          </div>
        </el-form>

        <!-- 专家分组 -->
        <el-form
          v-show="showTabIndex == 1"
          :model="expertGroupForm"
          ref="expertGroupFormRef"
          :rules="expertGroupRules"
          label-width="160px"
          label-suffix="："
        >
          <div>
            <div class="common-one-box">
              <p style="padding-top:6px">
                *确认专家分组后，将收录问题分到对应的专家分组进行问题评估
              </p>
            </div>
            <div class="common-one-box">
              <el-table :data="expertGroupForm" style="width: 100%">
                <el-table-column
                  style="background: #ccc"
                  type="index"
                  label="序号"
                  width="50"
                ></el-table-column>
                <el-table-column label="分类" width="200">
                  <template #default="scope">
                    <el-select
                      v-model="scope.row.sort"
                      @change="changeSort($event, scope.row)"
                      filterable
                      clearable
                    >
                      <el-option label="问题收集" :value="1"></el-option>
                      <el-option label="问题分析" :value="2"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="groupLeader" width="190" label="*组名">
                  <template #default="scope">
                    <el-input
                      maxlength="20"
                      v-model="scope.row.groupName"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="groupLeader" width="190" label="*组长">
                  <template #default="scope">
                    <el-select
                      v-model="scope.row.leaderId"
                      placeholder="请选择"
                      filterable
                      clearable
                    >
                      <el-option
                        v-for="item in scope.row?.groupSelectList"
                        :key="item"
                        :label="item.name || ''"
                        :value="item.id || ''"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="groupLeader" width="260" label="成员">
                  <template #default="scope">
                    <el-select
                      v-model="scope.row.memberIdList"
                      filterable
                      multiple
                      collapse-tags
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in scope.row?.groupSelectList"
                        :key="item"
                        :label="item.name || ''"
                        :value="item.id || ''"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="其他人员" width="190">
                  <template #default="scope">
                    <el-input
                      :maxlength="200"
                      v-model="scope.row.otherGroupMember"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                  <!-- fixed="right" -->
                  <template #default="scope">
                    <el-button
                      type="text"
                      class="common-btn-text"
                      @click="handleDel(scope.$index)"
                    >
                      <i class="iconfont el-icon-delete"></i>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button class="mt-6 ml-6" @click="addGroup">
                添加分组
              </el-button>
            </div>
          </div>
        </el-form>

        <!-- 参演部队 -->
        <el-form
          class="perform-troops"
          v-show="showTabIndex == 2"
          :model="performTroopsForm"
          ref="performTroopsFormRef"
          :rules="performTroopsRules"
          label-width="160px"
          label-suffix="："
        >
          <div>
            <div
              class="common-one-box"
              v-for="(item, index) in performTroopsForm"
              :key="index"
            >
              <el-form-item
                :label="groupTypeName[item.typeId]"
                class="title"
                :required="item.typeId == 3 ? false : true"
              ></el-form-item>
              <el-form-item label="参演单位">
                <el-cascader
                  size="medium"
                  :options="selectTroopIdsList"
                  v-model="item.troopIdsList"
                  :props="{
                    label: 'name',
                    children: 'children',
                    value: 'id',
                    multiple: true
                  }"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="主要装备型号">
                <el-cascader
                  size="medium"
                  :options="selectEquipmentIdsList"
                  v-model="item.equipmentIdsList"
                  :props="{
                    label: 'name',
                    children: 'children',
                    value: 'id',
                    multiple: true
                  }"
                  clearable
                ></el-cascader>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="common-footer">
          <el-button v-if="showTabIndex != 0" @click="LastStep">
            上一步
          </el-button>
          <el-button type="primary" @click="handleSave(1)" v-show="!(route.query.status == 2 &&  route.params.action === 'edit' && showTabIndex == 2 )" >
            {{ showTabIndex == 2 ? '仅保存' : '保存并下一步' }}
          </el-button>
          <!-- v-show="  route.query.status == 2  params.action === 'edit'" -->

          <!-- <el-button type="primary" @click="handleSave(1)" >
            {{ showTabIndex == 2 ? '仅保存' : '保存并下一步' }}
          </el-button> -->
          <el-button
            type="primary"
            v-if="showTabIndex == 2"
            @click="handleSave(2)"
          >
            保存并提交
          </el-button>
          <el-button plain @click="goBack">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { asyncGetData, useParamOptions, useDataFillds } from './hooks'
import axios from '../../utils/request'
import dayjs from 'dayjs'

// 基本信息模块的表单验证
const essentialInfoRules = {
  taskName: {
    required: true,
    message: '请填写演习名称'
  },
  taskCode: {
    required: true,
    message: '请填写演习代号'
  },
  userId: {
    required: true,
    message: '请选择总导演'
  },
  exerciseBase: {
    required: true,
    message: '请填写任务基地'
  },
  startDate: {
    required: true,
    message: '请选择开始时间'
  },
  endDate: {
    required: true,
    message: '请选择结束时间'
  }
}
// 专家分组表单验证
const expertGroupRules = {}
// 参演部队验证
const performTroopsRules = {
  redExpertGroup: {
    required: true,
    message: '请填写主要装备型号'
  },
  blueExpertGroup: {
    required: true,
    message: '请填写主要装备型号'
  }
}
export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    // @ts-ignore
    const { proxy } = getCurrentInstance()
    // 页面挑战携带的参数
    const params = route.params
    // status:第三步时 1 : 保存   2: 保存并提交
    const status = ref(1)
    // 新增演习任务的id
    let addTaskId = ''
    // 导演下拉列表
    const selectList: any = useParamOptions(
      'conductorUser/getLoginNameOrNameList',
      2,
      2
    )
    // 当前显示tab的index
    const showTabIndex = ref(0)
    //<---  基本信息模块  start--->
    const essentialInfoFormRef = ref()
    // 表单数据
    const essentialInfoForm = reactive<any>({
      id: '',
      taskName: '', // 演习名称
      taskCode: '', // 演习代号
      userName: '', //总导演
      userId: null, // 总导演id
      startDate: '', //任务时间 开始时间
      endDate: '', //任务时间 结束时间
      exerciseBase: '', // 任务基地
      exercise: '', // 演习描述
      accessoryList: [],
      // 是否正在上传
      isUploading: false
    })
    // 保存 / 编辑 :  第 一 步的数据
    const asyncSaveOne = () => {
      essentialInfoFormRef.value.validate((valid: boolean) => {
        if (valid) {
          if (essentialInfoForm.endDate < essentialInfoForm.startDate) return ElMessage.error('结束时间不得小于开始时间')
          let url = 'conductorExerciseTask/saveExerciseTask'
          let formData: any = essentialInfoForm
          // 默认是新增的接口地址  编辑时 修改请求路径
          if (params.id && params.action === 'edit')
            url = 'conductorExerciseTask/updateExerciseTask'
          formData.id = params.id
          axios
            .post(url, {
              ...formData,
              startDate: dayjs(essentialInfoForm.startDate).format(
                'YYYY-MM-DD'
              ),
              endDate: dayjs(essentialInfoForm.endDate).format('YYYY-MM-DD')
            })
            .then(res => {
              if (res.data.code === 200) {
                // ElMessage.success('保存成功11')
                addTaskId = res.data.data
                showTabIndex.value++
                getData(showTabIndex.value)
              } else {
                ElMessage.error(res.data.msg)
              }
            })
        }
      })
    }
    //<---  基本信息模块   end--->

    //<---  专家分组模块   start--->
    const expertGroupFormRef = ref()
    // 表单数据
    const expertGroupForm = reactive<any>([
      {
        id: '',
        groupName: '', //分组名称
        sort: null, //分类
        leaderId: null, //组长id
        leaderName: '', //组长名称
        otherGroupMember: '', //其他人员
        memberIdList: '', //成员id
        memberNames: '' //成员名称
      }
    ])
    let groupUserSelectList1: any = useParamOptions(
      'conductorUser/getLoginNameOrNameList',
      2,
      1
    )
    let groupUserSelectList2: any = useParamOptions(
      'conductorUser/getLoginNameOrNameList',
      2,
      2
    )
    let groupUserSelectData: any = {
      1: groupUserSelectList1,
      2: groupUserSelectList2
    }
    const changeSort = (e: any, item: any) => {
      // 选择后清空缓存数据
      item.leaderId = ''
      item.memberIdList.length = 0
      if (e) item.groupSelectList = groupUserSelectData[e]
    }
    const handleDel = (id: number) => {
      proxy
        .$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          center: true,
          customClass: 'common-confirm-box',
          confirmButtonClass: 'common-btn-primary',
          cancelButtonClass: 'common-btn-text'
        })
        .then(() => {
          expertGroupForm.splice(id, 1)
        })
    }
    const addGroup = () => {
      if (addGroupValidate()) {
        expertGroupForm.push({ groupSelectList: [{}] })
      }
    }
    // 校验添加专家组时  是否填写了必填项
    const addGroupValidate = () => {
      for (let index = 0; index < expertGroupForm.length; index++) {
        const item = expertGroupForm[index]
        if (!item.groupName || !item.leaderId) {
          let title = !item.groupName ? '组名' : '组长'
          ElMessage.error(`请完善${title}信息`)
          return false
        }
      }
      return true
    }
    // 编辑 / 保存 第二步数据
    const asyncSaveTwo = () => {
      if (!addGroupValidate()) return
      let url = 'conductorExerciseTask/saveExerciseTaskGroup'
      let exerciseTaskGroupRoList = expertGroupForm
      // 默认是新增的接口地址  编辑时 修改请求路径
      if (params.id && params.action === 'edit') {
        url = 'conductorExerciseTask/updateExerciseTaskGroup'
      }
      axios
        .post(url, { taskId: addTaskId, exerciseTaskGroupRoList })
        .then(res => {
          if (res.data.code === 200) {
            showTabIndex.value++
            getData(showTabIndex.value)
          } else {
            ElMessage.error(res.data.msg)
          }
        })
    }
    //<---  专家分组模块   end--->

    //<---  参演部队模块   start--->
    // 部队信息: 编号名称
    const performTroopsFormRef = ref()
    const selectTroopIdsList: any = useDataFillds(1)
    const selectEquipmentIdsList: any = useDataFillds(2)
    const groupTypeName: any = { 1: '红方', 2: '蓝方', 3: '第三方' }
    let performTroopsForm = reactive(
      [
        {
          typeId: 1, // 类型（1=红方 2=蓝方 3=第三方)
          troopIdsList: [], // 参演部队id集合
          equipmentIdsList: [] // 装备型号
        },
        {
          typeId: 2, // 类型（1=红方 2=蓝方 3=第三方)
          troopIdsList: [], // 参演部队id集合
          equipmentIdsList: [] // 装备型号
        },
        {
          typeId: 3, // 类型（1=红方 2=蓝方 3=第三方)
          troopIdsList: [], // 参演部队id集合
          equipmentIdsList: [] // 装备型号
        }
      ] // 参演单位数据集合
    )

    // 部队信息校验
    const performTroopsValidate = () => {
      // for each 无法直接跳出所有循环
      for (let index = 0; index < performTroopsForm.length; index++) {
        const item = performTroopsForm[index]
        if (
          (item.typeId === 1 || item.typeId === 2) &&
          (item.troopIdsList?.length === 0 ||
            item.equipmentIdsList?.length === 0)
        ) {
          let type = item.typeId === 1 ? '红方' : '蓝方'
          let title = item.troopIdsList?.length === 0 ? '参演单位' : '装备型号'
          ElMessage.error(`请完善${type}${title}信息`)
          return false
        }
      }
      return true
    }
    // 编辑 / 保存 第三步数据
    const asyncSaveThree = () => {
      if (!performTroopsValidate()) return
      let url = 'conductorExerciseTask/saveExerciseTaskType'
      let exerciseTaskTypeRoList = performTroopsForm
      // 默认是新增的接口地址  编辑时 修改请求路径
      if (params.id && params.action === 'edit') {
        url = 'conductorExerciseTask/updateExerciseTaskType'
      }
      axios
        .post(url, {
          taskId: addTaskId,
          status: status.value,
          exerciseTaskTypeRoList
        })
        .then(res => {
          if (res.data.code === 200) {
            ElMessage.success('保存成功')
            if (status.value === 2) router.push('/exercise-manage')
            goBack()
          } else {
            ElMessage.error(res.data.msg)
          }
        })
    }
    //<---  参演部队模块   end--->

    // 第一次进入时 和 点击上一步下一步时  获取对应模块的数据  获取数据
    const asyncData = asyncGetData()
    const getData = (index: number) => {
      if (params.action === 'add') return // 添加的时候不需要请求数据
      let url = 'conductorExerciseTask/getExerciseTaskInfoVo'
      if (index === 1) url = 'conductorExerciseTask/getExerciseTaskGroupInfo'
      if (index === 2) url = 'conductorExerciseTask/getExerciseTaskTypeVo'
      asyncData(url, params.id || '', res => {
        if (index === 0) Object.assign(essentialInfoForm, res)
        if (index === 1) {
          Object.assign(expertGroupForm, res)
          // 获取第二部数据时 获取下拉数据
          expertGroupForm.forEach((item: any) => {
            if (item.sort) {
              item.groupSelectList = groupUserSelectData[item.sort]
            }
          })
        }
        // 调整数据顺序 确定安装  红 蓝 第三方这个顺序显示
        if (index === 2) {
          Object.assign(performTroopsForm, res)
          const sortRule = (a: any, b: any) => {
            return a.typeId - b.typeId
          }
          performTroopsForm.sort(sortRule)
        }
      })
    }
    // 一进来 请求第一步的数据
    getData(showTabIndex.value)
    // 上一步时间
    const LastStep = () => {
      showTabIndex.value--
    }
    // 保存对应模块的数据 并 触发下一步  status:第三步时 1 : 保存   2: 保存并提交
    const handleSave = (type: number) => {
      status.value = type
      if (showTabIndex.value === 0) return asyncSaveOne()
      if (showTabIndex.value === 1) return asyncSaveTwo()
      if (showTabIndex.value === 2) return asyncSaveThree()
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
        essentialInfoForm.accessoryList = _fileList
      }

      // const fillArr: any = []
      // fileList.forEach((item: any) => {
      //   fillArr.push(item.response.data)
      // })
      // essentialInfoForm.accessoryList.push(fillArr)
      // if (response.code === 100023) {
      //   //表示已重复上传
      //   ElMessage.error(response.data.msg)
      //   return
      // }
      essentialInfoForm.isUploading = false
    }
    //文件上传时
    const handleProgress = () => {
      essentialInfoForm.isUploading = true
    }
    //文件上传失败时
    const handleError = () => {
      essentialInfoForm.isUploading = false
    }
    //文件列表移除文件时
    const handleRemove = (file: any, fileList: any) => {
      essentialInfoForm.accessoryList = fileList
    }

    return {
      route,
      router,
      showTabIndex,
      essentialInfoRules,
      essentialInfoFormRef,
      essentialInfoForm,
      selectList,
      beforeAvatarUpload,
      handlesuccess,
      handleProgress,
      handleError,
      handleRemove,
      // 专家分组
      expertGroupForm,
      expertGroupFormRef,
      expertGroupRules,
      changeSort,
      handleDel,
      addGroup,
      // 参演部队
      performTroopsForm,
      performTroopsFormRef,
      performTroopsRules,
      groupTypeName,
      selectTroopIdsList,
      selectEquipmentIdsList,
      handleSave,
      LastStep,
      goBack
    }
  }
})
</script>

<style lang="scss" scoped>
.tabs {
  height: 32px;
  padding: 0 100px;
  margin-bottom: 80px;
  .el-button {
    border: 0;
    background-color: transparent;
    span {
      display: inline-block;
    }
    .circle {
      width: 12px;
      height: 12px;
      border: 2px solid #409eff;
      border-radius: 50%;
    }
    .test {
      color: #409eff;
      margin-left: 8px;
      margin-right: 100px;
    }
  }
}

.common-one-box {
  margin-bottom: 28px;
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
}
.btn {
  margin-top: 50px;
  text-align: center;
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
.padding-container {
  padding: 30px 0;
}
// 参演部队显示模块的样式
.perform-troops {
  .common-one-box {
    padding-right: 40px;
    box-sizing: border-box;
    &:not(:last-child) {
      border-bottom: 1px solid #dbdfe6;
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 25px;
    }
    .el-select--medium {
      width: 100%;
    }
  }
}
// 问题跟踪设定模块的样式
.question-setting {
  p {
    position: absolute;
    top: 185px;
    left: 50px;
    color: rgba(0, 0, 0, 0.25);
  }
  .common-one-box .el-form-item {
    margin-bottom: 20px;
  }
  .el-checkbox-group {
    display: inline-block;
  }
}
</style>
<style lang="scss">
// 修改ui框架样式穿透
.exerciseMission {
  // 基本信息的样式
  .essential-information {
    // .el-input--small .el-input__inner {
    //   // width: 100%;
    // }
    .date-picker .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
      .el-input__inner {
        width: 160px;
      }
    }
  }
  // 参演部队显示模块的样式
  .perform-troops {
    .title .el-form-item__label {
      font-size: 17px !important;
      font-weight: bold;
    }
    .common-two-box {
      .el-form-item:first-child .el-input--small .el-input__inner {
        width: 336px;
      }
      .el-form-item:nth-child(2) .el-input--small .el-input__inner {
        width: 208px;
      }
    }
    .el-cascader--medium {
      width: 100%;
    }
  }
  .upload-file {
    p {
      margin: 0;
      position: relative;
      color: #ccc;
      margin-top: -2px;
    }
    .el-upload {
      text-align: left;
    }
  }
}
</style>
