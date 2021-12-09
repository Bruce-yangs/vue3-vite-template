<template>
  <div class="common-container">
    <!-- <p class="title" @click="onClickCount">角色管理 {{counts}}</p> -->
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card shadow="never">
      <el-form
        :inline="true"
        :model="form"
        label-suffix="："
        label-position="top"
        class="filter-container"
        label-width="90px"
      >
        <el-form-item label="角色名称">
          <el-select v-model="form.id" filterable clearable>
            <el-option
              v-for="item in roleList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="form-submit-btns">
          <el-button class="ml-6" type="primary" @click="asyncData">
            查询
          </el-button>
          <el-button plain @click="handleReset">重置</el-button>
        </div>
      </el-form>
      <hr>
      <div class="control-button">
        <el-button v-has="'role_add'" type="primary" @click="showDialog('add')">
          添加
        </el-button>
      </div>
      <el-skeleton :rows="5" animated v-if="isLoading" />
      <el-table v-else :data="datas.tableData" border style="width: 100%">
        <el-table-column type="index" label="ID" width="180"></el-table-column>
        <el-table-column
          prop="groupName"
          label="角色名称"
          width="180"
        ></el-table-column>
        <el-table-column prop="groupRemark" label="角色描述"></el-table-column>
        <el-table-column
          prop="userNames"
          label="成员"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" min-width="200">
          <!-- fixed="right" -->
          <template #default="scope">
            <el-button
              type="text"
              v-has="'role_check'"
              class="common-btn-text"
              @click="router.push('/role-manage/check?id=' + scope.row.id)"
            >
              <i class="iconfont el-icon-document"></i>
              查看
            </el-button>
            <el-button
              type="text"
              v-has="'role_edit'"
              class="common-btn-text"
              @click="showDialog('edit', scope.row)"
            >
              <i class="iconfont el-icon-edit-outline"></i>
              编辑
            </el-button>
            <el-button
              type="text"
              v-has="'role_manage_user'"
              class="common-btn-text"
              @click="router.push('/role-manage/edit?id=' + scope.row.id)"
            >
              <i class="iconfont el-icon-edit-outline"></i>
              管理成员
            </el-button>
            <el-button
              type="text"
              v-has="'role_delete'"
              class="common-btn-text"
              @click="handleDel(scope.row.id)"
            >
              <i class="iconfont el-icon-delete"></i>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination
        :total="total"
        v-model:page="currentPage"
        v-model:limit="pageSize"
        @pagination="asyncData"
      />
    </el-card>

    <!-- 点击组内用户管理 / 系统设置-->
    <el-dialog
      :title="titleName"
      top="20vh"
      width="500px"
      v-model="isShowAddDialog"
      :before-close="closeDialog"
      :close-on-press-escape="false"
    >
      <!-- 组内用户数据显示 -->
      <el-form
        ref="formRef"
        :rules="rules"
        label-suffix="："
        label-width="100px"
        :model="dialogForm"
      >
        <el-form-item label="角色名称" prop="groupName">
          <el-input
            v-model="dialogForm.groupName"
            :disabled="isCheck"
            placeholder="请填写"
            size="medium"
            :maxLength="20"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="groupRemark">
          <el-input
            type="textarea"
            rows="4"
            resize="none"
            v-model="dialogForm.groupRemark"
            :disabled="isCheck"
            :maxLength="100"
            size="medium"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue'
// import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
// import Pagination from 'components/Pagination.vue'
// import Pagination from '../../../components/Pagination.vue'
import axios from '../../../utils/request'
import {
  addAndEditData,
  equipmentDeleteItem,
  // useAsyncTreeData,
  // commonFnTree /* useDataFillds */,
  useAsyncData,
  useDataFillds,
} from './hooks'
import { useRouter } from 'vue-router'
// 添加/编辑 用户弹出框的校验规则
const rules = {
  groupName: {
    required: true,
    message: '请填写角色名称',
  },
  groupRemark: {
    required: false,
  },
}
let counts = $ref(0)
const onClickCount = () => {
  counts++
}
// 权限设置校验
const titleDesc = { check: '查看', edit: '编辑', add: '添加' }
const sortName = { '1': '问题收集', '2': '问题分析', '3': '主管' }

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const { proxy } = getCurrentInstance()
const formRef = ref()
const isLoading = ref(true)
const router = useRouter()
const form = reactive({
  id: '', // 分组名称
})

const datas: any = reactive({
  tableData: [],
  roleList: [],
})

// 编辑数据时的id
let editId: string | number = ''
// 获取表格
const asyncData = () => {
  isLoading.value = true
  axios
    .get('/conductorProcessGroup/listProcessGroupVo', {
      params: {
        ...form,
        pageNum: currentPage.value,
        pageSize: pageSize.value,
      },
    })
    .then((res) => {
      if (res.data.code === 200) {
        datas.tableData = res.data.data.list || []
        total.value = res.data.data.total
      } else {
        // ElMessage.error(res.data.msg)
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
asyncData()
ElMessage.error('1212')

// 重置数据
const handleReset = () => {
  form.id = ''
  currentPage.value = 1
  asyncData()
}

const isCheck = ref(false) //查看时禁用
const titleName = ref('') //弹框title
//弹框数据
const dialogForm = reactive({
  groupName: '', // 角色名称
  groupRemark: '',
})

const { roleList, asyncRoleList } = useDataFillds()
// roleList = useDataFillds()
// datas.roleList = useDataFillds()

// 是否显示添加弹出框
const isShowAddDialog = ref(false)

const closeDialog = () => {
  isShowAddDialog.value = false
  formRef.value?.resetFields()
  editId = ''
  isCheck.value = false
}

const showDialog = (type: string, item: any = {}) => {
  titleName.value = titleDesc[type.toString() as keyof typeof titleDesc]
  editId = item.id || ''
  isShowAddDialog.value = true
  if (type === 'edit' || type === 'check') {
    const info = useAsyncData(editId as number)
    info((res) => {
      Object.assign(dialogForm, res)
      if (type === 'check') {
        isCheck.value = true
      }
    })
  }
}
//点击--新增或编辑
const handleAdd = () => {
  formRef.value?.validate((valid: any) => {
    if (valid) {
      addAndEditData(editId, dialogForm).then((res) => {
        if (res) {
          // datas.roleList = useDataFillds()
          asyncRoleList()

          asyncData()
          closeDialog()
        }
      })
    }
  })
}
//删除
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
      cancelButtonClass: 'common-btn-text',
    })
    .then(() => {
      equipmentDeleteItem(id).then((res) => {
        if (res) {
          asyncData()
          // datas.roleList = useDataFillds()
          asyncRoleList()
        }
      })
    })
}
</script>

<style lang="scss" scoped>
.common-container {
  // padding: 15px 24px 24px 24px;
  overflow-y: auto;
  box-sizing: border-box;
  .title {
    font-size: 16px;
    color: #454545;
    font-weight: 500;
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
<style lang="scss"></style>
