<template>
  <div class="container quesition-list">
    <p class="title">演习任务</p>
    <el-card shadow="never">
      <el-form
        :inline="true"
        :model="form"
        label-suffix="："
        class="filter-container"
        label-width="100px"
      >
        <el-form-item label="演习任务">
          <el-input
            v-model="form.taskName"
            maxlength="20" clearable
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="演习代号">
          <el-input
            v-model="form.taskCode"
            maxlength="20" clearable
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="演习基地">
          <el-input
            v-model="form.exerciseBase"
            maxlength="20" clearable
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="总导演">
          <el-select v-model="form.directorId" filterable clearable>
            <el-option
              v-for="item in directorSelectList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-button class="ml-10" type="primary" @click="asyncData">
          查询
        </el-button>
        <el-button plain @click="handleReset">重置</el-button>
      </el-form>
      <div class="control-button">
        <!--  -->
        <el-button
          v-has="'task_add'"
          type="primary"
          @click="router.push('/exercise-manage/exercise-mission/add')"
        >
          添加演习
        </el-button>
        <el-button
          v-has="'task_export'"
          plain
          class="common-btn-solid"
          @click="handleEvent"
        >
          导出
        </el-button>
      </div>
      <!-- height:calc(100% - 30px) -->
      <el-skeleton :rows="5" animated v-if="isLodding" />
      <div v-else class="common-one-box mt-2">
        <el-table
          :data="tableData"
          style="width: 100%;"
          border
         
        >
        <!--  @selection-change="handleSelectionChange" -->
          <!-- <el-table-column 
            prop="id"
            type="index"
            label="ID"
            width="80"
          ></el-table-column> -->
          <el-table-column
            prop="taskName"
            min-width="160"
            label="演习任务"
          ></el-table-column>
          <el-table-column
            prop="taskCode"
            min-width="160"
            label="演习代号"
          ></el-table-column>
          <el-table-column
            prop="exerciseBase"
            min-width="160"
            label="演习基地"
          ></el-table-column>
          <el-table-column
            prop="userName"
            min-width="160"
            label="总导演"
          ></el-table-column>
          <el-table-column
            prop="startDate"
            min-width="160"
            label="开始时间"
          ></el-table-column>
          <el-table-column
            prop="endDate"
            min-width="160"
            label="结束时间"
          ></el-table-column>
          <el-table-column
            prop="problemTotalNum"
            min-width="130"
            label="发现问题总数量"
          ></el-table-column>
          <el-table-column
            min-width="90"
            label="未归零" 
          >
          <template #default="scope">
            {{ scope.row.notClosedProblemNum }}
          </template>
        </el-table-column>
          <el-table-column
            prop="majorProblemNum"
            min-width="90"
            label="重大"
          ></el-table-column>
          <el-table-column
            prop="seriousProblemNum"
            min-width="90"
            label="严重"
          ></el-table-column>
          <el-table-column
            prop="commonlyProblemNum"
            min-width="90"
            label="一般"
          ></el-table-column>

          <el-table-column label="操作" min-width="360">
            <!-- fixed="right" -->
            <template #default="scope">
              <!-- v-has="'drone-view'"  drone-modify   drone-delete'-->
              <el-button
                type="text"
                v-has="'task_check'"
                class="common-btn-text"
                @click="
                  router.push(
                    '/exercise-manage/exercise-details/' + scope.row.id
                  )
                "
              >
                <i class="iconfont el-icon-document"></i>
                查看
              </el-button>
              <el-button
                v-if="scope.row.status !== 2"
                type="text"
                v-has="'task_edit'"
                class="common-btn-text"
                @click="
                  router.push(
                    '/exercise-manage/exercise-mission/edit/' + scope.row.id+'?status='+ scope.row.status
                  )
                "
              >
                <i class="iconfont el-icon-edit-outline"></i>
                编辑
              </el-button>
              <el-button
                type="text"
                v-has="'task_delete'"
                class="common-btn-text"
                @click="handleDel(scope.row.id)"
              >
                <i class="iconfont el-icon-delete"></i>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination
        :total="total"
        v-model:page="currentPage"
        v-model:limit="pageSize"
        @pagination="asyncData"
      />
    </el-card>
    <form action="/api/conductorIssueRecord/exportConductorListIssueRecordListVo " hidden ref="exportForm" method="get">
      <input type="hidden" name="taskName" v-model="form.taskName">
      <input type="hidden" name="taskCode" v-model="form.taskCode">
      <input type="hidden" name="exerciseBase" v-model="form.exerciseBase">
      <input type="hidden" name="directorId" v-model="form.directorId">
    </form>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  getCurrentInstance,
} from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// import dayjs from 'dayjs'

import Pagination from '../../components/Pagination.vue'
import axios from '../../utils/request'
import { useParamOptions } from './hooks'
// import { Item } from './types'

const isLodding = ref(true)
// @ts-ignore
const { proxy } = getCurrentInstance()
const router = useRouter()
// const datas = reactive({
//   tableData: []
// })
const tableData = ref([])
// 查询表单数据
const form = reactive({
  taskName: '',
  taskCode: '',
  exerciseBase: '',
  directorId: ''
})
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const exportForm = ref()

const directorSelectList: any = useParamOptions(
  'conductorUser/getLoginNameOrNameList',
  2,
  2
)
// 请求演习任务列表数据
const asyncData = () => {
  isLodding.value = true
  axios
    .get('/conductorExerciseTask/listExerciseTaskListVo', {
      params: {
        ...form,
        pageNum: currentPage.value,
        pageSize: pageSize.value
      }
    })
    .then(res => {
      if (res.data.code === 200) {
        tableData.value = res.data.data.list || []
        total.value = res.data.data.total
      } else {
        ElMessage.error(res.data.msg)
      }
    }).finally(()=>{isLodding.value = false})
}
asyncData()

//重置
const handleReset = () => {
  currentPage.value = 1
  pageSize.value = 10
  form.taskName = ''
  form.taskCode = ''
  form.exerciseBase = ''
  form.directorId = ''
  asyncData()
}

// 删除
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
      axios
        .get('/conductorExerciseTask/deleteExerciseTask?id=' + id)
        .then(res => {
          if (res.data.code === 200) {
            ElMessage.success('删除成功')
            asyncData()
          } else {
            ElMessage.error(res.data.msg)
          }
        })
    })
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
  .expert-group {
    width: 400px;
    text-align: center;
    h4 {
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 20px;
    }
    li {
      margin-top: 20px;
      color: #333;
      text-align: left;
      padding-left: 35%;
      box-sizing: border-box;
      i {
        font-size: 18px;
        margin-right: 8px;
        display: none;
      }
    }
    li:hover {
      cursor: pointer;
      i {
        cursor: pointer;
        display: inline-block;
      }
    }
  }
  .add-user-dialog {
    .el-select--medium {
      width: 100%;
    }
  }
}
</style>
<style>
.quesition-list .el-date-editor.el-input,
.quesition-list .el-date-editor.el-input__inner {
  width: 160px;
}
.el-dialog .el-select {
  width: 100% !important;
}
</style>
