<template>
  <div class="common-check-container drill-detail-edit">
    <div class="breadcrumb-container">
      <i class="iconfont el-icon-arrow-left" @click="router.go(-1)"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/exercise-manage' }">
          演习任务
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          演习任务详情
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
          <!-- status-icon -->
          <h3>{{form.taskName}}</h3>
          <h4>基本信息</h4>
          <hr />
          <div>
            <div class="common-two-box">
              <el-form-item label="演习名称">
                <span>{{ form.taskName || '--' }}</span>
              </el-form-item>
              <el-form-item label="总导演">
                <span>{{ form.userName || "--"  }}</span>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="演习时间" class="date-picker">
                <span v-if="form.startDate">{{ form.startDate }} 至 {{ form.endDate }}</span>
                <span v-else></span>
              </el-form-item>
              <el-form-item label="演习基地">
                <span>{{ form.exerciseBase || "--"  }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="演习描述">
                <span>{{ form.exercise || "--"  }}</span>
              </el-form-item>
            </div>
            <div class="common-item-box">
              <el-form-item label="附件">
                <a class="display-block" v-for="(item, index) in form.accessoryList" :key="index" :download="item.name" :href="item.url">{{ item.name }}</a>
              </el-form-item>
            </div>
          </div>

          <h4>专家分组</h4>
          <hr />
          <div v-for="(item, index) in form.expertGroupVoList" :key="index" class="common-one-box">
            <el-form-item :label="item.groupName">
              <span>{{ item.groupMembers }}</span>
            </el-form-item>
          </div>

          <h4>参演单位</h4>
          <hr />
          <div class="common-two-box" v-for="(item, index) in form.exerciseTaskTypeInfoVoList" :key="index">
            <el-form-item :label="typeName[item.typeId]">
              <span>{{ item.troopNameAndCodes }}</span>
            </el-form-item>
            <el-form-item label="主要装备">
              <span>{{ item.equipmentNames }}</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="common-footer">
        <el-button plain @click="router.go(-1)" class="viewBottom">
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import  type { Item } from './types'
import axios from '../../utils/request'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const formRef = ref()
    const typeName: any = {'1':'红方','2':'蓝方','3':'第三方'}
    const form = reactive<any>({
      id: '',
      taskName: '演习任务', // 演习任务
      userName: '', // 总导演
      startDate: '', // 开始时间
      endDate: '', // 结束时间
      exerciseBase: '', // 演习基地
      exercise: '', // 演习描述
      discoverPeople: '', // 发现人
      accessoryList: [] , // 附件
      expertGroupVoList: [{
        groupName:'',
        groupMembers:'',
      }], // 专家分组集合
      exerciseTaskTypeInfoVoList: [{
        typeId:'',
        equipmentNames:'',
        troopNameAndCodes:''
      }], //参演单位
    })

    // 请求演习任务列表数据
    const asyncData = () => {
      const id = route.params.id
      axios
        .get('/conductorExerciseTask/getExerciseTaskAllVo?id=' + id)
        .then(res => {
          if (res.data.code === 200) {
            Object.assign(form, res.data.data)
          } else {
            ElMessage.error(res.data.msg)
          }
        })
    }
    asyncData()

    return {
      route,
      router,
      formRef,
      form,
      typeName
    }
  }
})
</script>

<style lang="scss" scoped>
.padding-container {
  padding: 30px;
  padding-top: 15px;
  h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  h4 {
    font-size: 17px;
    font-weight: bold;
  }
  hr {
    margin-bottom: 20px;
  }
  .common-one-box {
    padding-right: 30px;
    box-sizing: border-box;
  }
  // 鼠标手指样式
  .cursorPointer {
    cursor: pointer;
  }
  .display-block {
    display: block;
  }
  a.display-block {
    color: #40be8c;
    &:hover{
      text-decoration:underline;
    }
  }
  .border {
    padding: 10px;
    border: 1px solid #ccc;
  }
}
</style>
