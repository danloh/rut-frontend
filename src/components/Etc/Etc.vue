<template>
  <div class="etc-view">
    <div v-if="etc" class="etc">
      <div class="by" :id="'etc' + etcid">
        <router-link :to="'/p/' + etc.uname">
          <b>{{ etc.uname }}</b>
        </router-link>
        &nbsp; {{ etc.post_at | timeAgo }}
      </div>
      <div class="content" v-html="etcContent"></div>
      <!-- <el-button type="text" size="mini" @click="upEtc" title="like">
        <small style="color:#aaa">Like</small>
      </el-button> -->
      <el-button type="text" size="mini" @click="showRe = !showRe">
        <small style="color:#aaa">
          {{ showRe ? 'Hide' : childEtcs.length + '&nbsp; Reply' }}
        </small>
      </el-button>
      <div class="etc-children" v-show="showRe">
        <!--recursively use component-->
        <etc v-for="ce in childEtcs" :etc="ce" :key="ce.id"></etc>
        <reply class="reply" :refer="refer" 
               :show.sync="showRe" @newreply="updateNew">
        </reply> <!--sync, hide or show input once Post-->
      </div>
    </div>
  </div>
</template>

<script>
import Reply from './Reply.vue'
import marked from '../../util/marked'
import { checkAuth } from '../../util/auth'
import { fetchEtcs } from '../../api'
import { regTag } from '../../util/constant'

export default {
  name: 'etc',
  props: ['etc'],
  components: { Reply },
  data () {
    return {
      showRe: false,
      childEtcs: [],
      childCount: 0,
      etcid: this.etc.id,
      refer: { per: 'petc', perid: this.etc.id } // Reply's prop
    }
  },
  computed: {
    etcContent () {
      return marked(
        this.etc.content
      )//.replace(regTag, ' <a href="/tag/$1"><small>#$1</small></a>')
    }
  },
  methods: {
    getEtcChildren () {
      fetchEtcs('petc', this.etc.id).then(resp => {
        let data = resp.data
        this.childEtcs = data.etcs
        this.childCount = data.count
      })
    },
    updateNew (data) {
      this.childEtcs.unshift(data)
    },
  },
  created () {
    this.getEtcChildren()
  }
}
</script>

<style scoped>
.etc-view {
  background-color: #fcfcfb;
  border-top: 1px dashed #ddd;
  padding: 5px 2px 5px 5px;
  position: relative;
}
.avatar {
  position: absolute;
  top: 20px;
  left: 2px;
}
.etc {
  padding: 5px;
}
.etc .by {
  font-size: 10px;
  margin: 2px 0;
  color: #bbb;
}
.by a {
  color: #828282;
  text-decoration: underline;
}
.etc a:hover {
  color: #ff6600;
}
.etc .etc-children {
  margin-left: 0.5em;
  border-left: 0.5px solid #eee;
}
</style>
