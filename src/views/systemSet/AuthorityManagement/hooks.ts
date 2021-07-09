import { Ref, ref, unref } from "vue";
import { useRoute } from "vue-router";
import axios from "../../../utils/request";
import { Item, ParamsOption, TreeItem, TreeItemDisabled } from "./types";
import { ElMessage } from "element-plus";

export const useParamOptions = (aircraftType: string) => {
  const data = ref<ParamsOption[]>([]);
  const asyncData = (aircraftType: string) => {
    axios
      .get("/common/getSelectList", {
        // eslint-disable-next-line
        params: { type: aircraftType }
      })
      .then(res => {
        if (res.data.code === 200) {
          data.value = res.data.data;
        }
      });
  };
  asyncData(aircraftType);

  return data;
};


//处理tree默认全选中
export const commonChecked = (data: TreeItem[], checkedTree: Ref) => {
  if (!data || !data.length) return
    data.forEach(item => {
      if (item.id) {
        checkedTree.value.push(item.id);
        if (item.children && item.children.length > 0) {
          commonChecked(item.children, checkedTree);
        }
      }
    });
  }

//默认禁用
export const commonDisabled = (data: TreeItemDisabled[]) => {
  data = unref(data)
  if (!data || !data.length) return
  data.forEach((item: any) => {
    if (item.id) {
      item.disabled = true;
    }
    if (item.children && item.children.length > 0) {
      commonDisabled(item.children);
    }
  })
}


//获取tree数据
export const useAsyncTreeData = (sort: number) => {
  const treeSource = ref<TreeItem[]>([]);
  const checkedAll: any = ref([]);
  const treeDisabled: any = ref([]);
  // const asyncData = () => {
    axios
      .get("/conductorRole/getPowerTreeList?sort=" + sort, {
        // eslint-disable-next-line
        // params: { type: aircraftType }
      })
      .then(res => {
        if (res.data.code === 200) {
          const treeData = JSON.parse(JSON.stringify(res.data.data || []));
          // const treeData2 = JSON.parse(JSON.stringify(res.data.data || []));
          treeDisabled.value = JSON.parse(JSON.stringify(res.data.data || []));
          treeSource.value  = res.data.data || [];
          commonChecked(treeData, checkedAll);
          commonDisabled(treeDisabled);
        }
      });
  return { treeSource, checkedAll, treeDisabled };
};



//获取角色详情
export const useAsyncData = (id: number) => {
  const asyncData = (done: (res: Item) => void) => {
    axios
      .get("/conductorRole/getRoleInfo", {
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

//处理树children为[] 时 改为 Null
export const commonFnTree = (data: any) => {
  data.forEach((item: any) => {
    if(item.children && item.children.length > 0 ) {
      commonFnTree(item.children)
    } else {
      item.children = null
    }
  });
}

//获取角色下拉接口
export const useDataFillds = () => {
  const dataFields = ref<TreeItem[]>([]);
  const asyncData = () => {
    axios.get("/conductorRole/getRoleList").then(res => {
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



// 添加和编辑接口
export const addAndEditData = (
  curId: number | string,
  data: any
): Promise<boolean> => {
  let  id: number | string = '', url = '/conductorRole/saveRolePower';
  if (curId) {
    id = curId; 
    url = '/conductorRole/updateRolePower'; 
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
    .get('/conductorRole/deleteRole?id='+id)
    .then((res: any) => {
      if (res.data.code === 200) {
        return true
      } else {
        ElMessage.error(res.data.msg)
        return false
      }
    })
}
