<template>
  <div class="mark-sum">
    <b class="indicator">&nbsp;&nbsp;#{{mark.order}}&nbsp;&nbsp;</b>
    <el-button class="editlink" type="text" v-show="canEdit"
               @click="showEditMark=true">
               ..Edit
    </el-button> 
    <div class="mark" v-html="md(mark.mark)" v-show="!showEditMark"></div>
    <!--edit mark-->
    <div v-if="showEditMark">
      <el-form class="edit-form" 
          :model="editMarkForm" 
          ref="editMarkForm" size="mini">
        <el-form-item prop="order">
          <el-input v-model="editMarkForm.order"></el-input>
        </el-form-item>
        <el-form-item  prop="mark">
          <el-input type="textarea" v-model="editMarkForm.mark" 
                    :autosize="{minRows:3}">
          </el-input>
          <md-tool :pretext="editMarkForm.mark" @insertmd="updateM"></md-tool>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="mini" 
                     @click="showConfirm = true">
                     Delete
          </el-button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button size="mini" @click="showEditMark=false">Cancel</el-button>
          <el-button type="success" size="mini" 
                    @click="onEditMark('editMarkForm', editMarkForm, mark.gid)">
                    Done
          </el-button>
        </el-form-item>
      </el-form>
      <!-- confirm delete dialog -->
      <el-dialog title="Confirm Delete This Item?" :visible.sync="showConfirm" width="30%">
        <span>Confirm Delete? Can not recover</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="showConfirm = false">Cancel</el-button>
          <el-button type="danger" size="mini" 
                    @click="onDelMark">
                    Confirm Delete
          </el-button>
        </span>
      </el-dialog>
      <!-- dialog end -->
    </div>
    <!--end edit mark-->
  </div>
</template>

<script>
import { editMark, deleteMark } from '@/api/api'
import marked from '@/util/marked'
import { checkAuth } from '@/util/auth'
import MdTool from '@/components/Misc/MdTool.vue'

export default {
  name: 'mark-sum',
  props: ['mark', 'canEdit'],
  components: { MdTool },
  data () {
    return {
      showEditMark: false,
      editMarkForm: {
        order: this.mark.order,
        mark: this.mark.mark
      },
      showConfirm: false
    }
  },
  methods: {
    onEditMark (formName, form, markid) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            order: form.order,
            mark: form.mark.trim()
          }
          editMark(markid, data).then(() => {
            this.showEditMark = false
            location.reload()
          })
        } else {
          this.$message({
            showClose: true,
            message: 'error!! Please Check'
          })
          return false
        }
      })
    },
    onDelMark () {
      let markid = this.mark.gid
      deleteMark(markid).then(() => {
        this.showEditMark = false
        this.showConfirm = false
        location.reload() // any better way? reload minimum
      })
    },
    updateM (data) {
      this.editMarkForm.mark += data
    },
    md (content) {
      return marked(content)
    }
  }
}
</script>

<style lang="stylus" scoped>
.indicator
  font-size 0.7em
  color #668e66
.mark
  padding 5px 10px
.edit-form
    padding 20px
    border 1px dotted #689f38
</style>