<template>
  <div class="demand-main" v-if="requestor"> <!--render after requestor get data-->
    <div class="demand-body">
      <router-link :to="'/demand/' + demand.id">
        <b>{{ demand.body }}</b>
      </router-link>
    </div>
    <div class="demand-bar">
      <router-link :to="'/tag/' + demand.tag.id" v-if="demand.tag.tagname">
        #{{ demand.tag.tagname }}
      </router-link>
      -by <router-link :to="'/profile/' + requestor.id">
          {{ requestor.name }}
        </router-link>
      | {{ vote }}&nbsp;<el-button type="text" @click="upDemand">vote</el-button>
      | <router-link :to="'/create/' + demand.id">
          {{ answercount | pluralise('Answer') }}
        </router-link>
      - <router-link :to="'/demand/' + demand.id">
          {{demand.commentcount | pluralise('Comment')}}
        </router-link>
    </div>
  </div>
</template>

<script>
import { upvoteDemand } from '@/api/api'
import { checkAuth } from '@/util/auth'

export default {
  name: 'demand',
  props: ['demand'],
  data () {
    return {
      vote: this.demand.vote,
      answercount: this.demand.answercount
    }
  },
  computed: {
    requestor () {
      return this.demand.requestor
    }
  },
  methods: {
    upDemand () {
      if (checkAuth()) {
        let demandid = this.demand.id
        upvoteDemand(demandid).then(resp => {
          this.vote = resp.data
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.demand-main
  padding 10px
  background-color lighten(#f1f3f5, 50%)
  border-bottom 1px dashed #ddd
  .demand-body
    font-size 1.1em
    a
      color #00838f
      &:hover
        color #409eff
  .demand-bar
    font-size 0.75em
</style>