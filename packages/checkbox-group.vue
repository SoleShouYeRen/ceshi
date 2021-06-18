<template>
  <div class="gb-checkbox-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'gbCheckboxGroup',
  provide () {
    return {
      CheckboxGroup: this
    }
  },
  props: {
    value: {
      type: Array
    }
  }
}
</script>
