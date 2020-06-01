import Vue from 'vue'
import Router from 'vue-router'
import defaultRoute from "./route_config.js";

Vue.use(Router)

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: defaultRoute
});
