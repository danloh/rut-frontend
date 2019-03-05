<template>
  <div class="reply" v-show="show">
    <v-form ref="form" class="reply-form">
      <v-textarea
        v-model="content"
        label="Post..."
        counter
        :rules="mustRule"
        :rows= "1"
        auto-grow
      ></v-textarea>
    </v-form>
    <el-button size="mini" @click="onReply" :disabled="!content.trim()">
      Post
    </el-button>
  </div>
</template>

<script>
import { newEtc } from '../../api'
import { checkAuth } from '../../util/auth'

export default {
  name: 'reply',
  props: {
    refer: Object,  // for etc, rut..
    tagsuf: { type: String, default: '' },
    show: { default: false } // sync, hide input once submit
  },
  data () {
    return {
      content: '',
      mustRule: [ v => !!v ],
    }
  },
  methods: {
    onReply() {
      if (!this.$refs.form.validate() || !checkAuth()) {
        this.$message("Invalid Input or Need to Log in")
        return
      }
      let data = { 
        content: this.content.trim(), // + this.tagsuf 
        post_to: this.refer.per,
        to_id: this.refer.perid,
        uname: this.$store.getters.actID,
      }
      newEtc(data).then(resp => {
        this.$emit('newreply', resp.data.etc)
        this.content = ''  // clear input form
      })
      this.$emit('update:show', true) // with .sync, to hide input once submit
    }
  }
}
</script>

<style scoped>
.reply {
  padding: 5px 0;
  margin-left: 5px;
}
</style>
