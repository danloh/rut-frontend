import ProfileRuts from './ProfileRuts.vue'

export default function createRutList (action = 'create') {
  return {
    name: `My-${action}-ed-ruts`,
    render (h) {
      return h(ProfileRuts, {props: { action }})
    }
  }
}
