<template>
  <div>
    <b>Who Challenging: </b><br>
    <div class="user-list">
      <user-sum v-for="user in challengers" :key="user.id" :user="user"></user-sum>
    </div>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" @click="loadmoreChallengers" :disabled="!hasMore">Show More</el-button>
    </div>
    <br>
  </div>
</template>

<script>
import UserSum from '@/components/Profile/UserSum.vue'
import { fetchRutChallengers } from '@/api/api'

export default {
  name: 'challenger-list',
  // props: ['users'],
  components: { UserSum },
  data () {
    return {
      challengers: [],
      challengerCount: 0,
      currentPage: 1
    }
  },
  computed: {
    hasMore () {
      return this.challengers.length < this.challengerCount
    }
  },
  methods: {
    loadChallengers () {
      let rutid = this.$route.params.id
      fetchRutChallengers(rutid)
      .then(resp => {
        let data = resp.data
        this.challengers = data.challengers
        this.challengerCount = data.challengercount
      })
    },
    loadmoreChallengers () {
      let rutid = this.$route.params.id
      let params = {'page': this.currentPage}
      fetchRutChallengers(rutid, params)
      .then(resp => {
        this.challengers.push(...resp.data.challengers)
        this.currentPage += 1
      })
    }
  },
  created () {
    this.loadChallengers()
  }
}
</script>

<style lang="stylus" scoped>
.user-list
  width 100%
</style>