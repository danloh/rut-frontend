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
  props: {
    type: String,
    userid: null,
    tag: String
  },
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
      let params = {'type': this.type, 'userid': this.userid, 'tag': this.tag}
      this.$store.dispatch('getDemands', params)
    },
    loadmoreDemand () {
      let params = {
        'type': this.type,
        'userid': this.userid,
        'tag': this.tag,
        'page': this.currentD
      }
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