<template>
  <div>
    <banner></banner>
    <div class="home-page">
      <div class="rut-list">
        <keep-alive>
          <rut-list :rutlist="currentRuts" @loadmore="loadmoreRuts"></rut-list>
        </keep-alive>
      </div>
      <spinner :show="loading"></spinner>
      <div class="home-side">
        <h4 class="right-title">Top Topics</h4>
        <div class="right-body" v-for="(tag, index) in showTags" :key="index">
          <router-link :to="'/tag/' + tag.tagid">{{tag.tagname}}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Misc/Spinner.vue'
import Banner from '@/components/Misc/Banner.vue'
import RutList from '@/components/Rut/RutList.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  title: 'Readup.Tips - Share Read List',
  components: { RutList, Spinner, Banner },
  data: () => ({
    loading: true
  }),
  computed: {
    ...mapGetters([
      'currentPage',
      'currentRuts',
      'showTags'
    ])
  },
  methods: {
    loadmoreRuts () {
      this.$store.commit('ADD_RUTS', this.currentPage)
    }
  },
  created () {
    this.loading = true
    this.$store.dispatch('getRuts')
    .then(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="stylus" scoped>
.home-page
  padding 10px 230px 10px 0px
  position relative
  .rut-list
    padding auto
  .home-side
    position absolute
    top 10px
    right 0
    width 220px
    background-color lighten(#e5ebe4, 80%)
    .right-title
      background-color #e5ebe4
      padding 10px 15px
    .right-body
      padding 5px 20px
      a
        &:hover
          color #ff6600
</style>
