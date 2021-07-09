export function stringify(obj: any) {
  if (sessionStorage.token) {
    //统一加token
    obj.token = sessionStorage.token
  }
  let str = ''
  for (const k in obj) {
    str += k + '=' + obj[k] + '&'
  }
  return str.substring(0, str.length - 1)
}
