<template>
  <div class="item-sum">
    <div>
      <img class="thumb" :src="cover" alt="Cover" referrerPolicy="no-referrer">
    </div>
    <div class="info">
      <span class="title">
        {{item.category}} 
        <template v-if="out"><!--in itemview page, no out to resource link-->
          <b style="color:#337ab7">{{ item.title }}</b>
        </template>
        <template v-else>
          <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
        </template>
      </span>
      <table style="border-spacing:0px;">
        <tr>
          <td><small class="indicator">Byline</small></td>
          <td>{{ item.authors }}</td>
        </tr>
        <tr>
          <td><small class="indicator">Publish&nbsp;</small></td>
          <td>{{ item.publisher }} - {{ item.pubdate }} - {{ item.language }}</td>
        </tr>
        <tr>
          <td><small class="indicator">Edition</small></td>
          <td>{{ item.uiid }} - {{ item.edition }}</td>
        </tr>
        <tr>
          <td><small class="indicator">Listed</small></td>
          <td>
            {{ item.rut_count }} 
          </td>
        </tr>
      </table>
    </div>
    <div class="operate">
    </div>
  </div>
</template>

<script>
import { } from '../../api'

export default {
  name: 'item-sum',
  props: ['item', 'out'], // out for  link to resource
  components: {  },
  data () {
    return {
    }
  },
  computed: {
    cover () {
      return this.item.cover
    }
  },
  methods: {},
  created () {}
}
</script>

<style scoped>
.item-sum {
  background-color: lighten(#f6f6f1, 65%);
  min-height: 135px;
  padding: 10px 115px 10px 115px;
  border-bottom: 1px solid #eee;
  position: relative;
}
.thumb {
  max-width: 100px;
  max-height: 135px;
  position: absolute;
  top: 10px;
  left: 2px;
}
.info {
  font-size: 14px;
  line-height: 1.6em;
}
.info .title {
  font-size: 18px;
}
.info .indicator {
  font-size: 14px;
  color: #777;
}
.info .flag-note {
  color: grey;
}
.operate {
  position: absolute;
  top: 10px;
  right: 2px;
}
</style>