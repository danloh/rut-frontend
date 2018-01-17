<template>
  <div>
    <div class="rut-list">
      <rut-sum v-for="rut in rutlist" :key="rut.id" :rut="rut"></rut-sum>
    </div>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" @click="$emit('loadmore')" :disabled="!hasMore">Show More</el-button>
    </div>
    <br>
  </div>
</template>

<script>
import RutSum from './RutSum.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'rut-list',
  props: ['rutlist'],
  components: { RutSum },
  computed: {
    ...mapGetters([
      'currentPage',
      'maxPage'
    ]),
    hasMore () {
      return this.currentPage < this.maxPage
    }
  }
}
</script>

<style lang="stylus" scoped>
.rut-list
  width 100%
</style>