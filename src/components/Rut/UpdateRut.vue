<template>
  <div class="update-page">
    <div class="title"> 
      <b>Update List:&nbsp;&nbsp;</b>
    </div>
    <v-form ref="form" class="create-form">
      <v-textarea
        v-model="title"
        label="Title"
        :counter = "120"
        :rules="titleRule"
        :rows= "1"
        auto-grow
      ></v-textarea>
      <v-textarea
        v-model="url"
        label="URL"
        :counter = "120"
        :rules="lenRule"
        :rows= "1"
        auto-grow
      ></v-textarea>
      <v-text-field
        v-model= "author"
        label= "Origin Author"
      ></v-text-field>
      <v-textarea
        v-model="content"
        label="Content"
        counter
        :rows= "10"
        auto-grow
        :rules="mustRule"
      ></v-textarea>
    </v-form>
    <el-button type="success" size="mini" class="blockbtn" @click="onUpdate">
      Done and Submit
    </el-button>
  </div>
</template>

<script>
import { updateRut } from '../../api'
import { checkAuth } from '../../util/auth'

export default {
  name: 'update-rut',
  title: 'Update List',
  components: { },
  data () {
    return {
      title: '',
      url: '',
      content: '',
      author: '',
      rutid: '',
      mustRule: [ v => !!v || 'required' ],
      lenRule: [ v => v.length <= 120 || 'Must be less than 120 characters' ]
    }
  },
  computed: {
    titleRule () { 
      return this.mustRule.concat(this.lenRule)
    }
  },
  methods: {
    onUpdate () {
      if (!this.$refs.form.validate()) {
        console.log("Invalid")
        return
      }
      let data = {
        id: this.rutid.trim(),
        title: this.title.trim(),
        content: this.content.trim(),
        url: this.url.trim(),
        author_id: this.author.trim(),
        credential: '...'
      }
      updateRut(this.ritid, data).then(resp => {
        let id = resp.data.rut.id
        this.$router.push(`/r/${id}`)  // reload store??, issue
      })
    },
    loadRut () {
      let rid = this.rutid = this.$route.params.id
      this.$store.dispatch('getRut', rid).then(resp => {
        this.title = resp.title
        this.url = resp.title
        this.author = resp.author_id
        this.content = resp.content
      })
    }
  },
  created () {
    this.loadRut()
  }
}
</script>

<style scoped>
.update-page {
  padding: 10px 160px 10px 120px;
  position: relative;
}
.title {
  margin-bottom: 20px;
}
</style>
