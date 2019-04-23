<template>
  <div class="add-page">
    <div class="title"> 
      <b style="font-size:1.2em">Add Item To Collection:&nbsp;</b>
      <br><small>{{ rutTitle }}</small>
    </div>
    <!-- to do: add have-Dones -->
    <div>
      <v-form ref="form" class="add-form">
        <el-select v-model="itemID" filterable remote 
                  :remote-method="storeQuery"
                  :loading="searching"
                  @keyup.enter.native="searchItems"
                  style="width:100%"  
                  placeholder="Input ISBN or Other UID, Then Enter to Search">
          <el-option v-for="i in items" 
                      :key="i.id" 
                      :label="i.title" 
                      :value="i.id">
          </el-option>
        </el-select>
        <v-textarea
          v-model="content"
          label="Compose..., like reading tips, introduction, etc."
          counter
          :rule= "mustRule"
          :rows= "10"
          auto-grow
        ></v-textarea>
      </v-form>
      <el-button type="success" size="mini" class="blockbtn" @click="addItem" :disabled="!itemID">
        ADD to Collection
      </el-button>
    </div>
  </div>
</template>

<script>
import { collectItem, fetchItems } from '../../api'
import { checkAuth } from '../../util/auth'
import { regUrl } from '../../util/constant'
import { Base64 } from 'js-base64';

export default {
  name: 'add-rut',
  title: 'Add Item to Collection',
  components: {},
  data () {
    return {
      itemID: null,
      content: '',
      inputQuery: '', // store the query keyword, then search once enter press
      searching: false,
      items: [], // search result from have-dones
      rut: null,
      rutTitle: null,
      rut_uname: '',
      item_count: null, // to yield order
      mustRule: [ v => !!v || 'required' ]
    }
  },
  methods: {
    storeQuery (query) {
      if (query.trim() !== '') {
        this.inputQuery = query.trim()
      }
      //this.items = this.$store.getters.seItems  // show options when focus
    },
    // check if same uname and loged in
    checkAuthed () {
      return this.rut_uname === this.$store.getters.actID && checkAuth()
    },
    // make the search controllable
    searchItems () {
      if (!this.checkAuthed()) {
        this.$message("Auth Failed")
        return
      }
      this.searching = true
      this.items = []
      let l = this.inputQuery.length
      if (l < 6) return  // least keyword length // && l !== 0
      //// if (l === 0) {/* search dones by user */}
      // per uiid, title, url
      let per = regUrl.test(this.inputQuery) ? 'url' : 'uiid'
      let perid = per === 'url' ? Base64.encode(this.inputQuery) : this.inputQuery
      fetchItems(per, perid).then(resp => {
        let resItems = resp.data.items
        this.items = resItems
        // this.$store.commit('ADD_ITEMS', resItems)
        this.searching = false
      })
    },
    // add item
    addItem () {
      if (!this.$refs.form.validate() || !this.checkAuthed()) {
        this.$message("Invalid Input or Need to Log in")
        return
      }
      let data = { 
        rut_id: this.rut.id,
        item_id: this.itemID,
        item_order: this.item_count + 1,
        content: this.content,
        uname: '', // can get from cookie
      }
      collectItem(this.rut.id, data).then(() => {
        // unlockRut(id)
        // reset lastupdate to 0, then can re-fetch after edit
        let updateTime = {'rutslug':this.rut.slug, 'lastUpdate':0, 'ref':'lastUpdate'}
        this.$store.commit('RENEW_RUT', updateTime)
        this.$router.push(`/r/${this.rut.slug}`) // how to scoll to bottom? once push
      })
    },
    loadRut () {
      let rutslug = this.$route.params.slug
      let rut = this.$store.getters.ruts[rutslug]
      if (rut && rut.id) {
        this.rut = rut
        this.rutTitle = rut.title
        this.item_count = rut.item_count
        this.rut_uname = rut.uname
        // lockRut(rut.id)
      } else {
        this.$router.push(`/r/${rutslug}`)
      }
    }
  },
  created () {
    this.loadRut()
  }
}
</script>

<style scoped>
.add-page {
  padding: 10px 160px 10px 120px;
  position: relative;
}
.add-form {
  padding: 20px;
  border: 1px dotted #689f38;
  margin-bottom: 10px;
}
.title {
  margin-bottom: 10px;
  text-align: center;
}
</style>
