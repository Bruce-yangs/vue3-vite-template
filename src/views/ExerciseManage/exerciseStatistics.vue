<template>
    <div class="problemReport">
      <div class="breadcrumb-container">
        <!-- <i class="iconfont el-icon-arrow-left" @click="router.go(-1)"></i> -->
        <el-breadcrumb separator="/">
          <!-- <el-breadcrumb-item :to="{ path: '/exercise-manage' }">
            演习任务
          </el-breadcrumb-item> -->
          <el-breadcrumb-item>
            演习统计报表
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
              <el-form-item label="演习任务">
                <el-select
                  v-model="form.taskId"
                  @change="handleChange"
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
            </div>
          </el-form>
        </div>
        <div class="echarts-box">
          <div class="common-two-box">
          <div class="no-data mr-5">
            <div id="myChart1" style="width: 100%; height:400px"></div>
            <img v-if="equipmentProblemStatisticsData?.total?.title && !(equipmentProblemStatisticsData?.total?.data?.length>0)" src="../../assets/no-data.png" alt="">
          </div>
          <div class="no-data mr-5">
            <div id="myChart2" style="width: 100%; height:400px"></div>
            <img v-if="equipmentProblemStatisticsData?.red?.title && !(equipmentProblemStatisticsData?.red?.data?.length>0)" src="../../assets/no-data.png" alt="">
          </div>
          <div class="no-data mr-5">
            <div id="myChart3" style="width: 100%; height:400px"></div>
            <img v-if="equipmentProblemStatisticsData?.blue?.title && !(equipmentProblemStatisticsData?.blue?.data?.length>0)" src="../../assets/no-data.png" alt="">
          </div>
          </div>
          <div class="common-two-box">
            <div class="no-data mr-5">
              <div id="myChart4" style="width: 100%; height:400px"></div>
              <img v-if="myChart4Data.title && !(myChart4Data.data?.length>0)" src="../../assets/no-data.png" alt="">
            </div>
            <div class="no-data mr-5">
              <div id="myChart5" style="width: 100%; height:400px"></div>
              <img v-if="myChart5Data.title && !(myChart5Data.data?.length>0)" src="../../assets/no-data.png" alt="">
            </div>
            <div class="no-data mr-5">
              <div id="myChart6" style="width: 100%; height:400px"></div>
              <img v-if="myChart6Data.title && !(myChart6Data.data?.length>0)" src="../../assets/no-data.png" alt="">
            </div>
          </div>
          <div class="common-two-box no-data">
            <div id="myChart7" style="width: 100%; height: 100%;"></div>
            <img v-if="myChart7Data.title && !(myChart7Data.data?.length>0)" src="../../assets/no-data.png" alt="">
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
    import { ElMessage, ElLoading } from 'element-plus'
    import axios from '../../utils/request'
    import { useParamOptions } from './hooks'
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
        const form = reactive({
          taskId: '',
        })
  
        // 获取echarts统计数据
        // 各单位发现问题统计
        let myChart1: any = null
        // 演习阶段发生问题归零统计
        let myChart2: any = null
        // 具体装备发现问题统计
        let myChart3: any = null
        let equipmentProblemStatisticsData: any = ref({})
        // 装备问题分类
        let myChart4: any = null
        let myChart4Data: any = ref({})
        let myChart5: any = null
        let myChart5Data: any = ref({})
        let myChart6: any = null
        let myChart6Data: any = ref({})
        let myChart7: any = null
        let myChart7Data: any = ref({})
        let requestUrl = ['conductor/statistics/task/phaseStatus', 'conductor/statistics/task/equipmentModel', 'conductor/statistics/issueType', 'conductor/statistics/task/unit', 'conductor/statistics/equipmentLevel']
        const GetStatisticsData = (url:string, index:number, taskId:any) => {
          axios
            .get(url, {
              params: {taskId}
            })
            .then(res => {
              if (res.data.code === 200) {
                // 演习中装备发现问题情况
                if (index === 0) {
                  equipmentProblemStatisticsData.value = res.data.data
                  for (const key in res.data.data) {
                    if (key === 'total') myChart1 = drawLine('myChart1', equipmentProblemStatisticsData.value.total.title, '', equipmentProblemStatisticsData.value.total.data, equipmentProblemStatisticsData.value.total.xData)
                    if (key === 'red') myChart2 = drawLine('myChart2', '', equipmentProblemStatisticsData.value.red.title, equipmentProblemStatisticsData.value.red.data, equipmentProblemStatisticsData.value.red.xData)
                    if (key === 'blue') myChart3 = drawLine('myChart3', '', equipmentProblemStatisticsData.value.blue.title,  equipmentProblemStatisticsData.value.blue.data, equipmentProblemStatisticsData.value.blue.xData)
                  }
                }
                if (index === 1) {
                  myChart4Data.value = res.data.data
                  myChart4 = drawPie('myChart4', myChart4Data.value.title,  myChart4Data.value)
                }
                if (index === 2) {
                  myChart5Data.value = res.data.data
                  myChart5 = drawPie('myChart5', myChart5Data.value.title, myChart5Data.value)
                }
                if (index === 3) {
                  myChart6Data.value = res.data.data
                  myChart6 = drawPie('myChart6', myChart6Data.value.title,  myChart6Data.value)
                }
                if (index === 4) {
                  myChart7Data.value = res.data.data
                  myChart7 = drawLine1('myChart7', myChart7Data.value.title, '', myChart7Data.value.data, myChart7Data.value.xData)
                }
              } else {
                ElMessage.error(res.data.msg)
              }
            })
        }
        //默认 进入页面不请求，切换页面再请求数据
        // requestUrl.forEach((item, index) => {
        //   GetStatisticsData(item, index, route.params.id)
        // })

        const handleChange = (command: any) => {
          
          if(!form.taskId) {
            ElMessage.error('请选择演习任务或装备型号')
            return
          }
          // 改变数据后  销毁对应的 echart 再重新绘制
          myChart1 && myChart1.dispose()
          myChart2 && myChart2.dispose()
          myChart3 && myChart3.dispose()
          myChart4 && myChart4.dispose()
          myChart5 && myChart5.dispose()
          myChart6 && myChart6.dispose()
          myChart7 && myChart7.dispose()
          requestUrl.forEach((item, index) => {
            GetStatisticsData(item, index, form.taskId)
          })
        }
        
        // 演习任务下拉数据
        const taskSelectList: any  = useParamOptions('conductorExerciseTask/getExerciseTaskList', null, null)
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
              orient: 'horizontal',
              right: 10,
              bottom: 10,
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
            series: seriesData
          })
          return myChart
        }
        const drawLine1 = (
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
              type: 'scroll',
              orient: 'horizontal',
              right: 10,
              bottom: 10,
            },
            grid: {
              left: '0',
              right: '12%',
              bottom: '3%',
              containLabel: true
            },
            tooltip: {},
            dataset: {},
            xAxis: {},
            yAxis: { type: 'category', data: xAxisData },
            dataZoom: [
              {
                type: 'slider',
                show: xAxisData?.length>6,
                yAxisIndex: 0,
                start: 0,
                end: 100
              }
            ],
            series: seriesData
          })
          return myChart
        }
        const onResize = () => {
          myChart1 ? myChart1.resize() : null
          myChart2 ? myChart2.resize() : null
          myChart3 ? myChart3.resize() : null
          myChart4 ? myChart4.resize() : null
          myChart5 ? myChart3.resize() : null
          myChart6 ? myChart3.resize() : null
          myChart7 ? myChart3.resize() : null
        }
        onMounted(() => {
          nextTick(() => {
            window.addEventListener('resize', debounce(onResize, 500))
          })
        })
        onUnmounted(() => {
          myChart1 && myChart1.dispose()
          myChart2 && myChart2.dispose()
          myChart3 && myChart3.dispose()
          myChart4 && myChart4.dispose()
          myChart5 && myChart5.dispose()
          myChart6 && myChart6.dispose()
          myChart7 && myChart7.dispose()

          myChart1 = null
          myChart2 = null
          myChart3 = null
          myChart4 = null
          myChart5 = null
          myChart6 = null
          myChart7 = null
          window.removeEventListener('resize', onResize)
        })
  
        return {
          router,
          tableData,
          form,
          formRef,
          taskSelectList,
          equipmentProblemStatisticsData,
          myChart4Data,
          myChart5Data,
          myChart6Data,
          myChart7Data,
          handleChange
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
      .echarts-box {
        display: flex;
        padding-top: 18px;
        padding-bottom: 20px;
        box-sizing: border-box;
        background-color: #f5f5f5;
        .common-two-box {
          width: 32%;
          display: flex;
          flex: 1;
          flex-direction: column;
          background-color: #fff;
          &:not(:last-child) {
            margin-right: 20px;
          }
        }
      }
      #myChart1, #myChart2, #myChart3, #myChart4, #myChart5, #myChart6, #myChart7 {
        background-color: #fff;
        padding: 33px;
        box-sizing: border-box;
      } 
      .no-data {
        position: relative;
        width: 100%;
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
  