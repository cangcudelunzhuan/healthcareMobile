/*
 * Created by Siqi.Huang on 2018/07/19
 */
import { fetchGet, fetchPost } from './api'

// 获取当前用户
export function getCurrentUser () {
  return fetchGet('/report/getEmpNo')
}

// 获取轮播图信息
export function getBanner () {
  return fetchGet('/report/banner')
}

// 查询是否有新报告
export function queryNewReportFlag (empNo) {
  let params = {
    empNo: empNo
  }
  return fetchGet('/report/selectReportNew', params)
}

// 员工的所有报告列表信息
export function empReportList (empNo) {
  let params = {
    empNo: empNo
  }
  return fetchGet('/report/empReportList', params)
}

// 多个报告对比
export function reportCompare (compareList, empNo) {
  let params = {
    compareList: compareList,
    empNo: empNo
  }
  return fetchGet('/report/compareDetail', params)
}

// 查询某一个报告的概述
export function empReport (hospitalCode, empNo, checkupTime) {
  let params = {
    hospitalCode: hospitalCode,
    empNo: empNo,
    checkupTime: checkupTime
  }
  return fetchGet('report/empReport', params)
}

// 根据报告，获取对应的促进方案id
export function getPromoteSchemeId (hospitalCode, empNo, checkupTime) {
  let params = {
    hospitalId: hospitalCode,
    empNo,
    checkupTime
  }
  return fetchPost('/scheme/moblie/searchPromoteSchemeForReport', params)
}

// 保存单个报告是否隐藏状态
export function updateHidden (hospitalCode, checkupTime, empNo, isHidden) {
  let params = {
    hospitalCode: hospitalCode,
    checkupTime: checkupTime,
    empNo: empNo,
    isHidden: isHidden
  }
  return fetchPost('/report/updateHidden', params)
}

// 查询报告详情，科目->项目
export function courseDetail (hospitalCode, checkupTime, empNo) {
  let params = {
    hospitalCode: hospitalCode,
    checkupTime: checkupTime,
    empNo: empNo
  }
  return fetchGet('/report/courseDetail', params)
}

// 全部阳性指标
export function getAllPositive (hospitalCode, checkupTime, empNo) {
  let params = {
    hospitalCode: hospitalCode,
    checkupTime: checkupTime,
    empNo: empNo
  }
  return fetchGet('/report/positiveDetail', params)
}

// 阳性指标详情
export function getPositiveDetail (rowid, resultCode, index) {
  let params = {
    rowid: rowid,
    resultCode: resultCode,
    index: index || ''
  }
  return fetchGet('/report/apiExplainDetail', params)
}
