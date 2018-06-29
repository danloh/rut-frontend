import HeadlineList from './HeadlineList.vue'

// higher order components wrapping
export default function createHList (type = 'top') {
  return {
    name: `${type}-headline`,
    render (h) {
      return h(HeadlineList, { props: { param: {'ref': type} } })
    }
  }
}
