import ProfileRuts from './ProfileRuts.vue'

export default function createProfileRuts (action = 'created') {
  return {
    name: `${action}-ruts`,
    render (h) {
      return h(ProfileRuts, {props: { action }})
    }
  }
}
