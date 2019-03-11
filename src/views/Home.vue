<template>
  <div>
    <div class="home-page">
      <div class="rut-list">
        <rut-sum v-for="rut in indexRuts" :key="rut.id" :rut="rut"></rut-sum>
      </div>
      <div class="home-side">
        <small>A Place To Share </small><br>
        <b>Meta Knowledge</b>
      </div>
    </div>
  </div>
</template>

<script>
import RutSum from '../components/Rut/RutSum.vue'

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
      this.$store.dispatch('getIndexRuts').then(resp => {
        this.indexRuts = resp
      })
    }
  },
  created () {
    this.loadIndex()
  }
}
</script>

<style scoped>
.home-page {
  padding: 10px 230px 10px 0px;
  position: relative;
}
.home-side {
  position: absolute;
  top: 10px;
  right: 0;
  width: 220px;
  text-align: center;
  background-color: #fafbfa;
}
</style>
