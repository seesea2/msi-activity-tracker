<template>
  <div>
    <router-view />

    <app-footer></app-footer>
  </div>
</template>

<script setup>
import AppFooter from "./components/AppFooter.vue";
</script>

<style>
html,
body {
  margin: 0;
  font-family: Helvetica, Arial, sans-serif;
  /* background-color: #f8f9fa; */
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* for footer */
  min-height: 100%;
  padding-bottom: 3rem;
}

.bg-mygray {
  background-color: #f5f5f5;
}

.modal-fullscreen {
  padding-right: 17px;
}
.bg-myblue {
  background-color: #3f51b5;
}

/* for layout debugging */
/* * {
  border-style: solid;
  border-width: 1px;
  border-color: red;
} */
</style>
