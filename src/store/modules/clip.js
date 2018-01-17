// import axios from '@/main'
import {
  fetchClips,
  fetchIUClips,
  newClip
} from '@/api/api'

// initial state
const perPage = 20
const state = {
  totalClips: 0,
  currentP: 0,
  currentClips: [],
  maxP: 0,
  perP: perPage
}

// actions
const actions = {
  getClips: ({commit, state}, params) => {
    if (params.itemid || params.userid) {
      return fetchIUClips(params)
      .then(resp => {
        commit('SET_CLIPS', resp.data)
      })
    }
    return fetchClips(params)
    .then(resp => {
      commit('SET_CLIPS', resp.data)
    })
  },
  postClip: ({commit, state}, params) => {
    return newClip(params)
    .then(resp => {
      commit('ADD_CLIP', resp.data)
    })
  },
  moreClips: ({commit, state}, params) => {
    if (params.itemid || params.userid) {
      return fetchIUClips(params)
      .then(resp => {
        commit('MORE_CLIPS', resp.data.clips)
      })
    }
    return fetchClips(params)
    .then(resp => {
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
