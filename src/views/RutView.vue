<template>
  <div class="rut-page" v-if="rut">
    <div class="rut-view">
      <div class="tagbar">
        <el-button type="text" @click="toAddTag">+Tag:</el-button>
        <span class="tag" v-for="(tag, index) in tags" :key="index">
          <router-link :to="'/tag/' + tag"><b>{{tag}}</b></router-link>
          <sup class="hiden-del-tag" @click="onDelTag(tag, index)">X</sup>
        </span>
      </div>
      <!-- edit tag dialog -->
      <el-dialog title="Add Tag" width="350px" 
                 :visible.sync="show">
        <el-input size="mini" v-model="newTag" 
                  @keyup.enter.native="addNewTag" 
                  placeholder="Input a Tag, Press Enter to Add">
        </el-input>
        <div v-for="(tag, index) in newTags" :key="index">
          <span>
            <el-button type="text" size="mini" @click="newTags.splice(index, 1)">
              &times;
            </el-button>&nbsp;&nbsp; 
            {{ tag }} 
          </span>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" size="mini" @click="onAddTags">Add</el-button>
        </div>
      </el-dialog>
      <!-- end edit tag dialog -->
      <div class="title">
        <h2>{{ rutTitle }}</h2>
        <div class="meta">
          <template>
            <span v-if="rut.author_id">
              <a :href="gen_url" target="_blank">{{ rut.author_id }}</a>
            </span>
            <span v-else>
              <router-link :to="'/p/' + rut.uname">{{ rut.uname }}</router-link>
            </span>
          </template>
          | <span> {{ rut.renew_at | toMDY }}</span>
          | including {{ rut.item_count | pluralise('item') }} 
          | <router-link :to="'/rforum/' + rutid">
              {{ rut.comment_count | pluralise('Comment') }}
            </router-link>
          <router-link :to="'/update/r/' + rutid" v-if="canEdit">
            <b> | Edit...</b>
          </router-link>
          <router-link :to="'/collect/' + rutid" v-if="canEdit">
            <b> | Add...</b>
          </router-link>
        </div>
      </div>
      <div class="content">
        <div v-html="md(rut.content)"></div>
      </div>
    </div>
    <collect-sum class="item" v-for="i in order_collects" :key="i.id" 
                 :collect="i" :canEdit="canEdit">
    </collect-sum>
    <div class="toolbar">
      <el-button type="text" @click="starOrUnstarRut">
        {{ starStatus === 'unstar' ? 'Star' : 'Unstar' }}
      </el-button>
      <share-bar></share-bar>
    </div>
    <div class="rut-side">
      <div class="credential">
        <span class="credential-title">About Creator(s)</span>
        <div class="credential-body">
          <span>{{ rut.author_id }}: </span>
          <span>{{ rut.credential }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  fetchItems, fetchCollects, fetchTags, tagRut, checkStarRut, starRut 
} from '../api'
import { checkAuth } from '../util/auth'
import marked from '../util/marked'
import CollectSum from '../components/Item/CollectSum.vue'
import ShareBar from '../components/Misc/ShareBar.vue'

