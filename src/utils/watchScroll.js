import store from '../store'

/**
 * 列表吸顶函数
 * @param { Function } callback 吸顶或者取消吸顶时触发，参数为 Boolean true: 吸顶 false: 取消吸顶
 */

export default (callback= null) => {
  if (!document.querySelector('.el-table')) return;
  let flag = !!document.querySelector('.el-table__fixed-header-wrapper');
  let scrollTop = document.querySelector('.M_content').scrollTop;
  let tableTop = document.querySelector('.el-table').offsetTop - document.querySelector('.header-container').offsetHeight;
  let tableWidth = document.querySelector('.el-table').offsetWidth;
  let tableHeight = document.querySelector('.el-table').offsetHeight;
  let headerWrapper = document.querySelector('.el-table__header-wrapper');
  let tableWrapper = document.querySelector('.el-table__body-wrapper');
  let fixHeaderWrapper = '';
  let leftFixedTable = '';
  let rightFixedCell = '';
  if (flag) {
    fixHeaderWrapper = document.querySelector('.el-table__fixed-header-wrapper');
    leftFixedTable = document.querySelector('.el-table__fixed');
    rightFixedCell = document.querySelector('.el-table__header-wrapper .right-header-operate');
    if (document.querySelector('.el-table--scrollable-x')) {
      if (leftFixedTable) leftFixedTable.style.height = tableHeight - 11 + 'px';
    } else {
      if (leftFixedTable) leftFixedTable.style.height = tableHeight + 'px';
    }
  }
  headerWrapper.style.width = tableWidth - 2 + 'px';
  if (scrollTop > tableTop) {
    headerWrapper.classList.add('header-fixed');
    tableWrapper.style.paddingTop = headerWrapper.offsetHeight + 'px';
    if (flag) {
      if (leftFixedTable) {
        fixHeaderWrapper.classList.add('left-header-fixed');
        fixHeaderWrapper.style.width = leftFixedTable.offsetWidth + 'px';
      }
      fixHeaderWrapper.style.top = headerWrapper.offsetTop;
      if (rightFixedCell) {
        rightFixedCell.classList.add('right-header-fixed');
      }
    }
    if (document.querySelector('.home-container.home-narrow')) {
      headerWrapper.classList.add('header-narrow');
      if (flag) {
        fixHeaderWrapper.classList.add('header-narrow');
      }
    } else {
      headerWrapper.classList.remove('header-narrow');
      if (flag) {
        fixHeaderWrapper.classList.remove('header-narrow');
      }
    }
    callback && (typeof callback === 'function') && callback(true);
  } else {
    headerWrapper.classList.remove('header-fixed', 'header-narrow');
    tableWrapper.style.paddingTop = '0';
    if (flag) {
      if (leftFixedTable) {
        fixHeaderWrapper.classList.remove('left-header-fixed', 'header-narrow');
      }
      if (rightFixedCell) {
        rightFixedCell.classList.remove('right-header-fixed');
      }
    }
    callback && (typeof callback === 'function') && callback(false);
  }
}
