import ArticleList from './ArticleList.vue'

// higher order components wrapping
export default function createHList (type = 'top') {
  return {
    name: `${type}-article`,
    render (h) {
      return h(ArticleList, { props: { param: {'ref': type} } })
    }
  }
}
