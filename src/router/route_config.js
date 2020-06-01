import Login from "../views/Login.vue";

let routes = [
    {
        path: "mapView",
        name: "mapView",
        component: () => import("../views/mapView.vue"),
        description: "地图",
    },
    {
        path: "deviceManager",
        name: "deviceManager",
        component: () => import("../views/deviceManager.vue"),
        description: "设备管理",
    },
    {
        path: "logManager",
        name: "logManager",
        component: () => import("../views/logManager.vue"),
        description: "日志管理",
    },
    {
        path: "cloudAction",
        name: "cloudAction",
        component: () => import("../views/cloudAction.vue"),
        description: "云指导",
    },
    {
        path: "waringManager",
        name: "waringManager",
        component: () => import("../views/waringManager.vue"),
        description: "告警管理",
    },
    {
        path: "systemManager",
        name: "systemManager",
        component: () => import("../views/systemManager.vue"),
        description: "设置",
    },
];

let childrenRoute = [];
for (let key in routes) {
    childrenRoute.push(routes[key]);
}
let defaultRoute = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/home",
        name: "home",
        component: () => import("../views/Home.vue"),
        children: childrenRoute
    },
    {
        path: "/404",
        name: "404",
        component: () => import("../views/404.vue")
    }
];

export default defaultRoute;