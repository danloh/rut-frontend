<template>
  <div id="app">
    <header class="header">
      <nav class="nav-menu">
        <router-link to="/">
            <small style="color:darkorange;font-size:1.2em;letter-spacing:0.005em">
              RutHub<sup style="font-size:0.5em;color:grey"> alpha</sup>
            </small>
        </router-link>
      </nav>
    </header>
    <div class="view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style lang="stylus">
$tfonts = Lato, Roboto, Open Sans, serif
$bfonts = Lato, Roboto, Open Sans, sans-serif
body
  font-family $bfonts
  font-size 18px
  line-height 1.6em
  background-color lighten(#eceef1, 30%)
  margin 0
  color #34495e
  overflow-y scroll
  overflow-x scroll
  overflow-wrap break-word
a
  color #37a
  text-decoration none
  &:hover
    color green
h2, h3, h4
  margin 8px 0
  line-height 1.2em
  font-family $tfonts
p
  margin 5px 0
pre
  background-color #f0f0f0
  padding 5px
blockquote
  border-left: 3px solid lighten(orange, 80%)
  margin: 5px
  padding-left: 12px
.header
  background-color #f5f5f5
  border-bottom 2px solid #eee
  z-index 999
  height 42px
  top 0
  left 0
  right 0
  .nav-menu
    max-width 960px
    min-width 800px
    box-sizing border-box
    margin 0px auto
    padding 6px 0px
    .right-menu
      float right
  a
    color #080400
    line-height 24px
    display inline-block
    vertical-align middle
    letter-spacing .075em
    margin-right 0.85em
    &:hover
      color orange
    &.router-link-active
      color green
.blockbtn
  display block
  margin 5px 0
  width 100%
  text-align center
.view
  max-width 960px
  min-width 800px
  min-height 42em
  width 100%
  margin 0 auto
  position relative
.submenu
  margin-bottom 5px
  border-bottom 1px solid #eee
  a
    color grey
    margin-right 0.85em
    &:hover
      color darkgreen
    &.router-link-active
      color orange
      font-weight 800
</style>
