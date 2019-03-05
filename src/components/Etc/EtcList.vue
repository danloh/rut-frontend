<template>
  <div class="etc-list">  
    <small style="font-size:0.8em">{{ etcCount | pluralise('Post') }}</small>
    <etc v-for="etc in etcs" :etc="etc" :key="etc.id" ></etc>
    <!-- <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreEtc" 
                 :disabled="!hasMore">
                 Show More
      </el-button>
    </div> -->
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
      etcCount: 0,
      currentPage: 1,
    }
  },
  computed: {
    // hasMore () {
    //   return this.etcs.length < this.etcCount
    // }
  },
  methods: {
    loadEtcs () {
      fetchEtcs(this.refer.per, this.refer.perid).then(resp => {
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

<style scoped>
.etc-list {
  position: relative;
}
</style>
