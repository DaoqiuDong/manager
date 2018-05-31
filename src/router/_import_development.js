module.exports = file => {
  if (location.href.indexOf('rule.html') > -1) {
    return require('@/rule/views/' + file + '.vue')
  }else{
    return require('@/credit/views/' + file + '.vue')
  }
}
