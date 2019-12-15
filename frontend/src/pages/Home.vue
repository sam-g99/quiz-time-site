<template>
  <div class="container">
    <!--<img id="svg" src="@/assets/logo.svg" alt="quiz time logo" />-->
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['mapped']),
  },
};
</script>

<style lang="scss" scoped></style>
