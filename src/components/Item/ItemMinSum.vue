<template>
  <div class="item-info">
    <sup class="indicator" v-if="item.item_order">#{{item.item_order}}&nbsp;</sup> 
    <router-link :to="'/item/' + item.slug">{{ item.title }}</router-link>
    <small class="meta">
      <br>{{item.category}} |&nbsp;{{item.uiid}} |&nbsp;{{item.authors}} |&nbsp;{{ item.pub_at }}
      <a :href="item.url" v-if="item.url">&nbsp;...src</a>
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
  padding: 5px 40px 5px 5px;
  position: relative;
  background-color: #f5f7f8;
  border-bottom: 1px dashed #ddd;
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
  top: 5px;
  right: 2px;
}
</style>