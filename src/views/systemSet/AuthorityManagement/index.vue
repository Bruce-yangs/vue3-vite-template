<template>
  <div class="container">
    <p class="title">权限管理</p>
    <el-card shadow="never">
      <el-form
        :inline="true"
        :model="form"
        label-suffix="："
        class="filter-container"
        label-width="90px"
      >
        <el-form-item label="分组名称">
          <el-cascader
            v-model="form.roleId"
            filterable
            :show-all-levels="false"
            clearable
            :props="{ label: 'name', children: 'children', value: 'id' }"
            :options="roleList"
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="角色分类">
          <el-select v-model="form.sort" filterable clearable>
            <el-option label="问题收集" value="1"></el-option>
            <el-option label="问题分析" value="2"></el-option>
            <el-option label="主管" value="3"></el-option>
          </el-select>
        </el-form-item> -->
        <el-button class="ml-6" type="primary" @click="asyncData">
          查询
        </el-button>
        <el-button plain @click="handleReset">重置</el-button>
      </el-form>
      <div class="control-button">
        <el-button
          v-has="'authority_add'"
          type="primary"
          @click="showDialog('add')"
        >
          添加
        </el-button>
      </div>
      <el-skeleton :rows="5" animated v-if="isLoading" />
      <el-table v-else :data="datas.tableData" border style="width: 100%">
        <el-table-column type="index" label="ID" width="180"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="180"
        ></el-table-column>
        <el-table-column prop="remark" label="角色描述"></el-table-column>
        <el-table-column label="角色分类">
          <template #default="scope">
            {{ sortName[scope.row.sort] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200">
          <!-- fixed="right" -->
          <template #default="scope">
            <el-button
              type="text"
              v-has="'authority_check'"
              class="common-btn-text"
              @click="showDialog('check', scope.row)"
            >
              <i class="iconfont el-icon-document"></i>
              查看
            </el-button>
            <el-button
              type="text"
              v-has="'authority_edit'"
              class="common-btn-text"
              @click="showDialog('edit', scope.row)"
            >
              <i class="iconfont el-icon-edit-outline"></i>
              编辑
            </el-button>
            <el-button
              type="text"
              v-has="'authority_delete'"
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="dialogForm.roleName"
            :disabled="isCheck"
            placeholder="请填写"
            size="medium"
            :maxLength="20"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input
            type="textarea"
            rows="4"
            resize="none"
            placeholder="请填写"
            v-model="dialogForm.remark"
            :disabled="isCheck"
            :maxLength="100"
            size="medium"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置功能">
          <div class="tree-content">
            <el-tree
              :data="treeData.data"
              show-checkbox
              default-expand-all
              ref="tree"
              class="mt-2"
              node-key="id"
              @check="onNodeClick"
              :check-strictly="true"
              :props="treeData.defaultProps"
            ></el-tree>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button
            v-show="titleName !== '查看'"
            type="primary"
            @click="handleAdd"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import Pagination from '../../../components/Pagination.vue'
import axios from '../../../utils/request'
import {
  addAndEditData,
  equipmentDeleteItem,
  useAsyncTreeData,
  commonFnTree,
  useAsyncData
} from './hooks'

// 添加/编辑 用户弹出框的校验规则
const rules = {
  roleName: {
    required: true,
    message: '请填写角色名称'
  },
  sort: {
    required: true,
    message: '请选择角色分类'
  },
  remark: {
    required: false
  }
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

const form = reactive({
  roleId: '' // 分组名称
})

const datas = reactive({
  tableData: []
})

// 编辑数据时的id
let editId: string | number = ''
// 获取表格
const asyncData = () => {
  isLoading.value = true
  axios
    .get('/conductorRole/listRoleVo', {
      params: {
        ...form,
        roleId: Array.isArray(form.roleId)
          ? form.roleId[form.roleId.length - 1]
          : form.roleId,
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

// 重置数据
const handleReset = () => {
  form.roleId = ''
  currentPage.value = 1
  asyncData()
}

const tree = ref()
const isCheck = ref(false) //查看时禁用
const titleName = ref('') //弹框title
//弹框数据
const dialogForm = reactive({
  roleName: '', // 角色名称
  sort: 2, // 角色分类
  remark: '',
  powerNos: [] //选中节点
})
//弹框数据
const treeData = reactive({
  data: [],
  defaultProps: {
    children: 'children',
    label: 'name' //??? name
  }
})

//获取角色下拉数据
const roleList = ref([])
const useDataFillds = () => {
  axios.get('/conductorRole/getRoleList').then(res => {
    if (res.data.code === 200) {
      const data = res.data.data || []
      commonFnTree(data)
      roleList.value = data
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}
useDataFillds()

// 是否显示添加弹出框
const isShowAddDialog = ref(false)
// 切换角色分类 请求不同的tree数据
const onChangeType = (val: number) => {
  const { treeSource, checkedAll } = useAsyncTreeData(val)
  treeData.data = treeSource
  nextTick(() => {
    tree.value.setCheckedKeys(checkedAll.value)
  })
  dialogForm.powerNos = checkedAll.value
}

const closeDialog = () => {
  isShowAddDialog.value = false
  formRef.value?.resetFields()
  editId = ''
  dialogForm.sort = 2
  isCheck.value = false
}

const showDialog = (type: string, item: any = {}) => {
  titleName.value = titleDesc[type.toString() as keyof typeof titleDesc]
  editId = item.id || ''
  isShowAddDialog.value = true
  if (type === 'edit' || type === 'check') {
    const info = useAsyncData(editId as number)
    info(res => {
      Object.assign(dialogForm, res)
      const { treeSource, treeDisabled } = useAsyncTreeData(item.sort)
      if (type === 'check') {
        treeData.data = treeDisabled
        isCheck.value = true
      } else {
        treeData.data = treeSource
      }
      dialogForm.powerNos = res.powerNos
      tree.value?.setCheckedKeys(res.powerNos)
    })
  } else {
    onChangeType(2)
  }
}
//点击--新增或编辑
const handleAdd = () => {
  formRef.value?.validate((valid: any) => {
    // formRef.value?.validate((valid: any) => {
    // dialogForm.powerNos = treeData.checkedPower
    if (valid) {
      addAndEditData(editId, dialogForm).then(res => {
        if (res) {
          useDataFillds()
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
      cancelButtonClass: 'common-btn-text'
    })
    .then(() => {
      equipmentDeleteItem(id).then(res => {
        if (res) asyncData()
      })
    })
}

//同步选中树的集合
const onNodeClick = (node, data) => {
  dialogForm.powerNos = data.checkedKeys
}
</script>

<style lang="scss" scoped>
.container {
  padding: 24px;
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
  .tree-content {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
  }
}
</style>
<style lang="scss"></style>