export default {
  name: 'rut-view',
  components: { CollectSum, ShareBar },
  data () {
    return {
      rutTitle: '',
      rutid: '',
      items: [],
      collects: [],
      starStatus: '',
      tags: [],
      show: false,  // show dialog
      rut_uname: '',
      newTag: '',
      newTags: [],
      delTags: []  // ?? how to del
    }
  },
  computed: {
    rut () {
      return this.$store.state.rut.ruts[this.$route.params.id]
    },
    order_collects () {
      return this.collects.sort((a,b) => a.item_order - b.item_order)
    },
    gen_url () {
      let a_url = this.rut.url 
      return a_url 
              ? a_url 
              : 'https://www.google.com/search?q=' + this.rut.author_id
    },
    canEdit () {
      return this.rut_uname === this.$store.getters.actID && checkAuth()
    }
  },
  title () {
    return this.rutTitle
  },
  methods: {
    loadRut () {
      let rid = this.rutid =  this.$route.params.id
      this.$store.dispatch('getRut', rid).then(resp => {
        this.rutTitle = resp.title
        this.loadItems(rid)
        this.loadTags(rid)
        this.rut_uname = resp.uname
      })
    },
    loadItems (rutid) { // can be async??
      fetchItems('rut', rutid).then(resp => {
        let item_data = resp.data.items
        this.items = item_data
        fetchCollects('rut', rutid).then(resp => {
          for (let c of resp.data.collects) {
            for (let i of item_data ) {
              if ( c.item_id === i.id ) {
                let clct = {
                  cid: c.id,
                  rutid: c.rut_id,
                  uname: c.uname,
                  item_order: c.item_order,
                  content: c.content,
                }
                Object.assign(clct, i)
                this.collects.push(clct)
              }
            }
          }
        })
      })
    },
    loadTags (rutid) {
      fetchTags('rut', rutid).then(resp => {
        this.tags = resp.data.tags
        // this.newTags = this.tags
      })
    },
    toAddTag () {
      if (!checkAuth()) {
        this.$message("Need to Log in")
        return
      }
      this.show = true
    },
    addNewTag () {
      let newT = this.newTag.trim().replace(/[ ]/gi, '-')
      if (newT && newT.length < 42 ) {
        this.newTags.push(newT)
        this.newTag = ''
      } else {
        this.$message({
          showClose: true,
          message: 'Must be 42 less and no whitespace'
        })
      }
    },
    onAddTags () {
      if (checkAuth()) { 
        if (this.newTags.length <= 0) return
        let newTs = Array.from(new Set(this.newTags))
        let add_data = {
          tnames: newTs,
          rut_id: this.rutid,
          action: '1'
        }
        tagRut(1, this.rutid, add_data)
        //tagRut(0, this.rutid, del_data)
        this.show = false
        this.tags = this.tags.concat(newTs)
      } else {
        this.$message({
          showClose: true,
          message: 'Should Log in to Continue'
        })
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
    },
    onDelTag(tag, index){
      if (!checkAuth()) return
      let cf = confirm('Are You Sure to Delete this Tag?')
      if (!cf) return
      let del_data = {
        tnames: [tag],
        rut_id: this.rutid,
        action: '0'
      }
      tagRut(0, this.rutid, del_data).then(
        () => this.tags.splice(index, 1)
      )
    },
    checkStar () {
      if (checkAuth()) {
        // here a issue, login-close-open again, 
        // can checkAuth but 401, auth state issue
        checkStarRut(this.rutid).then(resp => {
          if (resp.data.status !== 200) return
          this.starStatus = resp.data.message
        })
      } else {
        this.starStatus = 'unstar'
      }
    },
    starOrUnstarRut () {
      if (!checkAuth()) {
        this.$message({ message: 'Please Login'})
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
      let rutid = this.rutid
      if (this.starStatus === 'unstar') {
        starRut(rutid, 1).then(resp => {
          this.starStatus = resp.data.message
        })
      } else {
        starRut(rutid, 0).then(resp => {
          this.starStatus = resp.data.message
        })
      }
    },
    md (content) { return marked(content) }
  },
  watch: {
    '$route': 'loadRut' // render re-used component for addtorut
  },
  created () {
    this.loadRut()
    this.checkStar()
  }
}
</script>

<style scoped>
.rut-page {
  padding: 10px 250px 10px 0px;
  position: relative;
}
.rut-page .rut-view {
  background-color: #f5f7f8;
  padding: auto;
}
.rut-view .tagbar {
  display:inline-blcok;
}
.tagbar .tag {
  padding: 2px 5px;
  background-color: #eef4fa;
}
.tag a {
  color: green;
  font-size: 0.85em;
}
.tag a:hover {
  background-color: #ddd;
  padding: 2px;
}
.hiden-del-tag {
  cursor: pointer;
  color: transparent;
}
.hiden-del-tag:hover {
  color: orangered;
  font-size: 10px;
}
.rut-view .title {
    padding: 0 10px;
}
.rut-view .title .meta {
  color: #828282;
  font-size: 12px;
  padding-bottom: 10px;
}
.rut-view .content, .item {
  background-color: #fbfbf8;
  padding: 10px;
  border-bottom: 1px dashed #eee;
}
.toolbar {
  display: flex;
  justify-content: flex-end;
  font-size: 0.85em;
}
.rut-page .rut-side {
  position: absolute;
  right: 0;
  top: 10px;
  width: 240px;
}
.credential {
  background-color: #f5f9f5;
  margin-bottom: 10px;
}
.credential-title {
  padding: 2px 10px;
  color: #3c763d;
  font-size: 12px;
}
.credential-body {
  padding: 0 10px;
  min-height: 45px;
  font-size: 0.85em;
}
</style>
