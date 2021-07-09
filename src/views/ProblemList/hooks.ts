import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from '../../utils/request'
import { Item, ParamsOption, tree } from './types'
import { ElMessage } from 'element-plus'
// 获取 需要演习任务id 的下拉列表 
export const useParamOptions = (url:string, taskId: any) => {
  const data = ref<ParamsOption[]>([])
  const asyncData = () => {
    axios
      .get(url, {
        // eslint-disable-next-line
        params: { taskId }
      })
      .then(res => {
        if (res.data.code === 200) {
          data.value = res.data.data
        } else {
          ElMessage.error(res.data.msg)
        }
      })
  }
  asyncData()
  return data
}
// 获取需要分析专家组id的 下拉列表
export const useExpertGroupOptions = (url:string, exerciseTaskGroupId: any) => {
  const data = ref<ParamsOption[]>([])
  const asyncData = () => {
    axios
      .get(url, {
        // eslint-disable-next-line
        params: { exerciseTaskGroupId }
      })
      .then(res => {
        if (res.data.code === 200) {
          data.value = res.data.data
        } else {
          ElMessage.error(res.data.msg)
        }
      })
  }
  asyncData()
  return data
}
// 获取树数据
export const useTreeData = (url: string, taskId:any) => {
  const data = ref<tree[]>([])
  const asyncData = (url: string) => {
    axios
      .get(url, {
        // eslint-disable-next-line
        params: { taskId }
      })
      .then(res => {
        if (res.data.code === 200) {
          data.value = res.data.data || []
        } else {
          ElMessage.error(res.data.msg)
        }
      })
  }
  asyncData(url)

  return data
}

// 根据问题id 获取数据
export const useParamData = (url:string, issueRecordId: any) => {
  const data = ref<ParamsOption[]>([])
  const asyncData = () => {
    axios
      .get(url, {
        // eslint-disable-next-line
        params: { issueRecordId }
      })
      .then(res => {
        if (res.data.code === 200) {
          data.value = res.data.data
        } else {
          ElMessage.error(res.data.msg)
        }
      })
  }
  asyncData()
  return data
}
// 获取 echarts 数据
export const useEchartsData = (url: string) => {
  const data = ref({})
  const asyncData = (url: string) => {
    axios
      .get(url, {
        // eslint-disable-next-line
        // params: { type: aircraftType }
      })
      .then(res => {
        if (res.data.code === 200) {
          data.value = res.data.data || []
        } else {
          ElMessage.error(res.data.msg)
        }
      })
  }
  asyncData(url)

  return data
}

export const useAsyncData = () => {
  const route = useRoute()
  const asyncData = (done: (res: Item) => void) => {
    if (!route.params.id) {
      return null
    }
    axios
      .get('/aircraft/getAircraftVoById', {
        params: { id: route.params.id }
      })
      .then(res => {
        if (res.data.code === 200) {
          done(res.data.data)
        }
      })
  }

  return asyncData
}

// 公共方法 回显数据方法
export const asyncGetData = () => {
  const asyncData = (url:string, id:any, done: (res: Item) => void) => {
    axios
      .get(url, {
        params: { id }
      })
      .then(res => {
        if (res.data.code === 200) {
          done(res.data.data)
        } else {
          ElMessage.error(res.data.msg)
        }
      })
  }

  return asyncData
}


//处理树children为[] 时 改为 Null
const commonFnTree = (data: any) => {
  data.forEach((item: any) => {
    if(item.children && item.children.length > 0 ) {
      commonFnTree(item.children)
    } else {
      item.children = null
    }
  });
}

//获取角色下拉接口
/**
 * 
 * @param type 1: '参演单位  2:装备型号
 * @returns 
 */
export const useDataFillds = (url:any, taskId:any) => {
  const dataFields = ref([]);
  const asyncData = () => {
    axios.get(url, {params: { taskId }}).then(res => {
      if (res.data.code === 200) {
        const data =  res.data.data || [];
        commonFnTree(data);
        dataFields.value = data;
      } else {
        ElMessage.error(res.data.msg)
      }
    });
  };
  asyncData();
  return dataFields;
};
export const rules = {
  exercisePhaseId: {
    required: true,
    message: '请选择演习阶段'
  },
  taskId: {
    required: true,
    message: '请填写演习任务'
  },
  taskName: {
    required: true,
    message: '请填写演习任务'
  },
  discoverUnitIds: {
    required: true,
    message: '请填写发现单位'
  },
  discoverUnitIdNames: {
    required: true,
    message: '请填写发现单位'
  },
  discoverPeople: {
    required: true,
    message: '请填写发现人'
  },
  contactNumber: {
    required: true,
    message: '请填写联系电话'
  },
  occurrenceTime: {
    required: true,
    message: '请选择发生时间'
  },
  equipmentModelIds: {
    required: true,
    message: '请选择问题装备型号'
  },
  equipmentCapabilityId: {
    required: true,
    message: '请选择问题装备能力'
  },
  equipmentNumber: {
    required: true,
    message: '请填写具体编号'
  },
  problemParts: {
    required: true,
    message: '请填写问题定位'
  },
  problemAttributesIds: {
    required: true,
    message: '请填写问题分类'
  },
  problemLevel: {
    required: true,
    message: '请选择问题等级'
  },
  keyWord: {
    required: true,
    message: '请填写关键词描述'
  },
  probability: {
    required: true,
    message: '请选择发生概率'
  },
  degree: {
    required: true,
    message: '请选择影响程度'
  },
  nature: {
    required: true,
    message: '请选择问题性质'
  },
  factor: {
    required: true,
    message: '请选择引发因素'
  },
  isSolved: {
    required: true,
    message: '请选择引发因素'
  },
  SolvingPeople: {
    required: true,
    message: '请填写解决人/单位'
  },
  SolutionTime: {
    required: true,
    message: '请填写解决时间'
  },
  solution: {
    required: true,
    message: '请填写解决方案描述'
  },
  verificationType: {
    required: true,
    message: '请选择校验结果'
  },
  verifier: {
    required: true,
    message: '请填写校验人/单位'
  },
  verificationTime: {
    required: true,
    message: '请选择校验时间'
  },
  verificationResult: {
    required: true,
    message: '请填写校验结果描述'
  },
  supplementDescription: {
    required: true,
    message: '请填写补充信息'
  },
  reportGroupId: {
    required: true,
    message: '请选择指派人'
  },
  managementProposal: {
    required: true,
    message: '请填写分析建议'
  },
  aircraftPurposes: {
    required: true,
    message: '请选择上报专家'
  },
  assign: {
    required: true,
    message: '请选择指派给谁'
  }
  // capacity: {
  //   validator: checkFloat
  // },
}
