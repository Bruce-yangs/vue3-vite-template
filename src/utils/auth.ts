const hasAuth = (value: string) => {
  let isExist = false
  const btnListsStr = sessionStorage.getItem('btnLists')
  if (!btnListsStr) {
    return false
  }
  const btnLists = JSON.parse(btnListsStr)
  if (btnLists.includes(value)) {
    isExist = true
  } else {
    isExist = false
  }
  return isExist
}

export const hasAuthBind: any = (el: any, binding: any) => {
  if (!hasAuth(binding.value)) {
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    } else {
      el.style.display = 'none'
    }
  }
}
