<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item
          v-for="(childItem,ckey) in defaultRoute[2].children"
          :key="ckey"
          :index="childItem.path"
          @click="linkTo(childItem.path)"
        >{{childItem.description}}</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import defaultRoute from "../router/route_config.js";
export default {
  data() {
    let activeIndex = "mapView";
    let index = location.hash.lastIndexOf("/") + 1;
    let tmp = location.hash.substr(index);
    if (location.hash.split("/").length > 2 && tmp) {
      activeIndex = tmp;
    }
    console.log(activeIndex);
    return {
      defaultRoute,
      activeIndex
    };
  },
  methods: {
    linkTo(path) {
      location.hash = "#/home/" + path;
    }
  }
};
</script>

<style>
</style>