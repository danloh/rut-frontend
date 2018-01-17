<template>
  <div>
    <!-- <p style="font-size:0.85em">Get Together with Books, etc.</p> -->
    <div class="circle-list" v-for="circle in circles" :key="circle.id">
      <b>{{ circle.name }}</b>&nbsp;&nbsp;
      <router-link :to="'/profile/' + circle.facilitator.id" style="font-size:0.85em">{{ circle.facilitator.name.slice(0, 12) }}</router-link>
      <p>{{ circle.note }}</p>
      <p class="meta"><i class="el-icon-location-outline"></i> {{ circle.area }}</p>
      <p class="meta"><i class="el-icon-location"></i> {{ circle.address }}</p>
      <p class="meta"><i class="el-icon-time"></i> {{ circle.time }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'circle-list',
  props: ['circles']
}
</script>

<style lang="stylus" scoped>
.circle-list
  width 100%
  border-top 2px solid #eee
  padding 5px 0
.meta
  font-size 0.75em
  color green
  margin 0
</style>