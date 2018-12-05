/*
 * Created by Siqi.Huang on 2018/07/19
 */
import { fetchGet, fetchPost } from './api'

export default {
  // 促进方案管理-移动端列表
  getList (params) {
    return fetchGet('/scheme/promote/searchPromoteSchemeByMobileList',params)
  },
  // 健康总评-列表
  healthCareSummary (id) {
    return fetchPost(`/scheme/mobile/healthCareSummary/${id}`)
  },
  // 健康促进方案
  healthWellnessScheme (params) {
    return fetchPost(`/scheme/mobile/healthWellnessScheme/${params.schemeId}`,params)
  },
  // 阳性指标-对比
  compareReport (params) {
    return fetchPost(`/scheme/positive/compareReport/${params.schemeId}`,params)
  },
  // 阳性指标解释、病因
  positiveIndex (params) {
    return fetchPost(`/scheme/mobile/positiveIndex/${params.schemeId}`,params)
  },
  // 营养饮食保健方案
  healthDietScheme (params) {
    return fetchPost(`/scheme/mobile/healthDietScheme/${params.schemeId}`,params)
  },
  // 复查时间-消息明细
  reexaminationMessage (params) {
    return fetchPost(`/scheme/mobile/reexaminationMessage/${params.schemeId}`,params)
  },
  // 复查时间-明细
  reexaminationTime (params) {
    return fetchPost(`/scheme/mobile/reexaminationTime/${params.schemeId}`,params)
  }
}
