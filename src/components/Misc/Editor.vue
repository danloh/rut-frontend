<template>
  <div id="editor-box" class="editor">
    <div id="actionbar" 
         class="editor-actionbar">
    </div>
    <div id="contentbox" 
         class="editor-content" 
         contenteditable="true"
         placeholder="Compose...">
    </div>
  </div>
</template>

<script>
  const exec = (command, value = null) => {
    document.execCommand(command, false, value)
  }
  const ensureHTTP = (str) => {
    return /^https?:\/\//.test(str) && str || `https://${str}`
  }

  const actions = {
    bold: {
      icon: '<b>B</b>',
      title: 'Bold',
      result: () => exec('bold')
    },
    italic: {
      icon: '<i>I</i>',
      title: 'Italic',
      result: () => exec('italic')
    },
    underline: {
      icon: '<u>U</u>',
      title: 'Underline',
      result: () => exec('underline')
    },
    fontcolor: {
      icon: 'color',
      title: 'Font Color',
      result: () => {
        const color = window.prompt('Enter the Color Value')
        if (color) exec('foreColor', color)
      }
    },
    quote: {
      icon: '&#8220;&#8221;',
      title: 'Quote',
      result: () => exec('formatBlock', '<BLOCKQUOTE>')
    },
    olist: {
      icon: '&#35;',
      title: 'Ordered List',
      result: () => exec('insertOrderedList')
    },
    ulist: {
      icon: '&#8226;',
      title: 'Unordered List',
      result: () => exec('insertUnorderedList')
    },
    code: {
      icon: '&lt;/&gt;',
      title: 'Code',
      result: () => exec('formatBlock', '<PRE>')
    },
    link: {
      icon: 'Link',
      title: 'Link',
      result: () => {
        const url = window.prompt('Enter the link URL')
        if (url) exec('createLink', ensureHTTP(url))
      }
    },
    image: {
      icon: 'img',
      title: 'Image',
      result: () => {
        const url = window.prompt('Enter the image URL')
        if (url) exec('insertImage', ensureHTTP(url))
      }
    },
    text: {
      icon: '<b>T</b>',
      title: 'Text',
      result: () => {
        const text = 'Try Enter Some Text'
        if (text) exec('insertText', text)
      }
    }
  }
  
  const classes = {
    actionbar: 'editor-actionbar',
    button: 'editor-button',
    content: 'editor-content'
  }

  const preventTab = event => {
    if (event.which === 9) event.preventDefault()
  }
  
  const init = () => {
    let editorActions = Object.keys(actions).map(action => actions[action])
    const actionbar = document.getElementById('actionbar')
    editorActions.forEach(action => {
      const button = document.createElement('button')
      button.className = classes.button
      button.innerHTML = action.icon
      button.title = action.title
      button.onclick = action.result
      actionbar.appendChild(button)
    })
    // const onChange = html => console.log(html)
    const contentBox = document.getElementById('contentbox')
    // contentBox.oninput = event => onChange(event.target.innerHTML)
    contentBox.onkeydown = preventTab
  }
  
  export default {
    name: 'editor',
    mounted () {
      init()
    },
    method: {
    }
  }
</script>

<style scoped>
.editor-content {
  box-sizing: border-box;
  min-height: 200px;
  outline: 0;
  background-color: #FFF;
  overflow-y: auto;
  padding: 10px;
  width: 100%; }

.editor-actionbar {
  border-bottom: 1px solid grey;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  width: 100%; }

.editor-button {
  background-color: transparent; }
</style>
