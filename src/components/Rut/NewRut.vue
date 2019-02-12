<template>
  <div class="create-page">
    <!-- <h3 class="title">Create</h3>
    <p style="color:green;font-size:0.8em;text-align:center">
      collection of books, courses, etc. 
    </p> -->
    <form>
      <v-text-field
        v-model="title"
        label="Title"
        counter
        maxlength="120"
      ></v-text-field>
      <v-text-field
        v-model="url"
        label="URL"
        counter
        maxlength="120"
      ></v-text-field>
      <v-textarea
        v-model="content"
        label="Content"
        counter
        auto-grow
      ></v-textarea>
    </form>
    <v-btn @click="onCreate">Create</v-btn>
  </div>
</template>

<script>
import { newRut } from '../../api'
import { trimValid } from '../../util/filters'

export default {
  name: 'new-rut',
  title: 'Create New',
  components: { },
  data () {
    return {
      title: '',
      url: '',
      content: '',
      editable: 'Creator'
    }
  },
  methods: {
    onCreate () {
      let data = {
        title: this.title.trim(),
        intro: this.content.trim(),
        url: this.url.trim(),
        editable: this.editable
      }
      newRut(data).then(resp => {
        let id = resp.data.id
        this.$router.push(`/r/${id}`)
        this.$message({
          showClose: true,
          message: 'New List Created, Now Add item to it'
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.create-page
  padding 10px 160px 10px 120px
  position relative
  .create-form
    padding 10px 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
.el-select
  width 80%
</style>