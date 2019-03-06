<template>
  <div class="rut-page" v-if="rut">
    <div class="rut-view">
      <div class="tagbar">
        <el-button type="text" @click="toAddTag">+Tag:</el-button>
        <span class="tag" v-for="(tag, index) in tags" :key="index">
          <router-link :to="'/tag/' + tag"><b>{{tag}}</b></router-link>
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
        <p class="meta">
          <template>
            <span v-if="rut.author_id">
              <a :href="rut.url" v-if="rut.url">{{ rut.author_id }}</a>
            </span>
            <span v-else>
              <router-link :to="'/p/' + rut.uname">{{ rut.uname }}</router-link>
            </span>
          </template>
          | Created: {{ rut.create_at | toMDY }} 
          <span v-if="rut.renew_at"> | Updated: {{ rut.renew_at | toMDY }}</span>
          | including {{ rut.item_count | pluralise('item') }} 
          | <router-link :to="'/rforum/' + rutid">
              {{ rut.comment_count | pluralise('Comment') }}
            </router-link>
        </p>
      </div>
      <div class="content">
        <div v-html="md(rut.content)"></div>
      </div>
    </div>
    <collect-sum class="item" v-for="i in order_collects" :key="i.id" 
                 :collect="i" :canEdit="canEdit">
    </collect-sum>
    <div class="sharebar">
      <share-bar></share-bar>
    </div>
    <div class="rut-side">
      <el-button size="mini" @click="starOrUnstarRut">
        {{ starStatus === 'unstar' ? 'Star' : 'Unstar' }}
      </el-button>
      <router-link :to="'/update/r/' + rutid" v-if="canEdit">
        <small> Edit...</small>
      </router-link>
      <router-link :to="'/collect/' + rutid" v-if="canEdit">
        <small> Add...</small>
      </router-link>
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
      let newT = this.newTag.trim()
      if (newT && newT.length < 16 && !newT.includes(" ")) {
        this.newTags.push(newT)
        this.newTag = ''
      } else {
        this.$message({
          showClose: true,
          message: 'Must be 16 less and no whitespace'
        })
      }
    },
    onAddTags () {
      if (checkAuth()) { 
        if (this.newTags.length <= 0) return
        let newTs = Array.from(new Set(this.newTags))
        let add_data = {
          tname: newTs,
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
    checkStar () {
      if (checkAuth()) {
        // let rutid = this.$route.params.id // ?? liftcycle timing
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
      if (this.starStatus === 'unstar') { // ??, can not act star?? 
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
.rut-view .title {
    padding: 0 10px;
}
.rut-view .title .meta {
  color: #828282;
  font-size: 12px;
}
.rut-view .content, .item {
  background-color: #fbfbf8;
  padding: 10px;
  border-bottom: 1px dashed #eee;
}
.rut-view .sharebar {
  font-size: .85em;
  padding: 5px;
  text-align: right;
}
.rut-page .rut-side {
  position: absolute;
  right: 0;
  top: 10px;
  width: 240px;
}
</style>
