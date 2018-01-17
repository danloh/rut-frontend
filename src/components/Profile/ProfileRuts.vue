<template>
  <div>
    <b>{{action.toUpperCase()}} {{totalRuts}}</b>
    <div class="rut-list">
      <rut-list :rutlist="currentRuts" @loadmore="loadmoreRuts"></rut-list>
    </div>
  </div>
</template>

<script>
import RutList from '@/components/Rut/RutList.vue'
import { mapGetters } from 'vuex'
import { fetchProfileRuts } from '@/api/api'

export default {
  name: 'profile-ruts',
  props: {
    action: String // to be: created, star, challenge
  },
  components: { RutList },
  computed: {
    ...mapGetters([
      'totalRuts',
      'currentPage',
      'currentRuts'
    ])
  },
  methods: {
    loadmoreRuts () {
      let action = this.action
      let userid = this.$route.params.id
      let param = {'page': this.currentPage}
      // let params = {'action': action, 'userid': userid, 'param': param}
      fetchProfileRuts(action, userid, param)
      .then(resp => {
        this.$store.commit('MORE_RUTS', resp.data.ruts)
      })
    }
  },
  created () {
    let action = this.action
    let userid = this.$route.params.id
    let params = {'action': action, 'userid': userid}
    this.$store.dispatch('getProfileRuts', params)
  }
}
</script>

<style lang="stylus" scoped>
.rut-list
  width 100%
  margin-top 5px
</style>