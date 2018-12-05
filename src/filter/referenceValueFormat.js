export default (value) => {
  if (!value) {
    return ''
  }
  let arr = value.split('|')
  let min
  let max
  if (arr[0].indexOf('>=') !== -1) {
    min = arr[0].split('>=')[0]
  } else {
    min = arr[0].split('>')[0]
  }
  if (arr[1].indexOf('<=') !== -1) {
    max = arr[1].split('<=')[1]
  } else {
    max = arr[1].split('<')[1]
  }
  if (min === '0' && max === '∞') return '0 - ∞'
  if (min === max) return min
  if (min === '0') {
    return '<' + max
  }
  if (max === '∞') {
    return '>' + min
  }
  return min + ' - ' + max
}
