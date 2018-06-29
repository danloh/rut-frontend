<template>
  <div class="headline-page">
    <div class="headline-main">
      <div class="submenu">
        <b>News For Readers&nbsp;&nbsp;</b>
        <router-link to="/headlines/top">Top</router-link>
        <router-link to="/headlines/new">New</router-link>
        <el-button type="text" style="float:right" v-if="canSub"
                   @click="showForm=!showForm">
                   Submit
        </el-button>
      </div>
      <div v-show="showForm">
        <headline-form :show.sync="showForm"></headline-form>
      </div>
      <div class="headline-view">
        <router-view></router-view>
      </div>
    </div>
    <div class="headline-side">
      <p class="right-item">
        On-Topic: Anything About Reading/Learning
      </p>
    </div>
  </div>
</template>

<script>
import { checkAuth } from '@/util/auth'
import HeadlineForm from '@/components/Headline/HeadlineForm.vue'

export default {
  name: 'headlines',
  title: 'News For Readers',
  components: { HeadlineForm },
  data () {
    return {
      canSub: checkAuth(),
      showForm: false
    }
  }
}
</script>

<style lang="stylus" scoped>
.headline-page
  padding 10px 200px 10px 0px
  position relative
  .headline-main
    .submenu
      margin-bottom 5px
      a
        color grey
        margin-right 0.85em
        &:hover
          color darkgreen
        &.router-link-active
          color orange
          font-weight 800
  .headline-side
    position absolute
    top 10px
    right 0
    width 180px
    background-color lighten(#e5ebe4, 50%)
    padding 5px
    .right-title
      padding 2px 5px
    .right-item
      padding 2px 5px
      font-size 0.8em
</style>