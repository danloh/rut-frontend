import RutList from './RutList.vue'

export default function createRutList (per, action, id) {
  return {
    name: `${per}-ruts`,
    render (h) {
      return h(RutList, { props: { per, action, id }})
    }
  }
}
