<template>
  <div>
    <div class="home-page">
      <div class="rut-list">
        <rut-sum v-for="rut in indexRuts" :key="rut.id" :rut="rut"></rut-sum>
      </div>
      <div class="home-side">
        <h4 class="right-title">Yet Another Collection</h4>
        <div class="right-body" v-for="(tag, index) in indexTags" :key="index">
          <router-link :to="'/tag/' + tag" :title="tag">
            {{ tag.slice(0,24) }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RutSum from '../components/Rut/RutSum.vue'
import { fetchTags } from '../api'

export default {
  name: 'home',
  title: 'Home',
  components: { RutSum },
  data () {
    return {
      indexRuts: [],
      indexTags: [],
    }
  },
  methods: {
    loadIndex () {
      this.$store.dispatch('getIndexRuts').then(resp => {
        this.indexRuts = resp
      })
    },
    loadTags() {
      fetchTags('index','index').then(res => {
        this.indexTags = res.data.tags
        console.log(this.indexTags)
      })
    }
  },
  created () {
    this.loadIndex(),
    this.loadTags()
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
  background-color: #fafbfa;
}
.right-title {
  background-color: #e5ebe4;
  padding: 10px 15px;
  font-size: 15px;
}
.right-body {
  padding: 5px 20px;
  font-size: 14px;
}
</style>
