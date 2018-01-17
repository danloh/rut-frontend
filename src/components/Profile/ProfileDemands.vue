<template>
  <div class="demand-list">
    <b>REQUESTS {{demandCount}}</b>
    <demand v-for="demand in demands" :key="demand.id" :demand="demand"></demand>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" @click="loadmoreDemand" :disabled="!hasMore">More</el-button>
    </div>
  </div>
</template>

<script>
import Demand from '@/components/Demand/Demand.vue'
import { fetchProfileDemands } from '@/api/api'

export default {
  name: 'profile-demand',
  components: { Demand },
  data () {
    return {
      demands: [],
      currentPage: 1,
      demandCount: 0
    }
  },
  computed: {
    hasMore () {
      return this.demands.length < this.demandCount
    }
  },
  created () {
    this.loadDemands()
  },
  methods: {
    loadmoreDemand () {
      let userid = this.$route.params.id
      let params = {'page': this.currentPage}
      fetchProfileDemands(userid, params)
      .then(resp => {
        this.demands.push(...resp.data.demands)
        this.currentPage += 1
      })
    },
    loadDemands () {
      let userid = this.$route.params.id
      fetchProfileDemands(userid)
      .then(resp => {
        let data = resp.data
        this.demands = data.demands
        this.demandCount = data.demandcount
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.demand-list
  padding auto
</style>
