<template>
  <div class="item-info">
    <sup class="indicator" v-if="item.item_order">#{{item.item_order}}&nbsp;</sup> 
    <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
    <small class="meta">
      <br>{{item.category}} |&nbsp;{{item.uiid}} |&nbsp;{{item.authors}} |&nbsp;{{ item.pub_at }}
    </small>
    <span>
      <img class="thumb" :src="item.cover" referrerPolicy="no-referrer">
    </span>
  </div>
</template>

<script>
export default {
  name: 'item-min-sum',
  props: ['item']
}
</script>

<style scoped>
.item-info {
  padding-right: 40px;
  position: relative;
  border-bottom: 0.5px dashed #ddd;
}
.item-info .indicator {
  font-size: 0.6em;
  color:seagreen;
}
.item-info .meta {
  color: #aaa;
  font-size: 14px;
}
.item-info .thumb {
  position: absolute;
  max-width: 40px;
  max-height: 40px;
  top: 0px;
  right: 0px;
}
</style>