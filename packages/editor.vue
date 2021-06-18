<!--
 * @Descripttion: 富文本编辑器
 * @version: 
 * @Author: LCQ
 * @Date: 2020-11-03 18:43:13
 * @LastEditors: LCQ
 * @LastEditTime: 2021-01-18 14:12:56
-->

<template>
  <div class="gb-editor-wrapper">
    <div class="gb-editor-control">
      <input id="imgInput" type="file" accept="image/*" @change="handleUploadImg" />
      <div>
        <button data-command='fontSize' data-value="5" @click="changeStyle">标 题</button>
        <button data-command='fontSize' data-value="3" @click="changeStyle">正 文</button>
        <!-- <button data-command='strikeThrough' @click="changeStyle">删除线</button> -->
        <!-- <button data-command='foreColor' data-value="red" @click="changeStyle">红 色</button> -->
        <!-- <button data-command='foreColor' data-value="rgba(0, 0, 0, 0.65)" @click="changeStyle">黑 色</button> -->
        <button v-if="useInsertImg" @click="toUploadImage">图 片</button>
      </div>
    </div>
    <div class="gb-editor-text-warpper">
      <div
        class="gb-editor-text"
        contentEditable="true"
        spellCheck="false"
        @click="handlePreviewImg"
        @paste="handlePaste"
        v-html="note"
        @input="handleInput"
        @keydown="handleKeydown"
      >
      </div>
    </div>
    <div
      v-if="isPreviewImg" 
      class="gb-editor-preview-img"
      @click="isPreviewImg = false"
    >
      <div>
        <img :src="previewImgSrc" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'gbEditor',
  model: {
    prop: 'richTextValue',
    event: 'change'
  },
  props: {
    richTextValue: {
      type: String,
      default: ''
    },
    useInsertImg: {
      type: Boolean,
      default: false
    },
    uploadImgUrl: {
      type: String,
      default: ''
    },
    uploadImgtoken: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      contentHaveChange: false,
      isPreviewImg: false,
      previewImgSrc: '',
      note: ''
    }
  },
  methods: {
    toUploadImage() { //  // 点击上传图片
      const fileInput = document.getElementById('imgInput')
      // const event = new Event('click') // 要MouseEvent才有效
      let event = new MouseEvent('click')
      fileInput.dispatchEvent(event)
    },
    handleUploadImg(e) { // 触发上传图片
      console.log('file', e.target.files[0])
      const file = e.target.files[0]
      if (file) {
        this.uploadImg(file, true)
      }
    },
    changeStyle(e) { // 改变选中值的样式
      this.textAreas.focus()
      const data = e.target.dataset
      data.value ? document.execCommand(data.command, false, data.value) : document.execCommand(data.command, false, null)
      // this.textAreas.focus()
      if (!this.contentHaveChange) {
        this.contentHaveChange = true
      }
    },
    handleSave() {
      const content = document.querySelector('.text-area').innerHTML
      // console.log('content', content)
    },
    handlePreviewImg(e) { // 预览图片
      if (e.target.constructor === HTMLImageElement) {
        const src = e.target.getAttribute('src')
        this.isPreviewImg = true
        this.previewImgSrc = src
      }
    },
    handlePaste(e) { // 黏贴文本或者图片
      e.preventDefault()
      if (e.clipboardData) {
        let txt = e.clipboardData.getData('text/plain') // 获取复制的文本
        let range = window.getSelection().getRangeAt(0) // 获取页面文本选区
        range.deleteContents() // // 删除默认选中文本
        let pasteTxt = document.createTextNode(txt) // 创建一个文本节点，用于替换选区文本
        range.insertNode(pasteTxt) // 插入文本节点，只插入纯文本
        range.collapse(false) // 将焦点移动到复制文本结尾

        if (e.clipboardData.items) {
          for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
            const item = e.clipboardData.items[i]
            console.log(item.type)
            if (item.kind === "file" && item.type.search(/image\/\w{3,}/g) !== -1) { // 这里可以获取剪贴板里的图片
              const pasteFile = item.getAsFile() // pasteFile就是获取到的文件
              if (pasteFile.size === 0) continue
              this.uploadImg(pasteFile, false)
              console.log('pasteFile', pasteFile)
            }
          }
        }

        this.$emit('change', this.textAreas.innerHTML)
      }
    },
    async uploadImg(file, isLast) {
      if (this.uploadImgUrl) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await axios({
          method: 'post',
          url: this.uploadImgUrl,
          data: formData,
          headers: {'Authorization': this.uploadImgtoken},
        })
        console.log('上传图片服务器响应', res)
        if (res.data.code == 0) {
          document.execCommand('insertImage', false, res.data.data.link) // 将图片加到光标位置
          console.log('res', res.data.data.link)
          this.textAreas.focus()
        } else {
          console.log('上传图片失败')
        }
      } else {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          console.log(reader.result)
          document.execCommand('insertImage', false, reader.result) // 将图片加到光标位置
          this.textAreas.focus()
        }
      }
      // const formData = new FormData()
      // formData.append('file', file)
      // const res = await http.post('uploadImg', formData)
      // // console.log('上传图片服务器响应', res)
      // // document.querySelector('.text-area').focus() // 选择文件上传的时候只能往前面加
      // if (res.status !== 200) {
      //   Utils.reminder('上传失败', 'white', this.props.themeColor)
      //   return
      // }
      // if (isLast) { // 选择文件的时候往尾部加
      //   let dom = document.querySelector('.text-area')
      //   const content = dom.innerHTML
      //   const str = `<img src='${res.data}' />`
      //   dom.innerHTML = content + str
      //   if (!this.contentHaveChange) {
      //     this.contentHaveChange = true
      //   }
      // } else {
      //   document.execCommand('insertImage', false, res.data)
      // }
    },
    handleKeydown() {
      if (!this.contentHaveChange) {
        /* TODO: 如果这里初始化值了，而且的内容中的第一个内容，
          那么fontSize为3的内容是没有标签包围的，直接是"fasfd",
          而不是<font size="3">fasfd</font>,
          在符文本编辑器里看没有，但实际输出的字符串还是有，
          有误
        */
        const bool = document.execCommand('fontSize', false, 3)
        console.log('初始化', bool)
        this.contentHaveChange = true
      }
    },
    handleInput() { // 富文本编辑器输入值了
      console.log('input')
      this.$emit('change', this.textAreas.innerHTML)
    },
  },
  mounted () {
    this.textAreas = document.querySelector('.gb-editor-text')
    if (this.richTextValue) { // 编辑的时候赋值
      this.textAreas.innerHTML = this.richTextValue
    }
  },
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.gb-editor-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: .5rem;
  box-shadow: 0 0 2px 0 rgba(30, 38, 44, 0.5);
  padding-top: .2rem;
  &:hover {
    // box-shadow: 0 0 20px 0 rgba(30, 38, 44, 0.5);
  }

  .gb-editor-control {
    position: relative;
    // display: flex;
    // align-items: center;
    width: 100%;
    height: 2.5rem;
    margin-bottom: .5rem;

    > div {
      width: 100%;
      display: flex;
      justify-content: center;
      button {
        width: 4rem;
        height: 2.5rem;
        text-align: center;
        line-height: 2.5rem;
        color: #fff;
        background-color: #1890ff;
        // border-color: #1890ff;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
        border: none;
        outline: none;
        /* text-decoration: none; */
        cursor: pointer;
      }
      button:hover {
        background-color: #40a9ff;
        // border-color: #40a9ff;
      }
      > button:first-child {
        border-radius: 5px 0 0  5px;
      }
      > button:last-child {
        border-radius: 0 5px 5px 0;
      }
    }

    > input {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      visibility: hidden;
      width: 0;
      height: 0;
    }
  }

  .gb-editor-text-warpper {
    width: 100%;
    height: 22rem;    
    overflow: hidden;

    > .gb-editor-text {
      width: 100%;
      height: 100%;
      line-height: 20px;
      padding: 5px;
      overflow-y: scroll;
      caret-color: rgba(0, 160, 233, 1);
      color:rgba(0, 0, 0, 0.65);
      border: none;
      outline: none;
      &::-webkit-scrollbar {
        width: 0.2rem;
        height: 0.2rem;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 0.3rem;
        background: rgba(0, 0, 0, 0.2);

        &:window-inactive {
          background: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  .gb-editor-preview-img {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    // background: rgba(255, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.2);
    z-index: 100;

    >div:nth-child(1) {
      position: absolute;
      z-index: 101;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: calc(100vw - 50px);
      max-height: calc(100vh - 50px);
      padding: 25px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.5rem;
        height: 0.5rem;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 0.5rem;
        background: rgba(0, 0, 0, 0.3);

        &:window-inactive {
          background: rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
}

</style>
<style scoped>
.gb-editor-text >>> img {
  display: block;
  width: 150px;
  height: 85px;
  margin: 2px auto;
}

.gb-editor-texts >>> * {
  line-height: 20px;
}

.gb-editor-text >>> *::selection, .text-area::selection {
  /* background: none;
  color: blanchedalmond; */
}
</style>