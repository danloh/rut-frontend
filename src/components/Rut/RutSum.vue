<template>
  <div class="rut-sum">
    <span class="title">
      <template v-if="rut.url">
        <b>{{ rut.title }}</b>
        <span class="host">
          <a :href="rut.url" target="_blank">({{ rut.url | host }})</a>
        </span>
      </template>
      <template v-else>
        <router-link :to="'/r/' + rut.id">
          <b>{{ rut.title }}</b>
        </router-link>
      </template>
    </span>
    <router-link :to="'/r/' + rut.id">
      <span>
        <img class="cover" :src="rut.logo" referrerPolicy="no-referrer">
      </span>
      <div class="content" v-html="content"></div>
      <span class="meta" v-if="rut.item_count>0">
        including {{ rut.item_count | pluralise('item') }}  
      </span>
      <span class="meta" v-else>
        <router-link :to="to_url">...view</router-link> 
      </span>
    </router-link>
  </div>
</template>

<script>
import { showLess } from '../../util/filters'
import marked from '../../util/marked'

export default {
  name: 'rut-sum',
  props: ['rut'],
  computed: {
    content () {
      let c = marked(this.rut.content)
      return showLess(c)
    },
    to_url () {
      return this.rut.content ? '/r/' + this.rut.id : '/rforum/' + this.rut.id
    },
  }
}
</script>

<style scoped>
.rut-sum {
  background-color:#f7f7f7;
  min-height: 115px;
  padding: 10px 100px 10px 15px;
  border-bottom: 1px dashed #ddd;
  position: relative;
}
div.rut-sum:hover {
  background-color:  #fcfdfc;
}
.cover {
  position: absolute;
  max-width: 80px;
  max-height: 100px;
  top: 10px;
  right: 10px;
}
.title {
  font-size: 20px;
  padding-top: 10px;
}
.title .host {
  color: #828282;
  font-size: 16px;
}
.content {
  color: #828282;
  font-size: 16px;
}
.meta {
  font-size: 14px;
  color: #337ab7;
}
</style>