<template>
  <div class="container">
    <p class="title">用户管理</p>
    <el-card shadow="never">
      <el-form
        :inline="true"
        :model="form"
        label-suffix="："
        class="filter-container"
        label-width="90px"
      >
        <el-form-item label="用户名">
          <el-select v-model="form.loginNameId" filterable clearable>
            <el-option
              v-for="item in userList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-select v-model="form.nameId" filterable clearable>
            <el-option
              v-for="item in nameIdList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.roleId" size="medium" filterable clearable>
            <el-option
              v-for="item in roleList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-button class="ml-6" type="primary" @click="asyncData">
          查询
        </el-button>
        <el-button plain @click="handleReset">重置</el-button>
      </el-form>
      <div class="control-button">
        <!-- v-has="'drone-add'" -->
        <el-button v-has="'user_add'" type="primary" @click="showDialog('add')">
          添加
        </el-button>
      </div>
      <el-skeleton :rows="5" animated v-if="isLoading" />
      <el-table v-else :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column
          prop="loginName"
          label="用户名"
          width="180"
        ></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column label="操作" min-width="200">
          <!-- fixed="right" -->
          <template #default="scope">
            <el-button
              type="text"
              v-has="'user_check'"
              class="common-btn-text"
              @click="showDialog('check', scope.row)"
            >
              <i class="iconfont el-icon-document"></i>
              查看
            </el-button>
            <el-button
              type="text"
              v-has="'user_edit'"
              class="common-btn-text"
              @click="showDialog('edit', scope.row)"
            >
              <i class="iconfont el-icon-edit-outline"></i>
              编辑
            </el-button>
            <el-button
              type="text"
              v-has="'user_edit_pwd'"
              class="common-btn-text"
              @click="showDialog('pwd', scope.row)"
            >
              <i class="iconfont el-icon-lock"></i>
              修改密码
            </el-button>
            <el-button
              type="text"
              v-has="'user_delete'"
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
    <!-- 添加/编辑用户弹出框 组件 -->
    <addUserDialog
      form="userManage"
      v-model:operTypeUser="operType"
      v-model:isShowAddUser="isShowAddDialog"
      v-model:addUserForm="addUserForm"
      v-model:addUseRules="addUseRules"
      v-model:roleList="roleList"
      v-model:troopIdLis="TroopIdLis"
      @handleAdd="handleAdd"
      @closeDialog="closeDialog"
    />
    <el-dialog title="修改密码" v-model="passwordVisible" width="370px">
      <el-form
        :model="currentUser"
        ref="passwordFormRef"
        label-width="100px"
        label-suffix="："
        :rules="rules"
        status-icon
      >
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="currentUser.password"
            :maxlength="20"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="currentUser.confirmPassword"
            :maxlength="20"
            type="password"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirmPassword">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, getCurrentInstance, nextTick, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import Pagination from '../../../components/Pagination.vue'
import addUserDialog from '../../../components/addUserDialog.vue'
import axios from '../../../utils/request'
import {
  equipmentDeleteItem,
  addAndEditData,
  useAsyncData,
  useTreeData,
  useTroopIdLis
} from './hooks'
// import { TableItem } from './types'
import md5 from 'md5'

// 添加/编辑 用户弹出框的校验规则
let addUseRules = {
  loginName: {
    required: true,
    message: '请填写用户名'
  },
  password: {
    required: true,
    message: '请填写密码'
  },
  repeatPassword: {
    required: true,
    message: '请填写用户名'
  },
  name: {
    required: true,
    message: '请填写真实姓名'
  },
  roleId: {
    required: true,
    message: '请选择权限分组'
  },
  troopIdList: {
    required: true,
    message: '请选择单位',
    type: 'array'
  },
  address: {
    required: false
  },
  tel: {
    required: false
  }
}

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const { proxy } = getCurrentInstance()
const isLoading = ref(true)

const form = reactive({
  loginNameId: '', // 用户名称
  nameId: '', // 姓名
  roleId: '' // 角色
})
const datas = reactive({
  tableData: []
})
const { tableData } = toRefs(datas)
// 是否显示添加装备域弹出框
const isShowAddDialog = ref(false)
const operType = ref('')
// 编辑数据时的id
let editId: string | number = ''
let addUserForm = reactive({
  loginName: '', // 用户名
  name: '', // 真实姓名
  password: '', // 密码
  repeatPassword: '', // 重复密码
  roleId: '', // 角色
  address: '', // 联络地址
  troopIdList: [], // 单位
  tel: '' // 联络电话
})

