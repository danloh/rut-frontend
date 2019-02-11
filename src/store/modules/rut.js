// import axios from '@/main'
// import { fetchRut } from '../../api'

// initial state
const perPage = 20
const state = {
  indexRuts: []
}

// actions
const actions = {
}

// mutations
const mutations = {
  SET_INDEX (state, data) {
    state.indexRuts = data.ruts
  }
}

export default {
  state,
  actions,
  mutations
}