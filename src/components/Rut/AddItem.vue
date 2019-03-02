<template>
  <div class="add-page">
    <div class="title"> 
      <b style="font-size:1.2em">Add Item To List:&nbsp;&nbsp;</b>
      {{ rutTitle }}&nbsp;&nbsp;
    </div>
    <!-- to do: add have-Dones -->
    <div>
      <v-form ref="form" class="add-form">
        <el-select v-model="itemID" filterable remote 
                  :remote-method="storeQuery"
                  :loading="searching"
                  @keyup.enter.native="searchItems"
                  style="width:100%"  
                  placeholder="input UID i.e. ISBN, Press Enter to Search">
          <el-option v-for="i in items" 
                      :key="i.id" 
                      :label="i.title" 
                      :value="i.id">
          </el-option>
        </el-select>
        <v-textarea
          v-model="content"
          label="Content"
          counter
          :rule= "mustRule"
          :rows= "10"
          auto-grow
        ></v-textarea>
      </v-form>
      <el-button size="mini" class="blockbtn" @click="addItem" :disabled="!itemID">
        ADD to List
      </el-button>
    </div>
  </div>
</template>

<script>
import { collectItem, fetchItems } from '../../api'
import { checkAuth } from '../../util/auth'

export default {
  name: 'add-rut',
  title: 'Add Item to List',
  components: { },
  data () {
    return {
      itemID: null,
      content: '',
      inputQuery: '', // store the query keyword, then search once enter press
      searching: false,
      items: [], // search result from have-dones
      rutID: null,
      rutTitle: null,
      rut_userid: '',
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
    // check if same user_id and loged in
    checkAuthed () {
      return this.rut_userid === this.$store.getters.actID && checkAuth()
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
      if (l < 6 && l !== 0) return  // least keyword length
      let param = {'per': 'id', itemid: this.inputQuery}
      // to do : per uiid, title, url??
      fetchItems('uiid', this.inputQuery).then(resp => {
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
        rut_id: this.rutID,
        item_id: this.itemID,
        item_order: this.item_count + 1,
        content: this.content,
        user_id: '', // can get from cookie
      }
      collectItem(this.rutID, data).then(() => {
        // unlockRut(id)
        // reset lastupdate to 0, then can re-fetch after edit
        let updateTime = {'rutid':this.rutID, 'lastUpdate':0, 'ref':'lastUpdate'}
        this.$store.commit('RENEW_RUT', updateTime)
        this.$router.push(`/r/${this.rutID}`) // how to scoll to bottom? once push
      })
    },
    loadRut () {
      let rutid = this.$route.params.id
      let rut = this.$store.getters.ruts[rutid]
      if (rut && rut.id) {
        this.rutID = rut.id
        this.rutTitle = rut.title
        this.item_count = rut.item_count
        this.rut_userid = rut.user_id
        // lockRut(rut.id)
      } else {
        this.$router.push(`/r/${rutid}`)
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
}
</style>