const TroopIdLis = useTroopIdLis()
// 获取表格
const asyncData = () => {
  isLoading.value = true
  axios
    .get('/conductorUser/getListUserVo', {
      params: {
        ...form,
        // roleId: Array.isArray(form.roleId)
        //   ? form.roleId[form.roleId.length - 1]
        //   : form.roleId,
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
    })
    .finally(() => {
      isLoading.value = false
    })
}
asyncData()

//获取下拉集合 姓名
const userList = ref([])
const nameIdList = ref([])
const useAsyncUserNameData = (id: number) => {
  axios.get('/conductorUser/getLoginNameOrNameList?type=' + id).then(res => {
    if (res.data.code === 200) {
      if (id === 1) {
        userList.value = res.data.data
      } else {
        nameIdList.value = res.data.data
      }
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}
useAsyncUserNameData(1)
useAsyncUserNameData(2)

const roleList = useTreeData()
// 重置数据
const handleReset = () => {
  form.loginNameId = ''
  form.nameId = ''
  form.roleId = ''
  currentPage.value = 1
  asyncData()
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
      equipmentDeleteItem(id).then(res => {
        if (res) asyncData()
      })
    })
}

//修改密码
const passwordVisible = ref(false)
const passwordFormRef = ref()
const currentUser = reactive({
  password: '',
  confirmPassword: ''
})
const validatePass = (
  _: any,
  value: string,
  callback: (errors?: any) => void
) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 20) {
    callback(new Error('请输入6-20位的密码'))
  } else {
    if (passwordVisible.value && currentUser.confirmPassword) {
      passwordFormRef.value?.validateField('confirmPassword')
    }
    callback()
  }
}

const validateConfirmPass = (
  _: any,
  value: string,
  callback: (errors?: any) => void
) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value.length < 6 || value.length > 20) {
    callback(new Error('请输入6-20位的密码'))
  } else if (value !== currentUser.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

//修改密码校验规则
const rules = {
  password: {
    required: true,
    validator: validatePass,
    trigger: 'blur'
  },
  confirmPassword: {
    validator: validateConfirmPass,
    trigger: 'blur',
    required: true
  }
}

//保存--修改密码
const handleConfirmPassword = () => {
  passwordFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      axios
        .post('/conductorUser/updatePwdById', {
          id: editId,
          password: md5(currentUser.password)
        })
        .then(res => {
          if (res.data.code === 200) {
            passwordVisible.value = false
            ElMessage.success('修改成功')
          } else {
            ElMessage.error(res.data.msg)
          }
        })
    }
  })
}

// 关闭弹出框
const closeDialog = () => {
  isShowAddDialog.value = false
}
//添加及编辑
const handleAdd = (val) => {
  if(val === 2) {
    closeDialog()
  } else {
    addAndEditData(editId, addUserForm).then(res => {
      if (res) {
        useAsyncUserNameData(1)
        useAsyncUserNameData(2)
        asyncData()
        closeDialog()
      }
    })
  }
}
const showDialog = (type: string, item: any = {}) => {
  editId = item.id || ''
  if (type === 'pwd') {
    passwordVisible.value = true
    operType.value = ''
    passwordFormRef.value?.resetFields()
  } else {
    isShowAddDialog.value = true
    // operType.value = 'false'
    // 如果不适用nextTick的话,  vue会异步操作 先赋值数据 再创建dom,  这样的话 关闭事件中(closeDialog)的重置结果就是下面的数据,  不会重置为 定义数据时的结果
    nextTick(() => {
      if (type === 'edit') {
        const info = useAsyncData(editId as number)
        info(res => {
          Object.assign(addUserForm, res)
        })
        operType.value = '编辑'
      } else if (type === 'check') {
        operType.value = '查看'
        const info = useAsyncData(editId as number)
        info(res => {
          Object.assign(addUserForm, res)
        })
      } else if (type === 'add') {
        operType.value = '添加'
      }
    })
  }
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
<style>
.el-overlay .el-cascader,
.el-overlay .el-cascader .el-input,
.el-overlay .el-cascader .el-input .el-input__inner {
  width: 100%;
}
</style>
