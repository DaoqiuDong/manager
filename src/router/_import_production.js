module.exports = file => () => {
  if (location.href.indexOf('rule.html') > -1) {
    return import('@/rule/views/' + file + '.vue')
  }else{
    return import('@/credit/views/' + file + '.vue')
  }
}
