<template>
  <div class="etc-list">
    <div class="etc-main">
      <b style="font-size:1.2em">{{ etcCount | pluralise('Post') }} on: &nbsp;</b>
      <router-link :to="'/r/' + rut.id">
        {{ rut.title }}
      </router-link>
    </div>
    <div v-for="etc in etcs" :key="etc.id">
      <etc :etc="etc"></etc>
    </div>
    <!-- <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreEtc" 
                 :disabled="!hasMore">
                 Show More
      </el-button>
    </div> -->
    <div class="etc">
      <reply class="reply" :refer="refer" :show="true" @newreply="updateNew"></reply>
    </div>
    <div class="retc-side"></div>
  </div>
</template>

<script>
import { newEtc, fetchEtcs } from '../api'
import Etc from '../components/Etc/Etc.vue'
import Reply from '../components/Etc/Reply.vue'

export default {
  name: 'etc-list',
  title () {
    return 'Discuss: ' + this.rut.title
  },
  components: { Etc, Reply },
  data () {
    return {
      rut: {},
      etcs: [],
      etcCount: 0,
      currentPage: 1,
      refer: { per: 'rut', perid: this.$route.params.id }
    }
  },
  computed: {
    // hasMore () {
    //   return this.etcs.length < this.etcCount
    // }
  },
  methods: {
    loadEtcs () {
      let rutid = this.$route.params.id
      this.$store.dispatch('getRut', rutid).then(resp => {
        this.rut = resp
      })
      fetchEtcs('rut', rutid).then(resp => {
        let data = resp.data
        this.etcs = data.etcs
        this.etcCount = data.count
      })
    },
    loadmoreEtc () {
    },
    updateNew (data) {
      this.etcs.unshift(data)
      this.etcCount += 1
    }
  },
  created () {
    this.loadEtcs()
  }
}
</script>

<style lang="stylus" scoped>
.etc-list
  padding 5px 180px 10px 0px
  position relative
  .etc-main
    padding 10px
  .retc-side
    position absolute
    top 10px
    right 0
    width 300px
</style>
