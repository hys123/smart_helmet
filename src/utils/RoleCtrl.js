import { asideNav as roleAside } from "../role_config.js";
import { cookieCtrl, sstCtrl } from './utils.js'

let getPermittedAside = () => {
    let bePermit = "no permitted";
    let cookieInfo = cookieCtrl.getCookie("loginInfo");
    let sstInfo = sstCtrl.getItem("loginInfo");
    if (cookieInfo) {
        let roleTmp = roleAside[cookieInfo.user.role];
        if (Object.keys(roleTmp).length != 0) {
            bePermit = roleAside[cookieInfo.user.role];
        }
    } else if (sstInfo) {
        let roleTmp = roleAside[sstInfo.user.role];
        if (Object.keys(roleTmp).length != 0) {
            bePermit = roleAside[sstInfo.user.role];
        }
    } else {
        bePermit = "please to login"
    }
    return bePermit;
}
/* 获取名字，密码，token */
let getNPT = () => {
    let nptInfo = "";
    let cookieInfo = cookieCtrl.getCookie(location.host);
    let sstInfo = sstCtrl.getItem(location.host);
    if (cookieInfo) {
        nptInfo = cookieInfo;
    } else if (sstInfo) {
        nptInfo = sstInfo;
    } else {
        nptInfo = "please to login"
    }
    return nptInfo;
}
/* 获取所有登录信息*/
let getLGInfo = () => {
    let loginInfo = "";
    let cookieInfo = cookieCtrl.getCookie("loginInfo");
    let sstInfo = sstCtrl.getItem("loginInfo");
    if (cookieInfo) {
        loginInfo = cookieInfo;
    } else if (sstInfo) {
        loginInfo = sstInfo;
    } else {
        loginInfo = "please to login"
    }
    return loginInfo;
}

const roleCtrl = {
    getPermittedAside,
    getNPT,
    getLGInfo
};

export default roleCtrl;