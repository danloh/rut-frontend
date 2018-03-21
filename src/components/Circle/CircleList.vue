<template>
  <div>
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
  padding auto
.meta
  font-size 0.75em
  color green
  margin 0
</style>