export default (data) => {
  if (!data) {
    return ''
  }
  // if (data.indexOf('-')!== -1){
  //   let arr = data.split('-')
  //   let nextyear = parseInt(arr[0],  10) + 1
  //   return arr[0] + '年' + arr[1] + '月-' + nextyear + '年' + (parseInt(arr[1]) - 1).toString() + '月'
  // }else {
  //
  // }
  let thisyear = data.substr(0,4)
  let m = data.substr(4,2)
  if (m === '01') {
    return thisyear + '年' + m + '月-' + thisyear + '年' +  '12月'
  }
  let nextyear = parseInt(thisyear,10) + 1
  return thisyear + '年' + m + '月-' + nextyear + '年' + (parseInt(m) - 1).toString() + '月'
}
