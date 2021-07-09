<template>
  <!-- 添加/编辑用户弹出框 -->
  <!-- 第二种解决方法 采用第二种 -->
  <div v-if="isShowAddUser">
    <!-- <el-dialog :title="operTypeUser ? '编辑用户' : '添加用户'" top="20vh" width="500px" v-model="visible" :before-close="handleClose"> 第一种解决方法 -->
    <el-dialog
      :title="operTypeUser + '用户'"
      top="20vh"
      width="500px"
      v-model="isShowAddUser"
      :before-close="handleClose"
    >
      <el-form
        ref="addUserRef"
        :rules="addUseRules"
        label-suffix="："
        label-width="110px"
        :model="addUserForm"
      >
        <el-form-item label="用户名" prop="loginName">
          <el-input
            v-model="addUserForm.loginName"
            size="medium"
            placeholder="请输入用户名"
            autocomplete="off"
            :disabled="operTypeUser === '查看'"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="operTypeUser === '添加'"
          label="密码"
          prop="password"
          :rules="{
            required: true,
            validator: validatePass1,
            trigger: 'blur'
          }"
        >
          <el-input
            v-model="addUserForm.password"
            size="medium"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="operTypeUser === '添加'"
          label="请重复密码"
          prop="repeatPassword"
          :rules="{
            validator: validateConfirmPass1,
            trigger: 'blur',
            required: true
          }"
        >
          <el-input
            v-model="addUserForm.repeatPassword"
            size="medium"
            type="password"
            placeholder="请再输入密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input
            v-model="addUserForm.name"
            size="medium"
            autocomplete="off"
            :disabled="operTypeUser === '查看'"
            placeholder="请输入真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="troopIdList">
          <el-cascader
            :disabled="operTypeUser === '查看'"
            v-model="addUserForm.troopIdList"
            filterable
            :show-all-levels="false"
            :props="{ label: 'name', children: 'children', value: 'id' }"
            :options="troopIdLis"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="权限分组" prop="roleId" class="roleId">
          <el-select
            v-model="addUserForm.roleId"
            size="medium"
            filterable
            clearable
            :disabled="operTypeUser === '查看'"
          >
            <el-option
              v-for="item in roleList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联络地址" prop="address">
          <el-input
            v-model="addUserForm.address"
            placeholder="请输入联络地址"
            size="medium"
            :disabled="operTypeUser === '查看'"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="联络电话" prop="tel">
          <el-input
            v-model="addUserForm.tel"
            size="medium"
            :disabled="operTypeUser === '查看'"
            autocomplete="off"
            placeholder="请输入联络电话"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from 'vue'

export default defineComponent({
  props: {
    from: {
      type: String,
      default: 'userManage'
    },
    operTypeUser: {
      type: String,
      default: ''
    },
    isShowAddUser: {
      type: Boolean,
      default: false
    },
    addUserForm: {
      type: Object,
      default: () => ({})
    },
    addUseRules: {
      type: Object,
      default: () => ({})
    },
    roleList: {
      type: Array,
      default: () => []
    },
    troopIdLis: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:isShowAddUser', 'handleAdd', 'closeDialog'],
  setup(props, { emit }) {
    const addUserRef = ref()
    /* 因为 isShowAddUser 是只读的 通过v-model操作时 会报错 俩种解决方法
     1 所有定义一个计算属性来控制显示  visible
     2 外面包裹一个盒子 使用v-if控制
      const visible = computed({
        get() {
          return props.isShowAddUser
        },
        set(value: boolean) {
          emit('update:isShowAddUser', value)
        }
      })
    */
    const addUser = () => {
      addUserRef.value.validate((valid: boolean) => {
        if (valid) {
          if (props.operTypeUser === '查看') {
            emit('handleAdd', 2)
          } else {
            emit('handleAdd', 1)
          }
        }
      })
    }
    watch(
      () => props.isShowAddUser,
      () => {
        addUserRef.value?.resetFields()
      }
    )

    const handleClose = () => {
      addUserRef.value?.resetFields()
      emit('closeDialog')
    }

    const validatePass1 = (
      _: any,
      value: string,
      callback: (errors?: any) => void
    ) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('请输入6-20位的密码'))
      } else {
        if (props.addUserForm.repeatPassword) {
          addUserRef.value?.validateField('repeatPassword')
        }
        callback()
      }
    }
    const validateConfirmPass1 = (
      _: any,
      value: string,
      callback: (errors?: any) => void
    ) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('请输入6-20位的密码'))
      } else if (value !== props.addUserForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      addUserRef,
      addUser,
      handleClose,
      validatePass1,
      validateConfirmPass1
    }
  }
})
</script>

<style>
.roleId .el-form-item__content .el-select--medium {
  width: 100%;
}
</style>
