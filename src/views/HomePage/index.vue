<template>
  <div class="HomePage">
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="wrapper-content">
      <div class="left-content">
        <div class="problem-overview">
          <h4>饭量总览</h4>
          <div class="overview-data">
            <div class="overview-data-item">
              <span>吃不饱 {{ problemSummaryData.waitResolve }}</span>
            </div>
            <div class="overview-data-item">
              <span>没吃饱 {{ problemSummaryData.toBeVerified }}</span>
            </div>
            <div class="overview-data-item">
              <span>吃撑了 {{ problemSummaryData.total }}</span>
            </div>
          </div>
        </div>
        <div class="problem-collection no-data">
          <div id="myChart" style="width: 100%; height: 400px"></div>
          <img
            v-if="
              equipmentProblemStatisticsData.title &&
                !(equipmentProblemStatisticsData.data?.length > 0)
            "
            src="../../assets/no-data.png"
            alt=""
          />
        </div>
        <div class="problem-collection no-data">
          <div
            id="myChart2"
            class="right-content-item"
            style="width: 100%; height: 400px"
          ></div>
          <img
            v-if="
              disposalIssuesStatisticsData.title &&
                !(disposalIssuesStatisticsData.data?.length > 0)
            "
            src="../../assets/no-data.png"
            alt=""
          />
        </div>
      </div>
      <div class="right-content">
        <div class="right-content-item no-data">
          <div id="myChart3" style="width: 100%; height:100%"></div>
          <img
            v-if="
              problemClassificationStatisticsData.title &&
                !(problemClassificationStatisticsData.data?.length > 0)
            "
            src="../../assets/no-data.png"
            alt=""
          />
        </div>
        <div class="right-content-item mt-6 no-data">
          <div id="myChart4" style="width: 100%; height:100%"></div>
          <img
            v-if="
              problemZeroStatisticsData.title &&
                !(problemZeroStatisticsData.data?.length > 0)
            "
            src="../../assets/no-data.png"
            alt=""
          />
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
  onUnmounted,
  nextTick
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import axios from '../../utils/request'
import { debounce } from '../../utils/tools'
import * as echarts from 'echarts/core'
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
  GridComponent,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
  PieChart,
  TitleComponent,
  DataZoomComponent
])

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    // 问题概括
    const problemSummaryData = reactive<any>({})
    // 问题概括数据获取
    const getProblemSummaryData = () => {
      axios
        .get('conductor/home/issueCount', {
          params: {}
        })
        .then(res => {
          if (res.data.code === 200) {
            Object.assign(problemSummaryData, res.data.data)
          } else {
            ElMessage.error(res.data.msg)
          }
        })
    }
    getProblemSummaryData()

    // 获取echarts统计数据
    // 各装备型号发生问题等级统计
    let myChart: any = null
    const equipmentProblemStatisticsData: any = ref({
      data: [
        {
          barMaxWidth: 30,
          data: [0],
          name: '小',
          stack: null,
          type: 'bar'
        },
        {
          barMaxWidth: 30,
          data: [2],
          name: '中',
          stack: null,
          type: 'bar'
        },
        {
          barMaxWidth: 30,
          data: [0],
          name: '大',
          stack: null,
          type: 'bar'
        }
      ],
      title: '各工具级别统计',
      xData: ['无敌大炮']
    })
    // 各参演部队问题分析情况
    let myChart2: any = null
    const disposalIssuesStatisticsData: any = ref({
      data: [
        {
          barMaxWidth: 30,
          data: [1],
          name: '已处置',
          stack: null,
          type: 'bar'
        },
        {
          barMaxWidth: 30,
          data: [1],
          name: '未处置',
          stack: null,
          type: 'bar'
        }
      ],
      title: '各大武林帮派情况',
      xData: ['复仇者联盟']
    })
    // 发生问题装备的分类统计
    let myChart3: any = null
    const problemClassificationStatisticsData: any = ref({
      data: [
        {
          name: '无敌大汉堡',
          value: 1
        },
        {
          name: '芝士夹心披萨',
          value: 2
        }
      ],
      radius: '60%',
      title: '吃多少分类统计',
      type: 'pie'
    })
    // 演习各阶段中发现问题归零统计
    let myChart4: any = null
    const problemZeroStatisticsData: any = ref({
      data: [
        {
          barMaxWidth: 30,
          data: [2],
          name: '没吃饱',
          stack: null,
          type: 'bar'
        }
      ],
      title: '成长过程统计',
      xData: ['成长阶段']
    })
    const requestUrl = [
      'conductor/home/levelTop',
      'conductor/home/unitIssue',
      'conductor/home/issueType',
      'conductor/home/partStatus'
    ]

    const drawLine = (
      dom: string,
      title: string,
      seriesData: any,
      xAxisData: any
    ) => {
      console.log(22)
      // 基于准备好的dom，初始化echarts实例
      const chartRef = document.getElementById(dom)
      if (!chartRef) return
      myChart = echarts.init(chartRef)
      // 绘制图表
      myChart.setOption({
        title: {
          text: title,
          top: 'top'
        },
        legend: {
          left: 'right',
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
            show: xAxisData?.length > 6,
            xAxisIndex: [0],
            start: 0,
            end: 100
          }
        ],
        series: seriesData
      })
      return myChart
    }

    const GetStatisticsData = (url: string, index: number) => {
      axios
        .get(url, {
          params: {}
        })
        .then(res => {
          if (res.data.code === 200) {
            // 各装备型号发生问题等级统计
            if (index === 0) {
              equipmentProblemStatisticsData.value = res.data.data
              myChart = drawLine(
                'myChart',
                equipmentProblemStatisticsData.value.title,
                equipmentProblemStatisticsData.value.data,
                equipmentProblemStatisticsData.value.xData
              )
            }
            // 各参演部队问题分析情况
            if (index === 1) {
              disposalIssuesStatisticsData.value = res.data.data
              myChart2 = drawLine(
                'myChart2',
                disposalIssuesStatisticsData.value.title,
                disposalIssuesStatisticsData.value.data,
                disposalIssuesStatisticsData.value.xData
              )
            }
            // 发生问题装备的分类统计
            if (index === 2) {
              problemClassificationStatisticsData.value = res.data.data
              myChart3 = drawPie(
                'myChart3',
                problemClassificationStatisticsData.value.title,
                problemClassificationStatisticsData.value
              )
            }
            // 演习各阶段中发现问题归零统计
            if (index === 3) {
              problemZeroStatisticsData.value = res.data.data
              myChart4 = drawLine(
                'myChart4',
                problemZeroStatisticsData.value.title,
                problemZeroStatisticsData.value.data,
                problemZeroStatisticsData.value.xData
              )
            }
          } else {
            ElMessage.error(res.data.msg)
          }
        })
    }
    //循环处理数据???
    // requestUrl.forEach((item, index) => {
    //   GetStatisticsData(item, index)
    // })
    const drawPie = (ele: any, title: string, data: any) => {
      // 基于准备好的dom，初始化echarts实例
      let chart = ele === 'myChart2' ? myChart2 : myChart3
      const ECHARTS = document.getElementById(ele)
      if (!ECHARTS) return
      chart = echarts.init(ECHARTS)
      // 绘制图表
      chart.setOption({
        title: {
          text: title,
          left: 20,
          top: 14
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20
        },
        series: data
      })
      return chart
    }
    const onResize = () => {
      myChart ? myChart.resize() : null
      myChart2 ? myChart2.resize() : null
      myChart3 ? myChart3.resize() : null
    }
    onMounted(() => {
      nextTick(() => {
        window.addEventListener('resize', debounce(onResize, 500))
      })

      myChart = drawLine(
        'myChart',
        equipmentProblemStatisticsData.value.title,
        equipmentProblemStatisticsData.value.data,
        equipmentProblemStatisticsData.value.xData
      )

      myChart2 = drawLine(
        'myChart2',
        disposalIssuesStatisticsData.value.title,
        disposalIssuesStatisticsData.value.data,
        disposalIssuesStatisticsData.value.xData
      )

      myChart3 = drawPie(
        'myChart3',
        problemClassificationStatisticsData.value.title,
        problemClassificationStatisticsData.value
      )

      myChart4 = drawLine(
        'myChart4',
        problemZeroStatisticsData.value.title,
        problemZeroStatisticsData.value.data,
        problemZeroStatisticsData.value.xData
      )
    })
    onUnmounted(() => {
      window.removeEventListener('resize', onResize)

      // 销毁页面时销毁echarts  并且重新赋值
      myChart && myChart.dispose()
      myChart2 && myChart2.dispose()
      myChart3 && myChart3.dispose()
      myChart4 && myChart4.dispose()
      myChart = null
      myChart2 = null
      myChart3 = null
      myChart4 = null
    })

    return {
      router,
      problemSummaryData,
      equipmentProblemStatisticsData,
      disposalIssuesStatisticsData,
      problemClassificationStatisticsData,
      problemZeroStatisticsData
    }
  }
})
</script>

