import { uniq } from '@/util/filters'

// initial state
const state = {
  createdRuts: [],
  onRoads: [],
  seItems: []
}

// mutations
const mutations = {
  SET_RUTS (state, data) {
    state.createdRuts = data
  },
  SET_ROADS (state, data) {
    state.onRoads = data
  },
  ADD_ITEMS (state, data) {
    state.seItems.unshift(...data)
    state.seItems = uniq(state.seItems) // Array.from(new Set()) not work
  }
}

export default {
  state,
  mutations
}
