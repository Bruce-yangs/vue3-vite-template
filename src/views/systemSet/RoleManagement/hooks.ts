import { ref } from "vue";
import axios from "../../../utils/request";
// import { ElMessage } from "element-plus";




//获取角色下拉接口
export const useDataFillds = () => {
  const roleList = ref<[]>([]);
  const asyncRoleList = () => {
    axios.get("/conductorProcessGroup/getProcessGroupList").then(res => {
      if (res.data.code === 200) {
        const data =  res.data.data || [];
        roleList.value = data;
      } else {
        // ElMessage.error(res.data.msg)
      }
    });
  };
  asyncRoleList();
  return { roleList, asyncRoleList};
};
//获取角色下拉接口
export const useDataUserList = () => {
  const dataFields = ref<[]>([]);
  const asyncData = () => {
    axios.get("/conductorProcessGroup/getUserList").then(res => {
      if (res.data.code === 200) {
        const data =  res.data.data || [];
        dataFields.value = data;
      } else {
        ElMessage.error(res.data.msg)
      }
    });
  };
  asyncData();
  return dataFields;
};

//获取角色详情
export const useAsyncData = (id: number) => {
  const asyncData = (done: (res: any) => void) => {
    axios
      .get("/conductorProcessGroup/getProcessGroupInfo", {
        params: { id }
      })
      .then(res => {
        if (res.data.code === 200) {
          done(res.data.data);
        }
      });
  };
  return asyncData;
};

// 添加和编辑接口
export const addAndEditData = (
  curId: number | string,
  data: any
): Promise<boolean> => {
  let  id: number | string = '', url = '/conductorProcessGroup/saveProcessGroup';
  if (curId) {
    id = curId; 
    url = '/conductorProcessGroup/updateProcessGroup'; 
  }
  return axios
    .post(url, {
      ...data,id
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
  return axios
    .get('/conductorProcessGroup/deleteProcessGroup?id='+id)
    .then((res: any) => {
      if (res.data.code === 200) {
        return true
      } else {
        ElMessage.error(res.data.msg)
        return false
      }
    })
}
