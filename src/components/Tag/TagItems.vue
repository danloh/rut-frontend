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
import ItemSum from '../Item/ItemSum.vue'
import { fetchTagItems } from '../../api'

export default {
  name: 'tag-items',
  data () {
    return {
      tagname: null,
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
      this.tagname = this.$route.params.name
      fetchTagItems(this.tagname).then(resp => {
        let data = resp.data
        this.items = data.items
        this.itemCount = data.itemcount
      })
    },
    loadmoreItems () {
      let param = {'page': this.currentPage}
      fetchTagItems(this.tagname, param).then(resp => {
        this.items.push(...resp.data.items)
        this.currentPage += 1
      })
    }
  },
  // watch: {
  //   '$route.params.name': 'loadItems'
  // },
  created () {
    this.loadItems()
  }
}
</script>

<style scoped>
.item-list {
  width: 100%;
  margin-top: 5px;
}
</style>