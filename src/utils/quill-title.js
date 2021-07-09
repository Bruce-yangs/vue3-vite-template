const titleConfig = {
  'ql-bold' : '加粗',
  'ql-italic' : '斜体',
  'ql-color' : '颜色',
  'ql-align' : '文本对齐',
  'ql-list' : '列表',
  'ql-indent' : '缩进',
  'ql-image' : '图片',
  'ql-link' : '插入链接',
};
export default () => {
  const oToolBar = document.querySelector('.ql-toolbar'),
    aButton = oToolBar.querySelectorAll('button'),
    aSelect = oToolBar.querySelectorAll('select');
  aButton.forEach(item => {
    if (item.className === 'ql-align') {
      if (item.value === 'center') {
        item.title = '居中';
      } else if (item.value === 'right') {
        item.title = '右对齐';
      } else if (item.value === '') {
        item.title = '左对齐'
      }
    } else if (item.className === 'ql-indent') {
      item.value === '+1' ? item.title = '向右缩进' : item.title = '向左缩进';
    } else if (item.className === 'ql-list') {
      item.value === 'ordered' ? item.title = '编号' : item.title = '项目符号';
    }
    else {
      item.title = titleConfig[item.classList[0]];
    }
  });
  aSelect.forEach(item => {
    item.parentNode.title = titleConfig[item.classList[0]];
  })
}
