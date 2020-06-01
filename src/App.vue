<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import defaultRoute from "./router/route_config.js";
export default {
  name: "App",
  data() {
    return {
      routes: defaultRoute
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 10px;
}
</style>
