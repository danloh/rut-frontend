// import axios from '@/main'
import { fetchClips, newClip } from '@/api/api'

// initial state
const perPage = 20
const state = {
  totalClips: 0,
  currentClips: [],
  currentP: 0,
  maxP: 0
}

// actions
const actions = {
  getClips: ({commit}, params) => {
    fetchClips(params).then(resp => {
      commit('SET_CLIPS', resp.data)
    })
  },
  postClip: ({commit}, params) => {
    newClip(params).then(resp => {
      commit('ADD_CLIP', resp.data)
    })
  },
  moreClips: ({commit}, params) => {
    fetchClips(params).then(resp => {
      commit('MORE_CLIPS', resp.data.clips)
    })
  }
}

// mutations
const mutations = {
  SET_CLIPS (state, data) {
    state.totalClips = data.total
    state.currentP = 1
    state.maxP = Math.ceil(data.total / perPage)
    state.currentClips = data.clips
  },
  MORE_CLIPS (state, data) {
    state.currentP += 1
    state.currentClips.push(...data)
  },
  ADD_CLIP (state, data) {
    state.currentClips.unshift(data)
  }
}

export default {
  state,
  actions,
  mutations
}
