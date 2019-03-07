<template>
  <div class="etc-list">
    <etc v-for="etc in etcs" :etc="etc" :key="etc.id" ></etc>
    <div v-if="hasMore">
      <el-button size="mini" @click="loadMoreEtc" :disabled="!hasMore">
        Show More
      </el-button>
    </div>
    <reply class="reply" :refer="refer" :show="true" @newreply="updateNew"></reply>
  </div>
</template>

<script>
import { newEtc, fetchEtcs } from '../../api'
import Etc from './Etc.vue'
import Reply from './Reply.vue'

export default {
  name: 'etc-list',
  components: { Etc, Reply },
  props: {
    refer: Object, //{per: String, perid: String,}  // should be user,item,tag
  },
  data () {
    return {
      etcs: [],
      paging: 1,
      hasMore: true,
    }
  },
  computed: {},
  methods: {
    loadEtcs () {
      fetchEtcs(this.refer.per, this.refer.perid).then(resp => {
        let data = resp.data
        this.etcs = data.etcs
        this.hasMore = this.etcs.length >= 20 // maybe not sure has more
      })
    },
    loadMoreEtc () {
      fetchEtcs(this.refer.per, this.refer.perid, this.paging + 1).then(resp => {
        let more = resp.data.etcs
        if (more.length === 0) {
          this.hasMore = false
          return
        }
        this.etcs.push(...more)
        this.paging += 1
      })
    },
    updateNew (data) {
      this.etcs.unshift(data)
    }
  },
  created () {
    this.loadEtcs()
  }
}
</script>

<style scoped>
.etc-list {
  position: relative;
}
</style>
