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
import { fetchTagRuts, fetchTagID } from '@/api/api'

export default {
  name: 'tag-ruts',
  components: { RutSum },
  data () {
    return {
      tagid: null,
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
      let tagparam = this.$route.params.id
      if (tagparam.startsWith('@')) {
        fetchTagID(tagparam).then(resp => {
          this.tagid = resp.data
          this.fetchRuts(this.tagid)
        })
      } else {
        this.tagid = tagparam
        this.fetchRuts(this.tagid)
      }
    },
    fetchRuts (tagid) {
      fetchTagRuts(tagid).then(resp => {
        let data = resp.data
        this.ruts = data.ruts
        this.rutCount = data.rutcount
      })
    },
    loadmoreRuts () {
      let param = {'page': this.currentPage}
      fetchTagRuts(this.tagid, param).then(resp => {
        this.ruts.push(...resp.data.ruts)
        this.currentPage += 1
      })
    }
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