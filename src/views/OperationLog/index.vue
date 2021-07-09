<template>
  <div class="container">
    <p class="title">操作日志</p>
    <el-card shadow="never">
      <el-form
        :inline="true"
        label-width="100px"
        :model="form"
        label-suffix="："
        class="filter-container"
        ref="formRef"
      >
        <el-form-item label="选择日期" >
          <el-col :span="10">
            <el-form-item prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                style="width:auto"
                placeholder="开始日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line mx-3" :span="2">至</el-col>
          <el-col :span="10">
            <el-form-item prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                style="width:auto"
                type="date"
                placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="操作者" prop="flightNumbers">
          <el-select v-model="form.loginName" filterable clearable>
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="动作" prop="flightNumbers">
          <!-- multiple collapse-tags -->
          <el-select v-model="form.operType" filterable clearable>
            <el-option
              v-for="item in operList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块" prop="operModul">
          <el-select v-model="form.operModul" filterable clearable>
            <el-option
              v-for="item in operModulList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="asyncData">查询</el-button>
          <el-button plain @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="control-button">
        <el-button type="primary" @click="download">导出表单</el-button>
      </div> -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column
          prop="createTime"
          label="时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="operIp"
          label="IP"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="loginName"
          label="操作者"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="operTypeDesc"
          label="动作"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="operModelDesc"
          label="模块"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="operDesc"
          label="具体操作"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <Pagination
        :total="total"
        v-model:page="currentPage"
        v-model:limit="pageSize"
        @pagination="asyncData"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import axios from '../../utils/request'
import Pagination from '../../components/Pagination.vue'

interface Form {
  startDate: string
  endDate: string
  operType: string | number
  operModul: string
  loginName: string
}

const formRef = ref()
const tableData = ref([])
const form = reactive<Form>({
  startDate: '',
  endDate: '',
  operType: '',
  operModul: '',
  loginName: ''
})
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const asyncData = () => {
  if (form.endDate < form.startDate) return ElMessage.error('结束时间不得小于开始时间')
  axios
    .get('/oprlog/listOprLog', {
      params: {
        ...form,
        startDate: form.startDate
          ? dayjs(form.startDate).format('YYYY-MM-DD')
          : form.startDate,
        endDate: form.endDate
          ? dayjs(form.endDate).format('YYYY-MM-DD')
          : form.endDate,
        pageNum: currentPage.value,
        pageSize: pageSize.value
      }
    })
    .then((res: any) => {
      if (res.data.code === 200) {
        tableData.value = res.data.data.list || []
        total.value = res.data.data.total
      } else {
        ElMessage.error(res.data.msg)
      }
    })
}
asyncData()

// 获取下拉
const asyncDataList = (type: number) => {
  const data = ref([])
  const url =
    type === 1 ? '/oprlog/getOperTypeList' : '/oprlog/getOperModelList'
  axios.get(url).then(res => {
    if (res.data.code === 200) {
      data.value = res.data.data || []
    } else {
      ElMessage.error(res.data.msg)
    }
  })
  return data
}

// 动作
const operList = asyncDataList(1)
// 模块
const operModulList = asyncDataList(2)

const userList = ref<
  {
    id: number
    name: string
  }[]
>([])
const asyncUserList = () => {
  axios.get('/managementUser/getLoginNameOrNameList?type=1').then(res => {
    if (res.data.code === 200) {
      userList.value = res.data.data
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}
asyncUserList()

const download = () => {
  axios
    .request({
      url: '/flightTracker/download',
      method: 'get',
      params: {
        ...form
      },
      responseType: 'blob'
    })
    .then(res => {
      // const blob = new Blob([res.data], {
      //   type: 'application/vnd.ms-excel;charset=UTF-8'
      // })
      // const task = tasks.value.find(item => item.id === form.taskId)
      // const currentTime = dayjs().format('YYYYMMDDHHmmss')
      // const fileName = task?.name + currentTime
      // const elink = document.createElement('a')
      // elink.download = fileName + '.xlsx'
      // elink.style.display = 'none'
      // elink.href = URL.createObjectURL(blob)
      // document.body.appendChild(elink)
      // elink.click()
      // URL.revokeObjectURL(elink.href) // 释放URL 对象
      // document.body.removeChild(elink)
    })
}

const handleReset = () => {
  form.startDate = ''
  form.endDate = ''
  form.operType = ''
  form.operModul = ''
  form.loginName = ''
  currentPage.value = 1
  asyncData()
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
}
</style>
