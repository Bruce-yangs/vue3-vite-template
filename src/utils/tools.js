//获取前一个月日期
function getPreMonth(date) {
  let arr = date.split('-');
  let year = arr[0]; //获取当前日期的年份  
  let month = arr[1]; //获取当前日期的月份  
  let day = arr[2]; //获取当前日期的日  
  let days = new Date(year, month, 0);
  days = days.getDate(); //获取当前日期中月的天数  
  let year2 = year;
  let month2 = parseInt(month) - 1;
  if (month2 === 0) {
    year2 = parseInt(year2) - 1;
    month2 = 12;
  }
  let day2 = day;
  let days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }
  let t2 = year2 + '-' + month2 + '-' + day2;
  return t2;
}
//获取下一个月日期
function getNextMonth(date) {
  let arr = date.split('-');
  let year = arr[0]; 
  let month = arr[1];   
  let day = arr[2]; 
  let days = new Date(year, month, 0);
  days = days.getDate();
  let year2 = year;
  let month2 = parseInt(month) + 1;
  if (month2 == 13) {
    year2 = parseInt(year2) + 1;
    month2 = 1;
  }
  let day2 = day;
  let days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }

  let t2 = year2 + '-' + month2 + '-' + day2;
  return t2;
}
//日期月份或日 补零
function zeroPadding(num) {
  return num < 10 ? '0' + num : num;
}
//添加页面判断页面出现滚动条确定栏吸底
function watchOverflow() {
  if (document.querySelector('.common-content-box')) {
    let contentBox = document.querySelector('.common-content-box');
    if (contentBox.scrollHeight > contentBox.clientHeight) {
      contentBox.classList.add('common-footer-overflow');
    }
  }
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 */
 function debounce(func, wait) {
  let timeout;
  return function () {
     let context = this;
     let args = arguments;

     if (timeout) clearTimeout(timeout);

     timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args)
     }, wait);
  }
}

/**
* @desc 节流防抖
* @param func 函数
* @param wait 间隔执行毫秒数
*/
function throttle(func, wait) {
  let previous = 0;
  return function() {
     let now = Date.now();
     let context = this;
     let args = arguments;
     if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
     }
  }
}


/* function debounce(fn, wait) {
  let timer;
  return function () {
    let context = this;
    let arg = arguments;
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(context, arg)
    }, wait)
  }
}


function throttle(fn, wait) {
  let pre = 0;
  return function () {
    let context = this;
    let arg = arguments;
    let now = Date.now();
    if (now - pre > wait) {
      fn.apply(context,arg);
      pre = now;
    }
  }
} */

//前端上传组件需要的数据 name url
export const fileNameList = (fileList) => {
  fileList.forEach(item => { 
    item.name = item.accessoryFilename
    item.url = item.accessoryUrl
  });
  return fileList
}

//提交后端需要的数据 accessoryFilename accessoryUrl
export const submitFileName = (fileList) => {
  fileList.forEach(item => { 
    item.accessoryFilename = item.name
    item.accessoryUrl = item.url
  });
  return fileList
}


export {
  getPreMonth,
  getNextMonth,
  zeroPadding,
  watchOverflow,
  debounce,throttle
}
