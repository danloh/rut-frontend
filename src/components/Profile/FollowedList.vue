<template>
  <div>
    <b>FOLLOWING</b><br>
    <div class="user-list">
      <user-sum v-for="user in users" :key="user.id" :user="user"></user-sum>
    </div>
    <br>
  </div>
</template>

<script>
import UserSum from './UserSum.vue'
import { fetchFollows } from '@/api/api'

export default {
  name: 'followed-list',
  // props: ['users'],
  components: { UserSum },
  data () {
    return {
      users: []
    }
  },
  methods: {
    loadUsers () {
      let userid = this.$route.params.id
      return fetchFollows(userid, 'followed')
      .then(resp => {
        let data = resp.data
        this.users = data
      })
    }
  },
  created () {
    this.loadUsers()
  }
}
</script>

<style lang="stylus" scoped>
.user-list
  width 100%
</style>