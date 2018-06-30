<template>
  <div class="demand-list">
    <demand v-for="demand in currentDemands" 
            :key="demand.id" 
            :demand="demand">
    </demand>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreDemand" 
                 :disabled="!hasMore">
                 Show More
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Demand from './Demand.vue'

export default {
  name: 'demand-list',
  components: { Demand },
  props: { param: Object }, // keys: ref, userid, tag
  computed: {
    ...mapGetters([
      'currentDemands',
      'currentD',
      'maxD'
    ]),
    hasMore () {
      return this.currentD < this.maxD
    }
  },
  methods: {
    initData () {
      let params = this.param
      this.$store.dispatch('getDemands', params)
    },
    loadmoreDemand () {
      let params = Object.assign({'page': this.currentD}, this.param)
      this.$store.dispatch('moreDemands', params)
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style lang="stylus" scoped>
.demand-list
  padding auto
</style>