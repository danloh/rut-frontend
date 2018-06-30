import DemandList from './DemandList.vue'

// higher order components wrapping
export default function createDemandList (param = {}) {
  let prefix = param.ref || 'somedemands'
  return {
    name: `${prefix}-demand`,
    render (h) {
      return h(DemandList, {props: { param }})
    }
  }
}
