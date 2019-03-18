import ItemList from './ItemList.vue'

export default function createItemList (per, flag, id) {
  return {
    name: `${per}-items`,
    render (h) {
      return h(ItemList, { props: { per, flag, id }})
    }
  }
}
