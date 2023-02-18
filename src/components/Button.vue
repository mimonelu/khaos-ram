<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button :disabled="disabled">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
  background-color: rgb(var(--access-color));
  border: 1px solid transparent;
  border-radius: 0.5rem;
  color: rgb(var(--fg-color));
  cursor: pointer;
  font-weight: bold;
  line-height: 1.375;
  padding: 0.5rem 2rem;
  &:focus {
    box-shadow: 0 0 0 1px rgb(var(--bg-color)), 0 0 0 4px rgb(var(--accent-color));
  }
}
</style>
