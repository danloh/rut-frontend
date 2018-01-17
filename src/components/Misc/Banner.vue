<template>
  <div class="banner" v-show="show">
    <div class="intro">
      <h4>Share Roadmap</h4>
      <p>Share read list, which can be others' roadmap to read up on sth.</p>
    </div>
    <div class="intro mid">
      <h4>Discovery and K.O!</h4>
      <p>We are eager for good books who are eager to find good us too.</p>
    </div>
    <div class="intro">
      <h4>Track Reading</h4>
      <p>track schedule to get done: Record quotes, note or spark of thought.</p>
    </div>
    <a class="close" @click.prevent="show = false">X</a>
  </div>
</template>

<script>
export default {
  name: 'banner',
  data: () => ({
    show: false
  })
}
</script>

<style lang="stylus" scoped>
.banner
  display flex
  min-height 30px
  padding-top 10px
  border-top 2px dotted #cfc0cf
  position relative
  .intro
    padding 5px
    background-color lighten(#eceff1, 60%)
    color #828282
    h4
      margin 2px 0
    p
      font-size 14px
      margin 0
  .mid
    margin 0 5px
  .close
    cursor: pointer
    color transparent
    position absolute
    top 0px
    right 0px
    width 10px
    &:hover
      color #828282
</style>
