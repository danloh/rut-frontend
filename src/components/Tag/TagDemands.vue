<template>
  <div class="demand-list">
    <demand v-for="demand in demands" :key="demand.id" :demand="demand"></demand>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreDemand" :disabled="!hasMore">
                 Show More
      </el-button>
    </div>
  </div>
</template>

<script>
import Demand from '@/components/Demand/Demand.vue'
import { fetchTagDemands } from '@/api/api'

export default {
  name: 'tag-demand',
  components: { Demand },
  data () {
    return {
      tagname: null,
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
  methods: {
    loadmoreDemand () {
      let params = {'page': this.currentPage}
      fetchTagDemands(this.tagname, params).then(resp => {
        this.demands.push(...resp.data.demands)
        this.currentPage += 1
      })
    },
    loadDemands () {
      this.tagname = this.$route.params.name
      fetchTagDemands(this.tagname).then(resp => {
        let data = resp.data
        this.demands = data.demands
        this.demandCount = data.demandcount
      })
    }
  },
  // watch: {
  //   '$route.params.name': 'loadDemands'
  // },
  created () {
    this.loadDemands()
  }
}
</script>

<style lang="stylus" scoped>
.demand-list
  padding auto
</style>
