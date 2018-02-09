<template>
  <div>
    <b>{{action.toUpperCase()}} {{totalRuts}}</b>
    <div class="rut-list">
      <rut-sum v-for="rut in currentRuts" :key="rut.id" :rut="rut"></rut-sum>
    </div>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreRuts" 
                 :disabled="!hasMore">
                 Show More
      </el-button>
    </div>
  </div>
</template>

<script>
import RutSum from '@/components/Rut/RutSum.vue'
import { fetchProfileRuts } from '@/api/api'

export default {
  name: 'profile-ruts',
  props: {
    action: String // to be: created, star, challenge
  },
  components: { RutSum },
  data () {
    return {
      totalRuts: 0,
      currentRuts: [],
      currentPage: 0
    }
  },
  computed: {
    hasMore () {
      return this.currentRuts.length < this.totalRuts
    }
  },
  methods: {
    loadmoreRuts () {
      let action = this.action
      let userid = this.$route.params.id
      let param = {'page': this.currentPage}
      // let params = {'action': action, 'userid': userid, 'param': param}
      fetchProfileRuts(action, userid, param)
      .then(resp => {
        this.currentRuts.push(...resp.data.ruts)
        this.currentPage += 1
      })
    }
  },
  created () {
    let action = this.action
    let userid = this.$route.params.id
    fetchProfileRuts(action, userid)
    .then(resp => {
      this.currentRuts = resp.data.ruts
      this.totalRuts = resp.data.total
      this.currentPage = 1
    })
  }
}
</script>

<style lang="stylus" scoped>
.rut-list
  width 100%
  margin-top 5px
</style>