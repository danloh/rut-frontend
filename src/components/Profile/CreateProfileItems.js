import ProfileItems from './ProfileItems.vue'

export default function createProfileItems (flag = 'doing') {
  return {
    name: `${flag}-items`,
    render (h) {
      return h(ProfileItems, {props: { flag }})
    }
  }
}
