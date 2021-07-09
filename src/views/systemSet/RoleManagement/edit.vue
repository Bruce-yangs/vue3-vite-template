<template>
  <div class="common-check-container drill-detail-edit">
    <div class="breadcrumb-container">
      <i class="iconfont el-icon-arrow-left" @click="router.go(-1)"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/role-manage' }">
          角色管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ titleNames }}
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
        >
          <div>
            <div class="common-two-box">
              <el-form-item label="角色名称">
                {{ datas.groupName }}
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="角色描述">
                {{ datas.groupRemark }}
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="成员">
                <el-select
                  v-if="action === 'edit'"
                  v-model="datas.userIdList"
                  filterable
                  multiple
                  clearable
                >
                  <el-option
                    v-for="item in userList"
                    :label="item.name"
                    :value="item.id"
                    :key="item.id"
                  ></el-option>
                </el-select>
                <span v-else>{{ datas.userNames }}</span>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="common-footer">
          <el-button plain @click="goBack">返回</el-button>
          <el-button
            type="primary"
            @click="handleSave"
            class="viewBottom"
            v-if="action === 'edit'"
          >
            保存
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAsyncData, useDataUserList } from './hooks'
import axios from '../../../utils/request'

const router = useRouter()
const route = useRoute()
const formRef = ref()
let userList = ref([])

const action = route.params.action
const params = route.query
const title = {
  edit: '成员管理',
  check: '查看详情'
}
const datas = reactive({
  groupName: '', // 角色名称
  id: params.id, // 角色分类
  groupRemark: '',
  userNames: '',
  userIdList: [] //选中节点
})
const titleNames = title[action as keyof typeof title]

//成员下拉数据
userList = useDataUserList()

//回显数据
const asyncGetDetailData = () => {
  const info = useAsyncData(params.id as number)
  info(res => {
    Object.assign(datas, res)
  })
}
asyncGetDetailData()

const asyncSave = () => {
  axios
    .post('/conductorProcessGroup/updateGroupUser', { ...datas })
    .then(res => {
      if (res.data.code === 200) {
        ElMessage.success('保存成功')
        router.push('/role-manage')
      } else {
        ElMessage.error(res.data.msg)
      }
    })
}
// 1：保存 事件 ； 2：保存并提交至组长 事件
const handleSave = () => {
  asyncSave()
}

// 返回事件
const goBack = () => {
  router.go(-1)
}
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
</style>
