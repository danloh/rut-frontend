<template>
  <div class="demand-main" v-if="requestor"> <!--render after requestor get data-->
    <div class="demand-body">
      <router-link :to="'/demand/' + demand.id"><span style="color:#00838f">{{ demand.body }}</span></router-link>
    </div>
    <div class="demand-bar">
      Requseted by <router-link :to="'/profile/' + requestor.id">{{ requestor.name }}</router-link>
      | {{ vote }}&nbsp;<el-button type="text" @click="upDemand">Upvote</el-button>
      | {{ answercount }}&nbsp;<router-link :to="'/create/' + demand.id"><b>Answer</b></router-link>
      | {{demand.commentcount}}&nbsp;<router-link :to="'/demand/' + demand.id">Discuss</router-link>
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
        return upvoteDemand(demandid)
        .then(resp => {
          this.vote = resp.data
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.demand-main
  padding 5px
  background-color lighten(#f1f3f5, 50%)
  border-bottom 1px dotted #689f38
  .demand-body
    background-color #f1f3f5
    padding 10px
    font-size 1.15em
  .demand-bar
    text-align right
    font-size 0.8em
</style>