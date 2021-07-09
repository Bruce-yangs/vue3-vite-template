<template>
  <el-dialog
    custom-class="status-dialog"
    ref="dialog"
    :show-close="false"
    v-model="dialogVisible"
    width="400px"
    title=""
    :append-to-body="true"
  >
    <span
      v-show="mode === 'warning'"
      class="el-icon-warning-outline icon warning"
    ></span>
    <span
      v-show="mode === 'success'"
      class="el-icon-circle-check icon success"
    ></span>
    <span
      v-show="mode === 'error'"
      class="el-icon-circle-close icon error"
    ></span>
    <p class="title">{{ title }}</p>
    <p class="info">{{ info }}</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button
          v-show="mode === 'warning'"
          plain
          @click="dialogVisible = false"
        >
          取 消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    mode: {
      validator: (value: string) => {
        return ['warning', 'success', 'error'].indexOf(value) !== -1
      },
      default: 'error'
    },
    title: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    }
  },
  emits: ['confirm'],
  setup(_, { emit }) {
    const dialogVisible = ref(false)

    const toggleVisible = () => {
      dialogVisible.value = !dialogVisible.value
    }

    const handleConfirm = () => {
      dialogVisible.value = false
      emit('confirm')
    }

    return {
      dialogVisible,
      toggleVisible,
      handleConfirm
    }
  }
})
</script>

<style lang="scss">
.status-dialog {
  .el-dialog__header {
    padding: 0;
    border: none;
  }
  .el-dialog__body {
    padding: 32px;
  }
  .icon {
    width: 40px;
    font-size: 40px;
    display: block;
    margin: 0 auto;
    &.success {
      color: #46a71a;
    }
    &.warning {
      color: #f67e1f;
    }
    &.error {
      color: #fa5555;
    }
  }
  .title {
    text-align: center;
    font-size: 20px;
    margin-top: 16px;
    font-weight: bold;
  }
  .info {
    text-align: center;
    color: #888;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
