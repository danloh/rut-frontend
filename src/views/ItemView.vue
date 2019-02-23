<template>
  <div class="item-page" v-if="itemTitle">
    <div class="item-main">
      <item-sum :item="item" :out="true" :key="item.id"></item-sum> <!--key to re-render-->
      <div>
        <b>More Details</b>
      </div>
      <div class="item-detail">
        <div v-html="showDetail || '...'"></div>
        <el-button type="text" size="mini" @click="showShort=false" v-if="showShort">
          ...More
        </el-button>
      </div>
    </div>
    <div class="item-side">
    </div>
  </div>
</template>

<script>
import ItemSum from '@/components/Item/ItemSum.vue'
import marked from '../util/marked'
import { showLess } from '@/util/filters'

export default {
  name: 'item-view',
  title () {
    return this.itemDetail
  },
  components: { ItemSum },
  data () {
    return {
      itemTitle: '',
      itemDetail: '',
      showShort: true, // show less detail
    }
  },
  computed: {
    item () {
      return this.$store.state.item.items[this.$route.params.id]
    },
    showDetail () {
      let content = marked(this.itemDetail)
      let least = 255
      let less = content.length > least && this.showShort
      if (less) {
        return showLess(content, least)
      } else {
        this.showShort = false
        return content
      }
    }
  },
  methods: {
    loadItem () {
      let itemid = this.$route.params.id
      this.$store.dispatch('getItem', itemid).then(resp => {
        this.itemDetail = resp.detail
        this.itemTitle = resp.title
      })
    }
  },
  created () {
    this.loadItem()
  }
}
</script>

<style lang="stylus" scoped>
.item-page {
  padding: 10px 255px 10px 0px;
  position: relative;
}
.item-main {
  margin-top: 5px;
}
.item-detail {
  background-color: lighten(#f0f3f0, 45%);
  padding: 5px;
}
.item-side {
  position: absolute;
  top: 10px;
  right: 0;
  width: 245px;
}
</style>
