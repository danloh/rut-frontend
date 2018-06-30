<template>
  <div class="demand-list">
    <b>REQUESTS {{ totalDemands }}</b>
    <demand-list :param="listParam"></demand-list>
  </div>
</template>

<script>
import DemandList from '@/components/Demand/DemandList.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'profile-demand',
  components: { DemandList },
  data () {
    return {
      listParam: {}
    }
  },
  computed: {
    ...mapGetters(['totalDemands'])
  },
  created () {
    this.listParam = {userid: this.$store.getters.currentUserID}
  }
}
</script>

<style lang="stylus" scoped>
.demand-list
  padding auto
</style>
