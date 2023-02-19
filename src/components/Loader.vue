<script lang="ts" setup>
defineProps({
  progress: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="loader">
    <div class="loader--text">
      <slot />
    </div>
    <div class="loader--bar">
      <div
        class="loader--bar--inner"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  background-color: rgba(var(--bg-color), 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-gap: 0.5rem;
  padding: 1rem;
  position: absolute;
  left: -4px;
  top: -4px;
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  &--text {
    font-size: 0.75rem;
    &:empty {
      display: contents;
    }
  }
  &--bar {
    background-color: rgb(var(--bg-color));
    border: 1px solid rgb(var(--fg-color));
    border-radius: 0.5rem;
    overflow: hidden;
    width: 100%;
    &--inner {
      background-color: rgb(var(--fg-color));
      width: 0;
      height: 1rem;
      transition: width 500ms ease-out;
    }
  }
}
</style>
