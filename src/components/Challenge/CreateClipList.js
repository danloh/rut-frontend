import ClipList from './ClipList.vue'

// for dynamically creating clip list for different param.
// higher order components wrapping ClipList.vue.
export default function createClipList (param = {}) {
  let prefix = param.ref || 'someclips'
  return {
    name: `${prefix}-list`,
    render (h) {
      return h(ClipList, {props: { param }})
    }
  }
}
