<template>
  <div>
    <!-- <p style="font-size:0.85em">Get Together with Books, etc.</p> -->
    <div class="circle-list" v-for="circle in circles" :key="circle.id">
      <circle-sum :circleObj="circle"></circle-sum>
    </div>
  </div>
</template>

<script>
import CircleSum from '@/components/Circle/CircleSum.vue'

export default {
  name: 'circle-list',
  props: ['circles'],
  components: { CircleSum }
}
</script>

<style lang="stylus" scoped>
.circle-list
  width 100%
  padding 5px 0
.meta
  font-size 0.75em
  color green
  margin 0
</style>