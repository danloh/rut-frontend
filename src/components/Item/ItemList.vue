<template>
  <div>
    <b v-if="flag">{{ flag | titleCase }}: {{ totalCount }}</b>
    <br>
    <item-min-sum v-for="item in items" :key="item.id" :item="item"></item-min-sum>
    <div v-if="hasMore">
      <el-button size="mini" @click="loadMoreItem" :disabled="!hasMore">
        Show More
      </el-button>
    </div>
  </div>
</template>

<script>
import ItemMinSum from './ItemMinSum.vue'
import { fetchItems } from '../../api'

export default {
  name: 'item-list',
  props: {
    per: String,   // should be user,tag
    flag: String,
    id: String,
  },
  components: { ItemMinSum },
  data () {
    return {
      perid: '',
      totalCount: 0,
      items: [],
      paging: 1,
    }
  },
  computed: {
    hasMore () {
      return this.items.length < this.totalCount
    }
  },
  methods: {
    loadItems () {
      let pid = this.perid = this.$route.params.id
      fetchItems(this.per, pid, this.paging, this.flag).then(resp => {
        this.items = resp.data.items
        this.totalCount = resp.data.count
      })
    },
    loadMoreItem () {
      fetchItems(this.per, this.perid, this.paging+1, this.flag).then(resp => {
        let more = resp.data.items
        this.items.push(...more)
        this.paging += 1
      })
    }
  },
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