<style lang="scss" scoped>
.HomePage {
  padding: 0 30px 30px 30px;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: #f5f5f5;

  .problem-overview {
    padding: 18px;
    padding-top: 18px;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 3px;
    h4 {
      font-weight: bold;
      margin-bottom: 18px;
      font-size: 16px;
    }
    .overview-data {
      display: flex;
      align-items: center;
      .overview-data-item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 56px;
        flex: 1;
        border-radius: 3px;
        background-color: #ff9844;

        span {
          position: relative;
          color: #fff;
        }
        span:before {
          position: absolute;
          content: '·';
          font-size: 26px;
          color: #d34e3b;
          left: -14px;
          top: -10px;
          font-weight: bold;
        }
        &:nth-child(2) {
          flex: 1;
          background-color: #5b8ff9;
          margin: 0 1%;
          span:before {
            color: #44c391;
          }
        }
        &:nth-child(3) {
          flex: 1;
          background-color: #5ad8a6;
          margin: 0 1%;

          span:before {
            color: #4277e1;
          }
        }
      }
    }
  }
  .problem-collection {
    margin-top: 18px;
    padding: 18px 18px 35px 18px;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 3px;
    background-color: #fff;
    h4 {
      font-weight: bold;
      margin-bottom: 18px;
      font-size: 16px;
    }
  }
  .problem-record {
    margin: 18px 0;
    padding: 18px;
    padding-top: 18px;
    background-color: #fff;
    box-sizing: border-box;
    h4 {
      font-weight: bold;
      margin-bottom: 18px;
    }
  }
  .wrapper-content {
    display: flex;
    width: 100%;
    .left-content {
      flex: 2;
    }
    .right-content {
      flex: 1;
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      .right-content-item {
        flex: 1;
        background-color: #fff;
        border-radius: 3px;
        padding: 20px;
        box-sizing: border-box;
      }
    }
  }
  .no-data {
    position: relative;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
<style>
.HomePage .el-table {
  width: 100%;
}
.HomePage .el-table__header-wrapper table,
.HomePage .el-table__body-wrapper table {
  width: 100% !important;
}
.HomePage .el-table__body,
.HomePage .el-table__footer,
.HomePage .el-table__header {
  table-layout: auto;
}
</style>
