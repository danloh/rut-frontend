<template>
  <div class="tag-page">
    <div class="tag-side">
      <h4 class="sidetitle">Related Tags</h4>
      <div class="sidebody" v-for="(tag, index) in showTags" :key="index">
        <router-link :to="'/tag/' + tag.tagid">{{tag.tagname}}</router-link>
      </div>
    </div>
    <div class="tagmeta">
      <h4><b style="font-size:1.5em">{{ tagName }}</b></h4>
      <div>{{ tagDetail.descript }} 
        <el-button type="text" @click="toEditTag">...Edit</el-button>
      </div>
      <el-button class="fbtn" type="success" size="mini" plain @click="favTag">{{action}} {{favCount}}</el-button>
    </div>
    <div class="rut-list">
      <rut-list :rutlist="currentRuts" @loadmore="loadmoreRuts"></rut-list>
    </div>
    <div class="demand-list">
      <div class="demand-list-title">
        <b style="font-size:1.2em">Related Requests</b> &nbsp;&nbsp; &nbsp;&nbsp;
        <router-link to="/demands">Send a Request</router-link>
      </div>
      <demand-list :type="'popular'" :tag="tagName" :key="tagid"></demand-list>
    </div>
    <!-- dialog -->
    <el-dialog title="Edit Tag Description" :visible.sync="openDialog" :before-close="cancelOnClose">
      <el-form :model="tagForm" :rules="rules" ref="tagForm" size="mini">
        <el-form-item label="Tag Name" prop="name">
          <el-input v-model="tagForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Parent Tag" prop="parent">
          <el-input v-model="tagForm.parent"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input type="textarea" v-model="tagForm.description" :autosize="{minRows:3}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditTag">Cancel</el-button>
        <el-button type="success" @click="editTag('tagForm', tagForm)">Submit</el-button>
      </div>
    </el-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import RutList from '@/components/Rut/RutList.vue'
import DemandList from '@/components/Demand/DemandList.vue'
import { mapGetters } from 'vuex'
import { editTag, checkFav, favTag, fetchTagRuts, checkTagLocked, lockTag, unlockTag } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid } from '@/util/filters'

export default {
  name: 'tag-view',
  title () {
    return this.tagDetail.tagname
  },
  components: { RutList, DemandList },
  data () {
    return {
      action: this.checkFavor(), // || 'Follow',
      favCount: 0,
      openDialog: false,
      tagForm: {
        name: '',
        parent: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, validator: trimValid, message: 'Please give tag a name', trigger: 'blur' },
          { max: 120, message: 'Max Length should be 120', trigger: 'blur' }
        ],
        parent: [
          { max: 120, message: 'Max Length should be 120', trigger: 'blur' }
        ],
        description: [
          { required: true, validator: trimValid, message: 'Please Descript it', trigger: 'blur' },
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentPage',
      'currentRuts',
      'showTags',
      'tagDetail'
    ]),
    tagid () {
      return this.tagDetail.id
    },
    tagName () {
      return this.tagDetail.tagname
    }
  },
  methods: {
    loadmoreRuts () {
      fetchTagRuts(this.tagDetail.id, {'page': this.currentPage})
      .then(resp => {
        this.$store.commit('MORE_RUTS', resp.data)
      })
    },
    loadData () {
      let tagid = this.$route.params.id
      this.$store.dispatch('getTag', tagid)
      .then(resp => {
        this.tagForm.name = resp.data.tagname
        this.tagForm.description = resp.data.descript
        this.favCount = resp.data.favcount
        this.action = this.checkFavor() // || 'Follow'
      })
    },
    toEditTag () {
      let currentUserID = this.$store.getters.currentUserID
      if (!currentUserID || !checkAuth()) { // utilize short-circle to set default auth
        this.openDialog = false
        this.$message('Please Log in to Continue')
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      } else {
        checkTagLocked(currentUserID, this.tagid).then(resp => {
          if (!resp.data) {
            this.openDialog = true
            lockTag(this.tagid)
          } else {
            this.$message('in Editing...Please Try Later')
          }
        })
      }
    },
    cancelEditTag () {
      this.openDialog = false
      unlockTag(this.tagid)
    },
    cancelOnClose (done) {
      this.cancelEditTag()
      done()
    },
    editTag (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            name: form.name.trim(),
            parent: form.parent.trim(),
            description: form.description.trim()
          }
          let tagid = this.tagDetail.id
          editTag(tagid, data)
          .then((resp) => {
            this.openDialog = false
            unlockTag(this.tagid)
            this.loadData()  // can be less consumption
            this.$message({
              showClose: true,
              message: resp.data,
              type: 'success'
            })
          })
        } else if (!checkAuth()) {
          this.$message({
            showClose: true,
            message: 'Please Log in to Continue'
          })
          this.$router.push({
            path: '/login',
            query: {redirect: this.$route.fullPath}
          })
        }
      })
    },
    checkFavor () {
      if (checkAuth()) {
        let tagid = this.$route.params.id
        return checkFav(tagid)
        .then(resp => {
          this.action = resp.data
        })
      } else {
        return 'Follow' // work incorrectly when non-login if no return
      }
    },
    favTag () {
      if (checkAuth()) {
        let tagid = this.$route.params.id
        if (this.action === 'Follow') {
          return favTag('fav', tagid)
          .then(() => {
            this.action = 'UnFollow'
            this.favCount += 1
          })
        } else {
          return favTag('unfav', tagid)
          .then(() => {
            this.action = 'Follow'
            this.favCount -= 1
          })
        }
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
    }
  },
  watch: {
    '$route': 'loadData' // watch to render re-used component
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="stylus" scoped>
.tag-page
  padding 10px 230px 10px 0px
  position relative
  .tag-side
    position absolute
    right 0
    width 220px
    background-color lighten(#e5ebe4, 80%)
    .sidetitle
      background-color #e5ebe4
      padding 5px 10px
    .sidebody
      padding 5px 10px
      a
        &:hover
          color #ff6600
  .tagmeta
    background-color white
    min-height: 40px
    padding 5px 10px
    margin-bottom 5px
    position relative
    .fbtn
      position absolute
      top 10px
      right 5px
  .rut-list
    padding auto
  .demand-list-title
    border-bottom 4px solid #eee
    margin-bottom 10px
</style>
