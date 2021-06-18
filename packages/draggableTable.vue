<!--
 * @Descripttion: 可以拖动的表格
 * @version: 
 * @Author: LCQ
 * @Date: 2020-11-13 17:44:20
 * @LastEditors: LCQ
 * @LastEditTime: 2020-12-28 11:53:38
-->

<template>
  <div class="gb-draggable-table" :style="{height: data.length === 0 ? 140 + 'px' : 48 + data.length * 40 + 'px'}">
    <div class="gb-draggable-table-title">
      <div v-for="(item, index) of columns" :style="{flex: item.width}" :key="index">{{item.title}}</div>
    </div>
    <div class="gb-draggable-table-body" :id="dynamicIdName">
      <div 
        class="gb-draggable-table-body-item" 
        :class="{active: dragElementIndex === index}"
        :style="{top: index * 40 + 'px'}"
        v-for="(item, index) of data" :key="item.id"
        @mousedown="dragItem($event, index)"
      >
        <div v-for="(column, i) of columns" :style="{flex: column.width}" :key="i">
          <span v-if="column.scopedSlots && column.scopedSlots.customRender">
            <slot
              :name="column.scopedSlots.customRender" 
              :text="item[column.dataIndex]"
              :record="item"
              :index="index"
            ></slot>
          </span>
          <span v-else>{{item[column.dataIndex]}}</span>
        </div>
      </div>
      <div v-if="data.length === 0" class="data-empty">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { deepCopy } from './utils'
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  name: 'gbDraggableTable',
  data () {
    return {
      data: [],
      bodyElement: null,
      dragElement: null,
      dragElementIndex: -1,
      dragElementInitTop: -1,
      startY: 0,
      dynamicIdName: '',  // 动态id名,用于同一个页面中存在多个该组件
      isMoving: false, // 控制一次只能拖动一个
    }
  },
  watch: {
    dataSource: function(n) {
      this.data = n
    }
  },
  methods: { // TODO: 控制一次拖动结束后才能拖动下一个，横向滚动,返回交互位置的两个元素，一个元素时的高度
    dragItem(e, index) {
      if (this.isMoving) return
      this.isMoving = true
      console.log('e', e)
      console.log('index', index)
      this.dragElement = e.currentTarget
      this.dragElement.style.zIndex = 100 // 设为顶层
      this.dragElement.style.transition = 'none' // 重置过渡效果
      this.dragElementIndex = index
      this.startY = e.clientY
      this.dragElementInitTop = parseInt(this.dragElement.style.top)
      console.log('初始的top', this.dragElement.style.top)
      document.documentElement.addEventListener('mousemove', this.handleMousemove)
      document.documentElement.addEventListener('mouseup', this.handleMouseup)
    },
    handleMousemove(e) {
      this.dragElement.style.top = this.dragElementInitTop + e.clientY - this.startY + 'px'
      console.log('移动的距离', e.clientY - this.startY)
    },
    handleMouseup(e) {
      this.dragElement.style.zIndex = 1 // 重置为底层
      document.documentElement.removeEventListener('mousemove', this.handleMousemove)
      document.documentElement.removeEventListener('mouseup', this.handleMouseup)
      console.log('最终移动距离', e.clientY - this.startY)
      this.decidePosition(e.clientY - this.startY)  
    },
    decidePosition(moveDistance) {
      let indexNumber = 0
      if (moveDistance > 0) {
        // 计算移动了多少行, 大于零需要向下取整
        indexNumber = Math.floor(moveDistance / 40) 
      } else {
        // 计算移动了多少行, 小于零需要向上取整
        indexNumber = Math.ceil(moveDistance / 40) 
      }
      let otherNumber = moveDistance % 40 // 计算移动了多少行后剩余的移动距离
      console.log('计算移动了多少行 ' + indexNumber + ' 计算移动了多少行后剩余的移动距离 ' + otherNumber)
      let newIndex = -1 
      if ((otherNumber >= 0 && otherNumber < 20) || (otherNumber < 0 && otherNumber > -20)) {
        // 剩余的距离不超过20的情况
        newIndex = this.dragElementIndex + indexNumber
      } else {
        // 剩余距离大于20的情况
        let num = this.dragElementIndex + indexNumber
        newIndex = moveDistance > 0 ? num + 1 : num - 1 // 区分向上移动还是向下移动
      }
      console.log('最终index位置', newIndex)
      if (newIndex < 0 || newIndex > this.data.length - 1 || newIndex === this.dragElementIndex) {
        // 移动超出表格边界或最终位置等于开始位置的情况
        console.log('元素回到原来位置')
        this.dragElement.style.cssText = `
          transition: top 1s;
        `
        this.dragElement.style.top = this.dragElementInitTop + 'px'
        this.dragElementIndex = -1 // 重置dragElementIndex
        this.isMoving = false // 重置移动标记
      } else {
        // 需要移动到其他位置的情况
        let distance = (newIndex - this.dragElementIndex) * 40 // 元素需要移动的距离
        console.log('元素需要移动的距离', distance)
        this.dragElement.style.cssText = `
          transition: top 1s;
        `
        this.dragElement.style.top = this.dragElementInitTop + distance + 'px'

        console.log('需要互换位置的另一个元素', this.bodyElement.children[newIndex])
        let otherElement = this.bodyElement.children[newIndex]
        let oldTop = parseInt(otherElement.style.top) // 如果先设cssText这里会为NaN
        console.log('需要互换位置的另一个元素的top', oldTop)
        otherElement.style.cssText = `
          transition: top 1s;
        `
        otherElement.style.top = oldTop - distance + 'px'
        let data = deepCopy(this.data)
        let obj = data[this.dragElementIndex]
        data[this.dragElementIndex] = data[newIndex]
        data[newIndex] = obj
        console.log('最终的data', data)
        setTimeout(() => {
          this.data = data
          this.$emit('dataSourceChange', this.data)
          this.dragElementIndex = -1 // 重置dragElementIndex
          this.isMoving = false // 重置移动标记
        }, 800)
      }
    },
  },
  created () {
    this.data = this.dataSource
    this.dynamicIdName = parseInt(Math.random() * Date.now()).toString()
  },
  mounted () {
    this.bodyElement = document.getElementById(this.dynamicIdName)
    console.log('不同表格的bodyElement', this.bodyElement)
  }
}
</script>

<style lang="scss" scoped>
.gb-draggable-table {
  width: 100%;
  border-bottom: 1px solid #e8e8e8;
  .gb-draggable-table-title {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    height: 48px; 
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    > div {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 5px;
    }
  }

  .gb-draggable-table-body {
    position: relative;
    width: 100%;
    .gb-draggable-table-body-item {
      position: absolute;
      left: 0;
      z-index: 1;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      width: 100%;
      height: 40px;
      cursor: grab;
      &:active {
        cursor: grabbing;
      }
      &:hover {
        background: rgba($color: #00a0e9, $alpha: .1);
      }
      > div {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 5px;
      }
    }
    .data-empty {
      width: 100%;
      height: 80px;
      text-align: center;
      line-height: 80px;
      font-size: 20px;
      color: rgba($color: #9c9a9a, $alpha: 1.0);
    }
    .active {
      background: rgba($color: #00a0e9, $alpha: .1);
    }
  }
}
</style>
