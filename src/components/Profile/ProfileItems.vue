<template>
  <div>
    <b>{{flag.toUpperCase()}} {{totalItems}}</b>
    <div class="item-list">
      <item-sum v-for="item in currentItems" :key="item.id" :item="item"></item-sum>
      <div v-if="hasMore">
        <el-button class="blockbtn" size="mini" 
                   @click="loadmoreItems" 
                   :disabled="!hasMore">
                   Show More
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ItemSum from '@/components/Item/ItemSum.vue'
import { fetchProfileItems } from '@/api/api'

export default {
  name: 'profile-items',
  props: {
    flag: String // tobe: doing, todo, done
  },
  data () {
    return {
      totalItems: 0,
      currentItems: [],
      currentPage: 1
    }
  },
  components: { ItemSum },
  computed: {
    hasMore () {
      return this.currentItems.length < this.totalItems
    }
  },
  methods: {
    loadItems () {
      let flag = this.flag
      let userid = this.$route.params.id
      fetchProfileItems(flag, userid).then(resp => {
        this.totalItems = resp.data.total
        this.currentItems = resp.data.items
      })
    },
    loadmoreItems () {
      let flag = this.flag
      let userid = this.$route.params.id
      let param = {'page': this.currentPage}
      fetchProfileItems(flag, userid, param).then(resp => {
        this.currentItems.push(...resp.data.items)
        this.currentPage += 1
      })
    }
  },
  created () {
    this.loadItems()
  }
}
</script>

<style lang="stylus" scoped>
.item-list
  width 100%
  margin-top 5px
</style>