<script setup>
defineProps({
  model: {
    required: true,
  },
  name: {
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
})
</script>

<template>
  <input
    v-model="model[name]"
    :type="type"
    :disabled="disabled"
    :placeholder="placeholder"
    autocomplete="off"
  >
</template>

<style lang="scss" scoped>
input[type="password"],
input[type="text"] {
  border: 1px solid rgb(var(--access-color));
  border-radius: 0.5rem;
  line-height: 1.375;
  padding: 0.5rem 1rem;
  width: 100%;
  user-select: unset;
  &::placeholder {
    color: rgba(var(--access-color), 0.75);
  }
  &:focus {
    box-shadow: 0 0 0 1px rgb(var(--bg-color)), 0 0 0 4px rgb(var(--accent-color));
  }
}
</style>
