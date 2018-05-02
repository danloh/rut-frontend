<template>
  <div>
    <div class="rut-list">
      <rut-sum v-for="rut in ruts" :key="rut.id" :rut="rut"></rut-sum>
    </div>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreRuts" :disabled="!hasMore">
                 Show More
      </el-button>
    </div>
  </div>
</template>

<script>
import RutSum from '@/components/Rut/RutSum.vue'
import { fetchTagRuts } from '@/api/api'

export default {
  name: 'tag-ruts',
  components: { RutSum },
  data () {
    return {
      tagname: null,
      rutCount: 0,
      ruts: [],
      currentPage: 1
    }
  },
  computed: {
    hasMore () {
      return this.ruts.length < this.rutCount
    }
  },
  methods: {
    loadRuts () {
      this.tagname = this.$route.params.name
      fetchTagRuts(this.tagname).then(resp => {
        let data = resp.data
        this.ruts = data.ruts
        this.rutCount = data.rutcount
      })
    },
    loadmoreRuts () {
      let param = {'page': this.currentPage}
      fetchTagRuts(this.tagname, param).then(resp => {
        this.ruts.push(...resp.data.ruts)
        this.currentPage += 1
      })
    }
  },
  watch: {
    '$route.params.name': 'loadRuts'
  },
  created () {
    this.loadRuts()
  }
}
</script>

<style lang="stylus" scoped>
.rut-list
  width 100%
  margin-top 5px
</style>