/**
 * Created by yzf on 2019/5/29.
 */
export default {
  setToken({ commit }, token) {
    commit('setToken', token)
  },
  setAnnouncementStatus({ commit }, payload) {
    commit('setAnnouncementStatus', payload)
  },
  setOpenMenu({ commit }, payload) {
    commit('setOpenMenu', payload)
  }
}
