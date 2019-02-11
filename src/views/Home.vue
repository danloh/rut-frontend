<template>
  <div>
    <div class="home-page">
      <div class="rut-list">
        <rut-sum v-for="rut in indexRuts" :key="rut.id" :rut="rut"></rut-sum>
      </div>
      <div class="home-side"></div>
    </div>
  </div>
</template>

<script>
import RutSum from '../components/Rut/RutSum.vue'
import { fetchIndexRuts } from '../api'

export default {
  name: 'home',
  title: 'Home',
  components: { RutSum },
  data () {
    return {
      indexRuts: []
    }
  },
  methods: {
    loadIndex () {
      fetchIndexRuts().then(resp => {
        this.$store.commit('SET_INDEX', resp.data)
        this.indexRuts = resp.data.ruts
      })
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
