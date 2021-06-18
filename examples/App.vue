<!--
 * @Descripttion: 
 * @version: 
 * @Author: LCQ
 * @Date: 2020-11-15 12:38:31
 * @LastEditors: LCQ
 * @LastEditTime: 2020-12-29 15:38:36
-->
<template>
  <div id="app">
    <gb-button type="danger">sshhhsss</gb-button>
    <div class="wrapper">
      <gb-draggable-table
        :columns="columns" 
        :dataSource="data"
        @dataSourceChange="dataSourceChange"
      >
        <template v-slot:index="{index}">
          <div class="index">{{index + 1}}</div>
        </template>
        <template v-slot:operate="{text, record, index}">
          <div class="operations">
            <span @click="handleEdit(record, text, index)">编辑</span>
            <span @click="handleRemove(record, index)">删除</span>
          </div>
        </template>
      </gb-draggable-table>
    </div>
    <div class="editor-wrapper">
      <gb-editor 
        v-model="value" 
        :useInsertImg="true"
        :uploadImgUrl="uploadImgUrl"
        :uploadImgtoken="uploadImgtoken"
      ></gb-editor>
    </div>
    <img src="http://gb-jianzhi.oss-cn-shenzhen.aliyuncs.com/SI9mjeRfc2分布式爬虫架构.png" />
  </div>
</template>

<script>
import gbDraggableTable from '../packages/draggableTable'
import gbEditor from '../packages/editor'
export default {
  name: 'App',
  data () {
    return {
      value: '',
      uploadImgUrl: '', // 上传图片的url http://gobrand-local-dev:20001/mng/file/upload
      uploadImgtoken: 'Bearer 525ed745-46a0-4bf1-a42c-ca75569b774c', // 上传图片的token
      data: [
        {
          title: '1',
          newsType: '134',
          status: 'true',
          releaseTime: '2020'
        }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 40,
          align: 'center',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '资讯标题',
          dataIndex: 'title',
          width: 120,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '资讯类型',
          dataIndex: 'newsType',
          width: 120,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '上架状态',
          dataIndex: 'status',
          width: 120,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '发布时间',
          dataIndex: 'releaseTime',
          width: 120,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'operate',
          width: 180,
          align: 'center',
          scopedSlots: { customRender: 'operate' },
        },
      ],  
    }
  },
  components: {
    gbEditor,
    gbDraggableTable
  },
  methods: {
    handleRemove() {},
    handleEdit(record, text, index) {
      console.log('一行数据', record, text, index)
    },
    dataSourceChange(data) {
      this.data = data
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  width: 100%;
  margin: 40px 0;
  // width: 100%;
  .index {
    color: #00a0e9;
  }
  .operations {
    color: #00a0e9;
    > span:not(:last-child) {
      margin-right: .5rem;
    }
    > span {
      cursor: pointer;
    }
  }
}
.editor-wrapper {
  width: 30rem;
  height: 23rem;
}
</style>
