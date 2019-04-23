import Vue from 'vue'
import { fetchItem } from '../../api'

// initial state
const state = {
  items: {/* [slug]: Item */}
}
// actions
const actions = {
  getItem: ({ state, commit }, itemslug) => {
    const item = state.items[itemslug]
    const now = Date.now()
    return new Promise((resolve, reject) => {
      if( item && item.slug === itemslug && now - item.lastUpdate < 1000*60*5 ) {
        //console.log('no need re-fetch item')
        //console.log(now - item.lastUpdate)
        resolve(item)
      } else {
        fetchItem(itemslug).then(resp => {
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
    Vue.set(state.items, itemdata.slug, itemdata)
  },
  RENEW_ITEM (state, data) {
    state.items[data.itemslug][data.ref] = data[data.ref]
  }
}

export default {
  state,
  actions,
  mutations
}
