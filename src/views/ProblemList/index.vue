<template>
  <div class="container quesition-list">
    <p class="title">问题列表</p>
    <el-card shadow="never">
      <el-form
        :inline="true"
        :model="form"
        label-suffix="："
        class="filter-container"
        label-width="110px"
      >
        <el-form-item label="演习任务">
          <el-select
            v-model="form.taskId"
            filterable
            @change="taskChange"
            clearable
          >
            <el-option
              v-for="item in taskSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题编号">
          <el-input
            placeholder="请输入"
            v-model.trim="form.issueCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="装备型号">
          <el-cascader
            :show-all-levels="false"
            @change="onChangeType"
            v-model="form.equipmentModelCode"
            :options="selectEquipmentIdsList"
            :props="{
              label: 'name',
              children: 'children',
              value: 'code'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="问题状态">
          <el-select v-model="form.status" filterable clearable>
            <el-option
              v-for="item in problemStatus"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题等级">
          <el-select v-model="form.problemLevel" filterable clearable>
            <el-option label="一般" value="1"></el-option>
            <el-option label="严重" value="2"></el-option>
            <el-option label="重大" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专家组">
          <el-select
            v-model="form.managementGroupId"
            @change="groupChange"
            filterable
            clearable
          >
            <el-option
              v-for="item in datas.expertGroupData"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专家">
          <el-select v-model="form.managementId" filterable clearable>
            <el-option
              v-for="item in datas.expertData"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分析状态">
          <el-select v-model="form.auditStatus" filterable clearable>
            <el-option value="2" label="待分析"></el-option>
            <el-option value="3" label="已分析"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题发现时间">
          <el-date-picker
            v-model="form.occurrenceTime"
            type="date"
            placeholder="请选择时间"
          ></el-date-picker>
        </el-form-item>
        <el-button class="ml-6" type="primary" @click="asyncData">
          查询
        </el-button>
        <el-button plain @click="handleReset">重置</el-button>
      </el-form>
      <div class="control-button">
        <!-- v-has="'drone-add'" -->
        <el-button
          type="primary"
          v-has="'issue_add'"
          @click="router.push('/problem-list/add')"
        >
          添加问题
        </el-button>

        <el-button v-has="'issue_export'" plain @click="handleEvent">
          导出
        </el-button>
      </div>
      <!-- height:calc(100% - 30px) -->
      <el-skeleton :rows="5" animated v-if="isLodding" />
      <el-table
        v-else
        :data="datas.tableData"
        style="width: 100%;"
        border
      >
      <!--   @selection-change="handleSelectionChange" -->
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column
          prop="issueCode"
          label="问题编号"
          width="130"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="equipmentModelName"
          label="装备型号"
          width="130"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="equipmentNumber"
          width="130"
          label="装备编号"
        ></el-table-column>
        <el-table-column prop="problemLevel" width="130" label="问题等级">
          <template #default="scope">
            <span v-if="scope.row.problemLevel == 1">一般</span>
            <span v-else-if="scope.row.problemLevel == 2">严重</span>
            <span v-else-if="scope.row.problemLevel == 3">重大</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="detailedDescription"
          width="130"
          label="问题描述"
        ></el-table-column>
        <el-table-column
          prop="causeAnalysis"
          width="130"
          label="问题原因"
        ></el-table-column>
        <el-table-column
          prop="occurrenceTime"
          width="130"
          label="发现时间"
        ></el-table-column>
        <el-table-column
          prop="managementor"
          width="130"
          label="专家"
        ></el-table-column>
        <el-table-column
          prop="managementGroupName"
          width="130"
          label="专家组"
        ></el-table-column>
        <el-table-column
          prop="managementProposal"
          width="130"
          label="分析建议"
        ></el-table-column>
        <el-table-column prop="auditStatus" width="130" label="分析状态">
          <template #default="scope">
            <span>{{ scope.row.auditStatus == 2 ? '待分析' : '已分析' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" width="130" label="问题状态">
          <template #default="scope">
            <span>{{ problemStatus[scope.row.status-1].label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="500">
          <!-- fixed="right" -->
          <template #default="scope">
            <el-button
              type="text"
              v-has="'issue_check'"
              class="common-btn-text"
              @click="router.push('/problem-list/problem-detail?id=' + scope.row.id)">
              <i class="iconfont el-icon-document"></i>
              查看
            </el-button>
            <el-button  
              v-if="scope.row.closedBtnType === 1"
              type="text"
              class="common-btn-text"
              @click="showCloseProblemDialog(scope.row.id)">
              <i class="iconfont el-icon-circle-close"></i>
              关闭
            </el-button>
            <el-button
              type="text"
              v-has="'issue_copy'"
              class="common-btn-text"
              @click="router.push('/problem-list/copy?id=' + scope.row.id)"
            >
              <i class="iconfont el-icon-document-copy"></i>
              复制
            </el-button>
            <el-button
              type="text" v-if="scope.row.editBtnType === 1"
              v-has="'issue_edit'"
              class="common-btn-text"
              @click="router.push('/problem-list/edit?id=' + scope.row.id)"
            >
              <i class="iconfont el-icon-edit-outline"></i>
              编辑
            </el-button>
            <el-button
              type="text"
              class="common-btn-text"
              @click="
                router.push(
                  '/problem-list/problem-slupplement?id=' + scope.row.id
                )
              "
            >
              <i class="iconfont el-icon-tickets"></i>
              补充
            </el-button>
            <el-button  v-if="scope.row.checkBtnType === 1"
              type="text"
              class="common-btn-text"
              @click="
                router.push('/problem-list/problem-check?id=' + scope.row.id)
              "
            >
              <i class="iconfont el-icon-reading"></i>
              校验
            </el-button>
            <el-button v-if="scope.row.managementBtnType === 1"
              type="text"
              class="common-btn-text"
              @click="
                router.push(
                  `/problem-list/problem-handl?taskId=${scope.row.taskId}&id=${scope.row.id}`
                )
              "
            >
              <i class="iconfont  el-icon-view"></i>
              分析
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        v-model:page="currentPage"
        v-model:limit="pageSize"
        @pagination="asyncData"
      />
    </el-card>
    <form action="/api/conductorIssueRecord/exportConductorListIssueRecordListVo " hidden ref="exportForm" method="get">
      <input type="hidden" name="taskId" v-model="form.taskId">
      <input type="hidden" name="issueCode" v-model="form.issueCode">
      <input type="hidden" name="equipmentModelCodeSubmit" v-model="equipmentModelCodeSubmit">
      <input type="hidden" name="status" v-model="form.status">
      <input type="hidden" name="problemLevel" v-model="form.problemLevel">
      <input type="hidden" name="managementGroupId" v-model="form.managementGroupId">
      <input type="hidden" name="managementId" v-model="form.managementId">
      <input type="hidden" name="auditStatus" v-model="form.auditStatus">
      <input type="hidden" name="occurrenceTime" v-model="form.occurrenceTime">
    </form>
    
    <el-dialog title="关闭问题" v-model="isShowCloseProblemDialog" width="600px">
      <el-form
        :model="closeProblemForm"
        label-width="90px"
        label-suffix="："
        status-icon
      >
        <el-form-item label="补充信息">
          <el-input
            size="medium"
            type="textarea"
            :rows="3"
            resize="none"
            placeholder="请输入内容"
            v-model="closeProblemForm.supplementDescription"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowCloseProblemDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseProblem">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    reactive,
    watch
  } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import dayjs from 'dayjs'

  import Pagination from '../../components/Pagination.vue'
  import axios from '../../utils/request'
  import { useDataFillds, useParamOptions, useExpertGroupOptions } from './hooks'
  // import { Item } from './types'
  const router = useRouter()
  const route = useRoute()
  // 问题状态
  const problemStatus = reactive([
    { value: 1, label: '待解决' },
    { value: 2, label: '未解决' },
    { value: 3, label: '待校验' },
    { value: 4, label: '已校验' },
    { value: 5, label: '已关闭' },
    { value: 6, label: '不是问题已关闭' }
  ])
  let datas = reactive<any>({
    tableData: [],
    expertGroupData: [], // 专家组下拉数据
    expertData: [] // 专家下拉数据
  })
  const form = reactive<any>({
    taskId: '',
    issueCode: '',
    equipmentModelCode: '',
    occurrenceTime: '',
    problemLevel: '',
    status: '',
    auditStatus: '',
    managementId: '',
    managementGroupId: ''
  })
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const isLodding = ref(true)
  const exportForm = ref()

  const asyncRoute = () => {
    if (route.query.auditStatus) {
      form.auditStatus = route.query.auditStatus
    }
  }
  asyncRoute()
  watch(()=>route.query, () => {
    asyncRoute()
  })

  const equipmentModelCodeSubmit = ref('')
  const onChangeType = (v: any) => {
    if(v.length) {
      equipmentModelCodeSubmit.value = v[v.length -1]
    }
  }

  const asyncData = () => {
    isLodding.value = true
    axios
      .get('/conductorIssueRecord/conductorListIssueRecordListVo', {
        params: {
          ...form,
          occurrenceTime: form.occurrenceTime
            ? dayjs(form.occurrenceTime).format('YYYY-MM-DD')
            : form.occurrenceTime,
            equipmentModelCode: equipmentModelCodeSubmit.value,
          pageNum: currentPage.value,
          pageSize: pageSize.value
        }
      })
      .then(res => {
        if (res.data.code === 200) {
          datas.tableData = res.data.data.list || []
          total.value = res.data.data.total
        } else {
          ElMessage.error(res.data.msg)
        }
      }).finally(()=>{isLodding.value = false})
  }
  asyncData()

  //获取问题装备型号 数据  数结构
  const selectEquipmentIdsList: any = useDataFillds(
    '/equipment/getTreeList',
    null
  )
  // 演习任务下拉数据
  const taskSelectList: any = useParamOptions(
    'conductorExerciseTask/getExerciseTaskList',
    null
  )
  const taskChange = (e: any) => {
    // 指派下拉列表
    if (e) {
      datas.expertGroupData = useParamOptions(
        'conductorExerciseTask/getTaskGroupList',
        form.taskId
      )
    }
  }
  const groupChange = () => {
    datas.expertData = useExpertGroupOptions(
      'conductorExerciseTask/getTaskGroupUserList',
      form.managementGroupId
    )
  }

  // 关闭问题弹框 start
    const issueRecordId = ref<number>() // 要关闭的问题编号
    const isShowCloseProblemDialog = ref(false)
    const closeProblemForm = reactive({
      supplementDescription: '', // 补充信息
    })
    const showCloseProblemDialog = (id:number) => {
      issueRecordId.value = id
      isShowCloseProblemDialog.value = true
    }
    const handleCloseProblem = () => {
      axios
        .post('/conductorIssueRecord/conductorClosedIssueRecordLog', {
          ...closeProblemForm,
          issueRecordId: issueRecordId.value
        })
        .then(res => {
          if (res.data.code === 200) {
            closeProblemForm.supplementDescription = ''
            isShowCloseProblemDialog.value = false
            asyncData()
          } else {
            ElMessage.error(res.data.msg)
          }
        })
    }
  // 关闭问题弹框 end

  //重置
  const handleReset = () => {
    currentPage.value = 1
    pageSize.value = 10
    form.taskId = ''
    form.issueCode = ''
    form.equipmentModelCode = ''
    form.occurrenceTime = ''
    form.problemLevel = ''
    form.status = ''
    form.auditStatus = ''
    form.managementId = ''
    form.managementGroupId = ''
    equipmentModelCodeSubmit.value = ''
    router.push('/problem-list')
    asyncData()
  }

  const multipleData = ref([])
  //多选合并
  const handleSelectionChange = (val: []) => {
    multipleData.value = val
  }
  //导出
  const handleEvent = () => {
    exportForm.value.submit()
  }
</script>

<style lang="scss" scoped>
  h3 {
    font-size: 19px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 30px;
    margin-left: 10px;
  }
  .container {
    padding: 20px;
    overflow-y: auto;
    box-sizing: border-box;
    .title {
      font-size: 16px;
      color: #454545;
      font-weight: 500;
      margin-bottom: 16px;
    }
    .filter-container {
      :deep(.el-form-item--small.el-form-item) {
        margin-bottom: 8px;
      }
    }
    .control-button {
      margin: 8px 0;
    }
    :deep(.el-table__header-wrapper tr th) {
      background-color: #f2f2f4;
      font-weight: bold;
      color: #3f4a4d;
    }
  }
  </style>
  <style>
  .quesition-list .el-date-editor.el-input,
  .quesition-list .el-date-editor.el-input__inner {
    width: 160px;
  }
</style>
