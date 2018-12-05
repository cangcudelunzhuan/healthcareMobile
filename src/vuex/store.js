import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    rowId: ''
  },
  mutations: {
    changeRowId (state, newRowId) {
      state.rowId = newRowId
    }
  }
})

export default store
