<template>
  <input
    ref="input"
    v-model="inputValue"
    :type="type"
    name=""
    :required="required"
    :placeholder="placeholder"
  />
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Enter a placeholder',
    },
    type: {
      type: String,
      default: 'text',
    },
    required: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: true,
    },
    loadFocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: '',
    };
  },
  watch: {
    inputValue() {
      this.$emit('input', this.inputValue);
    },
  },
  mounted() {
    if (this.loadFocus) {
      this.$refs.input.focus();
    }
  },
};
</script>

<style lang="scss" scoped>
input {
  width: 100%;
  background: $offWhite;
  padding: 10px;
  font-size: 18px;
  color: $darkText;
  border: 1px solid $background;
  border-radius: 2px;
  outline: none;
  padding: 10px;
  transition: transform 0.2s;

  @include breakpoint(400) {
    padding: 13px;
    font-size: 20px;
  }

  @include breakpoint(900) {
    &:focus {
      border-color: #5880be;
    }
  }
}
::placeholder {
  color: $darkText;
}
</style>
