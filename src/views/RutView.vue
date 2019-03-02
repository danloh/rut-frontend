<template>
  <div class="rut-page" v-if="rut">
    <div class="rut-view">
      <div class="tagbar">
        <span class="tag" v-for="(tag, index) in tags" :key="index">
          <router-link :to="'/tag/' + tag"><b>{{tag}}</b></router-link>
        </span>
        <el-button type="text" @click="toAddTag">..Tag</el-button>
      </div>
      <!-- edit tag dialog -->
      <el-dialog title="Add Tag" width="350px" 
                 :visible.sync="show" 
                 :before-close="cancelOnClose">
        <el-input size="mini" v-model="newTag" 
                  @keyup.enter.native="addNewTag" 
                  placeholder="Input a Tag, Press Enter to Add">
        </el-input>
        <div v-for="(tag, index) in newTags" :key="index">
          <p><el-button type="text" size="mini" 
                        @click="newTags.splice(index, 1)">
                        &times;
              </el-button>&nbsp;&nbsp; 
              {{ tag }} 
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" size="mini" @click="onAddTags">Done</el-button>
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
              <router-link :to="'/p/' + rut.user_id">{{ rut.user_name }}</router-link>
            </span>
          </template>
          | Created: {{ rut.create_at | toMDY }} 
          <!-- <span v-if="rut.renewat"> | Updated: {{ rut.renewat | toMDY }}</span> -->
          | including {{ rut.item_count | pluralise('item') }} 
        </p>
      </div>
      <div class="content">
        <div v-html="md(rut.content)"></div>
      </div>
    </div>
    <div class="item" v-for="i in order_collects" :key="i.id">
      <div>
        <b class="indicator">#{{i.item_order}}&nbsp;</b> 
        <router-link :to="'/item/' + i.id">{{ i.title }}</router-link>
      </div>
      <div v-html="md(i.content)"></div>
    </div>
    <div class="sharebar">
      <share-bar></share-bar>
    </div>
    <div class="rut-side">
      <router-link :to="'/update/r/' + rutid" v-if="canEdit">
        <small>Edit...</small>
      </router-link>
      <router-link :to="'/collect/' + rutid" v-if="canEdit">
        <small>Add...</small>
      </router-link>
    </div>
  </div>
</template>

<script>
import { fetchItems, fetchCollect, fetchTags, tagRut } from '../api'
import { checkAuth } from '../util/auth'
import marked from '../util/marked'
import ShareBar from '@/components/Misc/ShareBar.vue'

export default {
  name: 'rut-view',
  components: { ShareBar },
  data () {
    return {
      rutTitle: '',
      rutid: '',
      items: [],
      collects: [],
      tags: [],
      show: false,  // show dialog
      rut_userid: '',
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
      return this.rut_userid === this.$store.getters.actID && checkAuth()
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
        this.rut_userid = resp.user_id
      })
    },
    loadItems (rutid) { // can be async??
      fetchItems('rut', rutid).then(resp => {
        let item_data = resp.data.items
        this.items = item_data
        for (let i of item_data) {
          let itemid = i.id
          fetchCollect(rutid, itemid).then(resp => {
            let data = resp.data.collects[0]
            let clct = {
              rutid: data.rut_id,
              item_order: data.item_order,
              content: data.content,
            }
            Object.assign(clct, i)
            this.collects.push(clct)
          })
        }
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
    cancelOnClose (done) { done() },
    md (content) { return marked(content) }
  },
  watch: {
    '$route': 'loadRut' // render re-used component for addtorut
  },
  created () {
    this.loadRut()
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
.rut-view .content, 
.rut-view .item {
  background-color: #fbfbf8;
  padding: 5px 10px;
  border-bottom: 2px solid #eee;
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
