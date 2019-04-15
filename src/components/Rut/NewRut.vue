<template>
  <div class="create-page">
    <div class="title">
      <span>Create New Collection: </span>
      <small class="help-tips">books, courses, etc. on a specific topic</small> 
    </div>
    <v-form ref="form" class="create-form">
      <v-textarea
        v-model="title"
        label="Title"
        :counter = "256"
        :rules="titleRule"
        :rows= "1"
        auto-grow
      ></v-textarea>
      <v-textarea
        v-model="url"
        label="either Source URL"
        :counter = "256"
        :rules="lenRule"
        :rows= "1"
        auto-grow
      ></v-textarea>
      <v-textarea
        v-model="content"
        label="or Text Content"
        counter
        :rows= "10"
        auto-grow
        :rules="optRule"
      ></v-textarea>
      <v-text-field
        v-model= "author"
        label= "Origin Author(Optional)"
        :counter = "20"
        :rules="lenRule"
      ></v-text-field>
    </v-form>
    <el-button class="blockbtn" type="primary" @click="onCreate">
      Create New Collection
    </el-button>
  </div>
</template>

<script>
import { newRut } from '../../api'
import { checkAuth } from '../../util/auth'

export default {
  name: 'new-rut',
  title: 'Create New Collection',
  components: { },
  data () {
    return {
      title: '',
      url: '',
      content: '',
      author: '',
      editable: 'Creator',
      titleRule: [ v => (!!v && v.length <= 256 ) || 'required less than 256' ],
      lenRule: [ v => v.length <= 256 || 'Must be less than 256 characters' ],
      optRule: [ v => ( !!v || this.url.length > 0 ) || 'Either URL Or Text' ],
    }
  },
  computed: {},
  methods: {
    onCreate () {
      if (!this.$refs.form.validate() || !checkAuth()) {
        this.$message("Invalid Input or Need to Log in")
        return
      }
      let data = {
        title: this.title.trim(),
        content: this.content.trim(),
        url: this.url.trim(),
        uname: this.$store.getters.actID,  // get from cookie
        author_id: this.author.trim(),
        credential: '...'
      }
      newRut(data).then(resp => {
        let id = resp.data.rut.id
        this.$router.push(`/r/${id}`)
      })
    }
  }
}
</script>

<style scoped>
.create-page {
  padding: 20px 180px 20px 120px;
  position: relative;
}
.title {
  padding-bottom: 10px;
}
.create-form {
  padding: 20px;
  border: 1px dotted #689f38;
}
</style>
