<template>
  <el-container>
    <el-header>
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item
          v-for="(childItem,ckey) in defaultRoute[2].children"
          :key="ckey"
          :index="childItem.path"
        >
          <a :href="'/home/'+childItem.path">{{childItem.description}}</a>
        </el-menu-item>
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
    return { defaultRoute };
  }
};
</script>

<style>
</style>