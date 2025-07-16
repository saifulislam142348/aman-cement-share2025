<!-- src/components/ActionButtons.vue -->
<template>
  <div class="flex gap-2">
    <el-button
      v-if="show"
      type="info"
      size="small"
      icon="View"
      plain
      @click="$emit('show')"
    >
      Show
    </el-button>

    <el-button
      v-if="edit"
      type="primary"
      size="small"
      icon="Edit"
      @click="$emit('edit')"
    >
      Edit
    </el-button>

    <el-button
      v-if="send"
      type="warning"
      size="small"
      icon="Upload"
      @click="$emit('send')"
    >
      Send
    </el-button>

    <el-button
      v-if="remove"
      type="danger"
      size="small"
      icon="Delete"
      @click="$emit('delete')"
    >
      Delete
    </el-button>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  edit: Boolean,
  send: Boolean,
  remove: Boolean,
})
</script>
