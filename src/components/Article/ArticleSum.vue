<template>
  <div class="article" v-if="submitor">
    <el-button class="vote" type="text" @click="uparticle" title="upvote">
      <i class="el-icon-caret-top" style="color:#ff6600"></i>
    </el-button>
    <div class="article-main">
      <div class="article-title">
        <template v-if="article.url">
          {{ article.title }}
          <span class="host">
            <a :href="article.url" target="_blank" rel="nofollow noopener noreferrer">
              ({{ article.url | host }})
            </a>
          </span>
        </template>
        <template v-else-if="showCon">
          <b>{{ article.title }}</b>
        </template>
        <template v-else>
          <router-link :to="'/article/' + article.id">
            {{ article.title }}
          </router-link>
        </template>
      </div>
      <div class="article-bar">
        By
        <template v-if="article.author">
          <a :href="article.url" target="_blank" rel="nofollow noopener noreferrer">
            {{ article.author }}
          </a>
        </template>
        <template v-else>
          <router-link :to="'/profile/' + submitor.id">
            {{ submitor.name }}
          </router-link>
        </template>
        {{ article.timestamp | timeAgo }}
        | {{ vote }}
        <el-button type="text" @click="uparticle">vote</el-button>
        | <span v-if="showCon">{{article.commentcount | pluralise('Comment')}}</span>
          <router-link v-else :to="'/article/' + article.id">
            {{article.commentcount | pluralise('Comment')}}
          </router-link>
      </div>
      <div class="content" v-if="showCon">
        <div v-if="!spoiler" v-html="articleContent"></div>
        <el-button type="text" size="mini" @click="spoiler=!spoiler" v-if="spoiler">
          Spoilers Ahead! Continue?
        </el-button>
        <br>
        <span style="color:grey;font-size:10px" v-if="article.item.id"> 
          This is a review on item: 
          <router-link :to="'/item/' + article.item.id" :title="article.item.title">
            {{ article.item.title.slice(0, 42) }} ...
          </router-link>
        </span>
        <router-link :to="'/editarticle/' + article.id" v-if="canEdit"
                     style="color:green;font-size:10px">
                     ...Edit
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { upvoteArticle } from '@/api/api'
import { checkAuth } from '@/util/auth'
import marked from '@/util/marked'

export default {
  name: 'article-sum',
  props: ['article', 'showCon'],
  data () {
    return {
      vote: this.article.vote,
      spoiler: this.article.spoiler
    }
  },
  computed: {
    submitor () {
      return this.article.submitor
    },
    articleContent () {
      let content = this.article.content
      return content ? marked(content) : ''
    },
    canEdit () {
      return Number(this.article.submitor.id) === Number(this.$store.getters.currentUserID)
    }
  },
  methods: {
    uparticle () {
      if (checkAuth()) {
        let articleid = this.article.id
        upvoteArticle(articleid).then(resp => {
          this.vote = resp.data
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.article
  padding 5px 5px 5px 10px
  position relative
  background-color lighten(#f6f5f2, 50%)
  border-bottom 1px dashed #ddd
  .vote
    position absolute
    top 5px
    left 2px
    text-align center
  .article-main
    padding 5px
    .article-title
      padding 0 5px
      font-size 1.1em
    .content
      padding auto
    .article-bar, .host
      color #828282
      font-size 12px
</style>