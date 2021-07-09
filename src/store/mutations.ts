/**
 * Created by yzf on 2019/5/29.
 */

export default {
  setToken(state, token) {
    state.token = token
  },
  setAnnouncementStatus(state, payload) {
    state.announcementStatus = payload.announcementStatus
  },
  setOpenMenu(state, payload) {
    state.openMenu = payload.openMenu
  }
}
