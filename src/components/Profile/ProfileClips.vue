<template>
  <div class="clip-list">
    <b>CLIPS {{ clipCount }}</b>
    <clip v-for="clip in clips" :key="clip.id" :clip="clip"></clip>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreClip" 
                 :disabled="!hasMore">
                 Show More
      </el-button>
    </div>
  </div>
</template>

<script>
import Clip from '@/components/Challenge/Clip.vue'
import { fetchIUClips } from '@/api/api'

export default {
  name: 'profile-clip',
  components: { Clip },
  data () {
    return {
      clips: [],
      currentPage: 1,
      clipCount: 0
    }
  },
  computed: {
    hasMore () {
      return this.clips.length < this.clipCount
    }
  },
  created () {
    this.loadClips()
  },
  methods: {
    loadmoreClip () {
      let userid = this.$route.params.id
      let params = {'userid': userid, 'page': this.currentPage}
      fetchIUClips(params).then(resp => {
        this.clips.push(...resp.data.clips)
        this.currentPage += 1
      })
    },
    loadClips () {
      let userid = this.$route.params.id
      let param = {'userid': userid}
      fetchIUClips(param).then(resp => {
        let data = resp.data
        this.clips = data.clips
        this.clipCount = data.total
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.clip-list
  padding auto
</style>
