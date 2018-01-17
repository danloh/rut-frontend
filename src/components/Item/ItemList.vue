<template>
  <div>
    <div class="item-list">
      <item-sum v-for="item in items" :key="item.id" :item="item"></item-sum>
    </div>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" @click="$emit('loadmore')" :disabled="!hasMore">Show More</el-button>
    </div>
    <br>
  </div>
</template>

<script>
import ItemSum from './ItemSum.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'item-list',
  props: ['items'],
  components: { ItemSum },
  computed: {
    ...mapGetters([
      'currentR',
      'maxR'
    ]),
    hasMore () {
      return this.currentR < this.maxR
    }
  }
}
</script>

<style lang="stylus" scoped>
.item-list
  width 100%
</style>