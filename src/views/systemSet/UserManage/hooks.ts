import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from '../../../utils/request'
import { Item, ParamsOption, TreeItem } from './types'
import { ElMessage } from 'element-plus'
import md5 from 'md5'

export const useParamOptions = (aircraftType: string) => {
  const data = ref<ParamsOption[]>([])
  const asyncData = (aircraftType: string) => {
    axios
      .get('/common/getSelectList', {
        // eslint-disable-next-line
        params: { type: aircraftType }
      })
      .then(res => {
        if (res.data.code === 200) {
          data.value = res.data.data
        }
      })
  }
  asyncData(aircraftType)

  return data
}

//根据id获取用户信息
export const useAsyncData = (id: number) => {
  const asyncData = (done: (res: Item) => void) => {
    axios
      .get('/conductorUser/getUserInfoVo', {
        params: { id }
      })
      .then(res => {
        if (res.data.code === 200) {
          done(res.data.data)
        }
      })
  }
  return asyncData
}

/**
 *
 * @param id {number} 1:用户名 2:姓名 3:角色
 * @returns
 */
export const useDataFillds = (id: number) => {
  const dataFields = ref<
    {
      id: number
      name: string
    }[]
  >([])

  const asyncData = () => {
    const url =
      id !== 3
        ? '/conductorUser/getLoginNameOrNameList?type=' + id
        : '/conductorRole/getRoleList'
    axios.get(url).then(res => {
      if (res.data.code === 200) {
        dataFields.value = res.data.data
      }
    })
  }
  asyncData()

  return dataFields
}

//处理树children为[] 时 改为 Null
const commonFnTree = (data: any) => {
  data.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      commonFnTree(item.children)
    } else {
      item.children = null
    }
  })
}

//获取角色下拉接口
export const useTreeData = () => {
  const dataFields = ref<TreeItem[]>([])
  const asyncData = () => {
    axios.get('/conductorRole/getRoleList').then(res => {
      if (res.data.code === 200) {
        const data = res.data.data || []
        commonFnTree(data)
        dataFields.value = data
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  }
  asyncData()
  return dataFields
}

//获取单位下拉接口
export const useTroopIdLis = () => {
  const dataFields = ref<TreeItem[]>([])
  const asyncData = () => {
    axios.get('/organization/getTreeList').then(res => {
      if (res.data.code === 200) {
        const data = res.data.data || []
        commonFnTree(data)
        dataFields.value = data
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  }
  asyncData()
  return dataFields
}

// 添加和编辑接口
export const addAndEditData = (
  curId: number | string,
  data: any
): Promise<boolean> => {
  let id: number | string = '',
    url = '/conductorUser/saveUserInfoVo'
  const info = JSON.parse(JSON.stringify(data))
  info.repeatPassword = ''
  if (curId) {
    id = curId
    url = '/conductorUser/updateUserInfoVo'
    info.password = ''
  } else {
    info.password = md5(info.password)
  }

  return axios
    .post(url, {
      ...info,
      id
    })
    .then((res: any) => {
      if (res.data.code === 200) {
        return true
      } else {
        ElMessage.error(res.data.msg)
        return false
      }
    })
}

/* 删除列表数据 */
export const equipmentDeleteItem = (id: number): Promise<boolean> => {
  return axios.get('/conductorUser/deleteUser?id=' + id).then((res: any) => {
    if (res.data.code === 200) {
      return true
    } else {
      ElMessage.error(res.data.msg)
      return false
    }
  })
}
