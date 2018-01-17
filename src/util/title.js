function getTitle (vm) {
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title
  }
}

function exeTitle (vm) {
  const title = getTitle(vm)
  if (title) {
    document.title = `${title} @Readup.Tips`
  }
}

// 2 hooks for different data come-out timing: value or func
const clientTitleMixin = {
  beforeUpdate () {
    exeTitle(this)
  },
  mounted () {
    exeTitle(this)
  }
}

export default clientTitleMixin
