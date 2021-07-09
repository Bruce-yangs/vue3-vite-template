import { createStore } from 'vuex'
import axios from '../utils/request'

export default createStore({
  state: {
      waitResolve: 0 //待分析
  },
  mutations: {
    setwaitResolve(state, payload) {
      state.waitResolve = payload
    },
  },
  actions: {
    asyncGetCount({ commit }) {
      axios.get('/conductor/home/issueCount').then((res) => {
        if(res.data.code === 200) {
          commit('setwaitResolve',res.data.data.waitResolve);
        }
      })
    }
  }
})
