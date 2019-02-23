import Vue from 'vue'
import { fetchItem } from '../../api'

// initial state
const state = {
  items: {/* [id:num]: Item */}
}
// actions
const actions = {
  getItem: ({ state, commit }, itemid) => {
    const item = state.items[itemid]
    const now = Date.now()
    return new Promise((resolve, reject) => {
      if( item && item.id == itemid && now - item.lastUpdate < 1000*60*5 ) {
        console.log('no need re-fetch item')
        console.log(now - item.lastUpdate)
        resolve(item)
      } else {
        fetchItem(itemid).then(resp => {
          let item = resp.data.item
          commit('SET_ITEM', { item })
          resolve(item)
        }).catch(error => { reject(error) })
      }
    })
  }
}
// mutations
const mutations = {
  SET_ITEM: (state, { item }) => {
    let itemdata = Object.assign({ lastUpdate: Date.now() }, item)
    Vue.set(state.items, itemdata.id, itemdata)
    state.inRuts = item.inruts
  }
}

export default {
  state,
  actions,
  mutations
}
