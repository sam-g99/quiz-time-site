<template>
  <div>
    <button :class="{ loading: loading }" type="submit">
      {{ loading ? 'Loading...' : text }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  data: () => {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/main.scss';
button {
  width: 100%;
  background: #2a8f2e;
  color: white;
  padding: 8px;
  font-size: 18px;
  border: none;
  outline: none;
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: -200px;
    width: 130px;
    height: 100%;
    transform: skew(-20deg);
    background-image: linear-gradient(
      to right,
      transparent,
      rgba(rgb(255, 255, 255), 0.3),
      transparent
    );
  }
  @include breakpoint(400) {
    padding: 10px;
    font-size: 22px;
  }
  @include breakpoint-max(900) {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    padding: 22px;
  }
}

.loading {
  &:after {
    z-index: 100;
    animation-name: shine;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }
}
@keyframes shine {
  from {
    left: -200px;
  }
  to {
    left: 120%;
  }
}
</style>
