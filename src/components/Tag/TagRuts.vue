<template>
  <div>
    <div class="rut-list">
      <rut-sum v-for="rut in ruts" :key="rut.id" :rut="rut"></rut-sum>
    </div>
    <!-- <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreRuts" :disabled="!hasMore">
                 Show More
      </el-button>
    </div> -->
  </div>
</template>

<script>
import RutSum from '../Rut/RutSum.vue'
import { fetchRuts } from '../../api'

export default {
  name: 'tag-ruts',
  components: { RutSum },
  data () {
    return {
      tname: null,
      rutCount: 0,
      ruts: [],
      //currentPage: 1
    }
  },
  computed: {
    // hasMore () {
    //   return this.ruts.length < this.rutCount
    // }
  },
  methods: {
    loadRuts () {
      this.tname = this.$route.params.tname
      fetchRuts('tag',this.tname).then(resp => {
        let data = resp.data
        this.ruts = data.ruts
        this.rutCount = data.count
      })
    },
    // loadmoreRuts () {
    //   let param = {'page': this.currentPage}
    //   fetchTagRuts(this.tagname, param).then(resp => {
    //     this.ruts.push(...resp.data.ruts)
    //     this.currentPage += 1
    //   })
    // }
  },
  watch: {
    '$route.params.name': 'loadRuts'
  },
  created () {
    this.loadRuts()
  }
}
</script>

<style scoped>
.rut-list {
  width: 100%;
  margin-top: 5px;
}
</style>
