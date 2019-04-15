<template>
  <div class="collect-sum">
    <div class="min-item">
      <item-min-sum :item="collect"></item-min-sum>
    </div>
    <div class="content" v-html="md(content)" v-if="showCtn"></div>
    <el-button type="text" size="mini" @click="showCtn=!showCtn" v-if="canEdit">
      <small class="hiden" v-if="showCtn">Edit</small><b v-else>Cancel Edit</b>
    </el-button>
    <div v-if="!showCtn" class="edit-ctn">
      <v-form ref="form" class="collect-form">
        <v-textarea
          v-model="content"
          label= "Compose..., like reading tips, introduction, etc."
          counter
          :rules="mustRule"
          auto-grow
        ></v-textarea>
      </v-form>
      <el-button class="blockbtn" size="mini" @click="editContent">
        Done and Update
      </el-button>
      <!--need to re-oder after del-->
      <el-button type="text" size="mini" @click="showCfm=true">
        <small style="color:red">Delete</small>
      </el-button>
      <!-- confirm delete dialog -->
      <el-dialog title="Confirm Delete?" width="270px" :visible.sync="showCfm">
        <span>Confirm Delete? Cannot Recover</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="showCfm=false">Cancel</el-button>
          <el-button type="danger" size="mini" @click="delContent">
            Confirm Delete
          </el-button>
        </span>
      </el-dialog>
      <!-- end confirm delete dialog -->
    </div>
  </div>
</template>

<script>
import marked from '../../util/marked'
import { updateCollect, delCollect } from '../../api'
import { checkAuth } from '../../util/auth'
import ItemMinSum from './ItemMinSum.vue'

export default {
  name: 'collect-sum',
  props: ['collect', 'canEdit'], // {cid, content..}
  components: { ItemMinSum },
  data () {
    return {
      showCtn: true,
      showCfm: false,
      content: '',
      mustRule: [ v => !!v || 'required' ],
    }
  },
  methods: {
    md (content) { return marked(content) },
    editContent () {
      let currID = this.$store.getters.actID
      if (!this.$refs.form.validate() || currID !== this.collect.uname || !checkAuth()) {
        this.$message("Invalid Input or Need to Log in")
        return
      }
      let data = {
        id: this.collect.cid,
        content: this.content.trim(),
        uname: currID,
      }
      updateCollect(this.collect.cid, data).then(resp => {
        this.content = resp.data.collect.content
        this.showCtn = true
      })
    },
    delContent() {
      let currID = this.$store.getters.actID
      if (currID !== this.collect.uname || !checkAuth()) {
        this.showCfm = false
        this.$message('No Permission')
        return
      }
      delCollect(this.collect.cid).then(() => {
        this.showCfm = false
        this.showCtn = true
        this.$router.push(`/r/${this.collect.rutid}`)  // how to reload?
      })
    }
  },
  created () {
    this.content = this.collect.content
  }
}
</script>

<style scoped>
.hiden {
  cursor: pointer;
  color: transparent;
}
.hiden:hover {
  color: orangered;
  font-size: 15px;
}
.edit-ctn {
  padding: 10px;
  border: 1px dotted #689f38;
}
</style>
