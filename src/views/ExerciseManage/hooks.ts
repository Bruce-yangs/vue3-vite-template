import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from '../../utils/request'
import { Item, ParamsOption } from './types'
import { ElMessage } from 'element-plus'

export const useParamOptions = (url:string, type: any, sort:any) => {
  const data = ref<ParamsOption[]>([])
  const asyncData = () => {
    axios
      .get(url, {
        // eslint-disable-next-line
        params: { type, sort }
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
export const useDataFillds = (type: number) => {
  const dataFields = ref([]);
  const asyncData = () => {
    const url = type === 1 ? 'organization/getTreeList' : 'equipment/getTreeList'
    axios.get(url).then(res => {
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