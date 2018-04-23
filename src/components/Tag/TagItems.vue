<template>
  <div class="item-list">
    <item-sum v-for="item in items" :key="item.id" :item="item"></item-sum>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                  @click="loadmoreItems" :disabled="!hasMore">
                  Show More
      </el-button>
    </div>
  </div>
</template>

<script>
import ItemSum from '@/components/Item/ItemSum.vue'
import { fetchTagItems, fetchTagID } from '@/api/api'

export default {
  name: 'tag-items',
  data () {
    return {
      tagid: null,
      itemCount: 0,
      items: [],
      currentPage: 1
    }
  },
  components: { ItemSum },
  computed: {
    hasMore () {
      return this.items.length < this.itemCount
    }
  },
  methods: {
    loadItems () {
      let tagparam = this.$route.params.id
      if (tagparam.startsWith('@')) {
        fetchTagID(tagparam).then(resp => {
          this.tagid = resp.data
          this.fetchItems(this.tagid)
        })
      } else {
        this.tagid = tagparam
        this.fetchItems(this.tagid)
      }
    },
    fetchItems (tagid) {
      fetchTagItems(tagid).then(resp => {
        let data = resp.data
        this.items = data.items
        this.itemCount = data.itemcount
      })
    },
    loadmoreItems () {
      let param = {'page': this.currentPage}
      fetchTagItems(this.tagid, param).then(resp => {
        this.items.push(...resp.data.items)
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