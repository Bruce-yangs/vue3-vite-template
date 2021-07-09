<template>
  <div class="problemReport">
    <div class="breadcrumb-container">
      <!-- <i class="iconfont el-icon-arrow-left" @click="router.go(-1)"></i> -->
      <el-breadcrumb separator="/">
        <!-- <el-breadcrumb-item :to="{ path: '/problem-list' }">
          问题管理
        </el-breadcrumb-item> -->
        <el-breadcrumb-item>
          问题装备统计
          <!-- route.params.id ? "编辑" : "添加" -->
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="problem-common-box" style="padding-top:0">
      <div class="title">
        <!-- <h4>装备问题统计报表</h4> -->
        <el-form
          style="display: flex;"
          :model="form"
          label-width="160px"
          label-suffix="：">
          <div class="common-item-box">
            <el-form-item label="演习任务" prop="taskId">
              <el-select
                v-model="form.taskId"
                filterable
                clearable>
                <el-option
                  v-for="(item) in taskSelectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="装备型号" >
              <el-cascader
                :show-all-levels="false"
                v-model="form.modelCode" clearable 
                :options="selectEquipmentIdsList"
                :props="{ label: 'name', children: 'children', value: 'code'}"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="" >
              <el-button type="primary" @click="search"  class="viewBottom">
                查询
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <h4>{{form.problemEquipmentInfo}}</h4>
      <div class="problem-common-box">
        <div class="common-two-box">
          <div class="no-data mr-5" style="flex: 2">
            <div id="myChart1" style="width: 100%; height:400px"></div>
            <img v-if="equipmentProblemStatisticsData.title && !(equipmentProblemStatisticsData.data?.length>0)" src="../../assets/no-data.png" alt="">
          </div>
          <div class="no-data mr-5" style="flex: 1">
            <div id="myChart2" style="width: 100%; height:400px"></div>
            <img v-if="disposalIssuesStatisticsData.title && !(disposalIssuesStatisticsData.data?.length>0)" src="../../assets/no-data.png" alt="">
          </div>
        </div>
        <div class="common-two-box">
          <div class="no-data mr-5" style="flex: 2">
            <div id="myChart3" style="width: 100%; height:400px"></div>
            <img v-if="problemClassificationStatisticsData.title && !(problemClassificationStatisticsData.data?.length>0)" src="../../assets/no-data.png" alt="">
          </div>
          <div class="no-data mr-5" style="flex: 1">
            <div id="myChart4" style="width: 100%; height:400px"></div>
            <img v-if="problemZeroStatisticsData.title && !(problemZeroStatisticsData.data?.length>0)" src="../../assets/no-data.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    reactive,
    onMounted,
    watch,
    nextTick,
    onUnmounted
  } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import axios from '../../utils/request'
  import { useParamOptions, useDataFillds } from './hooks'
  import { debounce } from '../../utils/tools'
  import * as echarts from 'echarts/lib/echarts'
  import { BarChart, PieChart } from 'echarts/charts'
  import {
    GridComponent,
    LegendComponent,
    TooltipComponent,
    TitleComponent,
    DataZoomComponent
  } from 'echarts/components'
  // 注意，新的接口中默认不再包含 Canvas 渲染器，需要显示引入，如果需要使用 SVG 渲染模式则使用 SVGRenderer
  import { CanvasRenderer } from 'echarts/renderers'
  echarts.use([
    BarChart,
    PieChart,
    GridComponent,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    TitleComponent,
    DataZoomComponent
  ])

  export default defineComponent({
    setup() {
      const router = useRouter()
      const route = useRoute()
      const formRef = ref()
      const tableData = ref()
      const form = reactive<any>({
        taskId: '',
        modelCode: [],
      })


      // 获取echarts统计数据
      // 各单位发现问题统计
      let myChart1: any = null
      let equipmentProblemStatisticsData: any = ref({})
      // 演习阶段发生问题归零统计
      let myChart2: any = null
      let disposalIssuesStatisticsData: any = ref({})
      // 具体装备发现问题统计
      let myChart3: any = null
      let problemZeroStatisticsData: any = ref({})
      // 装备问题分类
      let myChart4: any = null
      let problemClassificationStatisticsData: any = ref({})
      let requestUrl = ['conductor/statistics/unitLevel', 'conductor/statistics/partStatus' , 'conductor/statistics/equipmentLevel' , 'conductor/statistics/issueType']
      const GetStatisticsData = (url:string, index:number, form:any) => {
        axios
          .get(url, {
            params: {...form, modelCode:  Array.isArray(form.modelCode) ? form.modelCode[form.modelCode.length-1] : ''}
          })
          .then(res => {
            if (res.data.code === 200) {
              // 演习中装备发现问题情况
              if (index === 0) {
                equipmentProblemStatisticsData.value = res.data.data
                myChart1 = drawLine('myChart1', equipmentProblemStatisticsData.value.title, '', equipmentProblemStatisticsData.value.data, equipmentProblemStatisticsData.value.xData)
              }
              // 各专家组分析问题情况
              if (index === 1) {
                disposalIssuesStatisticsData.value = res.data.data
                myChart2 = drawLine('myChart2', disposalIssuesStatisticsData.value.title, '', disposalIssuesStatisticsData.value.data, disposalIssuesStatisticsData.value.xData)
              }
              // 装备发生问题分类统计
              if (index === 2) {
                problemClassificationStatisticsData.value = res.data.data
                myChart3 = drawLine('myChart3', problemClassificationStatisticsData.value.title, '', problemClassificationStatisticsData.value.data, problemClassificationStatisticsData.value.xData)
              }
              // 演习阶段发生问题归零统计
              if (index === 3) {
                problemZeroStatisticsData.value = res.data.data
                myChart4 = drawPie('myChart4', problemZeroStatisticsData.value.title, problemZeroStatisticsData.value)
              }
            } else {
              ElMessage.error(res.data.msg)
            }
          })
      }
      // 演习任务下拉数据
      const taskSelectList: any  = useParamOptions('conductorExerciseTask/getExerciseTaskList', null)
      //获取问题装备型号 数据  树结构
      const selectEquipmentIdsList: any  = useDataFillds('/equipment/getTreeList', null)
      // 查询数据
      const search = () => {
        if(!form.taskId && !(form.modelCode?.length)) {
          ElMessage.error('请选择演习任务或装备型号')
          return
        }
        // 改变数据后  销毁对应的 echart 再重新绘制
        myChart1 && myChart1.dispose()
        myChart2 && myChart2.dispose()
        myChart3 && myChart3.dispose()
        myChart4 && myChart4.dispose()
        requestUrl.forEach((item, index) => {
          GetStatisticsData(item, index, form)
        })
      }
      
      
      // 问题分类统计 饼状图
      const drawPie = (dom: string, title: string, seriesData: any) => {
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById(dom))
        // 绘制图表
        myChart.setOption({
          title: {
            text: title,
            subtext: '',
            top: 'top'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
          },
          series: seriesData
        })
        return myChart
      }
      // 问题归零统计 / 各单位发现问题统计 / 具体装备发生问题统计 柱状图
      const drawLine = (
        dom: string,
        title: string,
        title1: string,
        seriesData: any,
        xAxisData: any
      ) => {
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById(dom))
        // 绘制图表
        myChart.setOption({
          title: {
            text: title,
            subtext: title1,
            top: 'top'
          },
          legend: {
            left: 'right',
            // left: dom === 'myChart' ? 'right' : 'center',
            // top: dom === 'myChart' ? 'center' : null,
            align: 'left'
          },
          grid: {
            left: '0',
            right: '12%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {},
          dataset: {},
          xAxis: { type: 'category', data: xAxisData },
          yAxis: {},
          dataZoom: [
            {
              type: 'slider',
              show: xAxisData?.length>6,
              xAxisIndex: [0],
              start: 0,
              end: 100
            }
          ],
          series: seriesData
        })
        return myChart
      }
      const onResize = () => {
        myChart2 ? myChart2.resize() : null
        myChart4 ? myChart4.resize() : null
        myChart1 ? myChart1.resize() : null
        myChart3 ? myChart3.resize() : null
      }
      onMounted(() => {
        nextTick(() => {
          window.addEventListener('resize', debounce(onResize, 500))
        })
      })
      onUnmounted(() => {
        window.removeEventListener('resize', onResize)
      })

      return {
        router,
        tableData,
        form,
        formRef,
        taskSelectList,
        selectEquipmentIdsList,
        equipmentProblemStatisticsData,
        disposalIssuesStatisticsData,
        problemZeroStatisticsData,
        problemClassificationStatisticsData,
        search,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .problemReport {
    padding: 30px;
    overflow-y: auto;
    box-sizing: border-box;
    .problem-common-box {
      padding-top: 18px;
      box-sizing: border-box;
      background-color: #f5f5f5;
      .title {
        background-color: #fff;
        padding-top: 20px;
        h4 {
          font-size: 19px;
          font-weight: bold;
          margin-bottom: 18px;
          margin-left: 60px;
        }
      }
    }
    .common-two-box {
      margin-bottom: 20px;
    }
    .common-two-box:last-child {
      margin-bottom: 0px;
    }
    .no-data {
      position: relative;
      background-color: #fff;
      padding: 20px;
      box-sizing: border-box;
      img {
        position: absolute;
        top: 50%;
        left:50%;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
