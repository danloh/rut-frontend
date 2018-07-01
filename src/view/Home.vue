<template>
  <div>
    <div class="home-page">
      <div class="rut-list">
        <rut-sum v-for="rut in indexRuts" :key="rut.id" :rut="rut"></rut-sum>
      </div>
      <spinner :show="loading"></spinner>
      <div class="home-side">
        <h4 class="right-title">Explore Topics...</h4>
        <div class="right-body" v-for="(tag, index) in showTags" :key="index">
          <router-link :to="'/tag/' + tag.tagname" :title="tag.tagname">
            {{ tag.tagname.slice(0,18) }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Misc/Spinner.vue'
import RutSum from '@/components/Rut/RutSum.vue'
import { fetchIndexRuts } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  title: 'Home',
  components: { RutSum, Spinner },
  data: () => ({
    loading: true
  }),
  computed: {
    ...mapGetters([
      'indexRuts',
      'showTags'
    ])
  },
  methods: {
    loadIndex () {
      let loaded = this.$store.getters.indexRuts
      this.loading = true
      if (loaded.length !== 0) {
        this.loading = false
      } else {
        fetchIndexRuts().then(resp => {
          this.$store.commit('SET_INDEX', resp.data)
          this.loading = false
        })
      }
    }
  },
  created () {
    this.loadIndex()
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
</style>
