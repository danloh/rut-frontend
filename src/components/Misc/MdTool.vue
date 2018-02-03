<template>
  <div class="md-editor">
    <div class="md-tools">
      <a href="" title="Bold" @click.stop.prevent="insertContent('bold')">
        <b class="icon">B &nbsp;</b>
      </a>
      <a href="" title="Image" @click.stop.prevent="insertContent('image')">
        <i class="el-icon-picture icon"></i>
      </a>&nbsp;
      <a href="" title="Link" @click.stop.prevent="insertContent('link')">
        <i class="el-icon-plus icon"></i>
      </a>&nbsp;
      <a href="" title="Code" @click.stop.prevent="insertContent('code')">
        <i class="el-icon-tickets icon"></i>
      </a>&nbsp;&nbsp;
      <a href="" title="Preview" @click.stop.prevent="togglePreviewMode">
        <i class="el-icon-view icon"></i>
      </a>
    </div>
    <div v-show="previewMode" v-html="previewContent"></div>
  </div>
</template>

<script>
  import marked from '@/util/marked'
  export default {
    name: 'md-tool',
    data () {
      return {
        previewContent: '',
        previewMode: false
      }
    },
    props: {
      pretext: {
        type: String,
        default: ' '
      }
    },
    methods: {
      insertContent (type) {
        const contents = {
          bold: '** **',
          image: '![](https://)',
          link: '[](https://)',
          code: '\n```python\n \n```'
        }
        this.$emit('insertmd', contents[type])
      },
      togglePreviewMode () {
        this.previewContent = marked(this.pretext)
        this.previewMode = !this.previewMode
      }
    }
  }
</script>

<style lang="stylus" scoped>
.icon
  color grey
</style>
