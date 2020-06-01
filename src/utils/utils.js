import axios from "axios";
import $vm from "../main";
import { Loading } from 'element-ui';
import roleCtrl from '../utils/RoleCtrl';
/* basic host&port */
const baseURL = process.env.VUE_APP_API_URL;//"http://172.24.4.147:9010";//"http://api.meet2cloud.com/telconf";
const loadingInstance = {}
const specialErrorCode = ["BRG10010", "WEBTOOLSCORE00403", "WEBTOOLSCORE10103"];
/* 共有请求 */
const xmlRequest = config => {
  let configInit = {
    baseURL,
    method: "post",
    url: "",
    data: {},
    xhrFields: {
      withCredentials: true//表示跨域时要求客户端发送Cookie等认证信息 涉及登陆必须开启
    },
    loadingConfig: "",
    needLoad: true,
    success: response => {
      console.log(response);
    },
    error: () => {
      // console.log(error);
    }
  };
  Object.assign(configInit, config);
  var token = "",
    sstInfo = sstCtrl.getItem(location.host),
    cookieInfo = cookieCtrl.getCookie(location.host);
  if (sstInfo) {
    token = sstInfo.token;
  } else if (cookieInfo) {
    token = cookieInfo.token;
  }
  let axiosModel = axios.create({
    method: configInit.method,
    url: configInit.baseURL + configInit.url,
    data: JSON.stringify(configInit.data),
    headers: {
      authorization: token ? token : "",
      'Content-Type': "application/json",
      device: "PC",
      appId: cookieCtrl.getCookie('appId')
    }
  });
  let uniqueId = parseInt(Math.random() * 10000);
  if (configInit.needLoad) {
    axiosModel.interceptors.request.use(config => {
      // 在发送请求之前做些什么
      if (configInit.loadingConfig != "") {
        loadingInstance[uniqueId] = Loading.service(configInit.loadingConfig);
      } else {
        loadingInstance[uniqueId] = Loading.service();
      }
      return config;
    }, error => {
      // 对请求错误做些什么
      loadingInstance[uniqueId].close();
      return Promise.reject(error);
    });
    axiosModel.interceptors.response.use(function (response) {
      // 对响应数据做点什么
      loadingInstance[uniqueId].close();
      return response;
    }, function (error) {
      // 对响应错误做点什么
      loadingInstance[uniqueId].close();
      return Promise.reject(error);
    });
  }
  axiosModel().then(response => {
    if (response.data.code == "00000") {
      configInit.success(response.data, response);
    } else {
      if (specialErrorCode.indexOf(response.data.code) != -1) {
        //多点登录踢出code
        if (response.data.code == "WEBTOOLSCORE00403") {
          $vm.$message({
            type: "error",
            message: response.data.message
          });
          setTimeout(() => {
            location.href = "/login";
          }, 2000);
        } else if (response.data.code == "WEBTOOLSCORE10103") {
          if (typeof (roleCtrl.getLGInfo()) == "string") {
            $vm.$message({
              type: "error",
              message: response.data.message
            });
          } else {
            let role = roleCtrl.getLGInfo().user.role;
            $vm.$message({
              type: "primary",
              message: "会议已结束"
            });
            if (role == "VISITOR") {
              setTimeout(() => {
                location.href = "/login";
              }, 2000);
            } else {
              setTimeout(() => {
                location.href = "/";
              }, 2000);
            }
          }
        }
      } else {
        $vm.$message({
          type: "error",
          message: response.data.message
        });
      }
      configInit.error(response.data, response);
    }
  })
    .catch(error => {
      $vm.$message({
        type: "error",
        message: error.message
      });
      configInit.error(error, error);
    });
  return axiosModel
};
/* sessionStorage 操作 */
const sstCtrl = {
  setItem: function (key, value) {
    sessionStorage.setItem(key, Base64.encode(JSON.stringify(value)));
  },
  getAllItem: function () {
    let result = {};
    let keyArr = Object.keys(sessionStorage);
    keyArr.forEach((val) => {
      result[val] = this.getItem(val);
    })
    return result;
  },
  getItem: function (key) {
    return sessionStorage.getItem(key) ? JSON.parse(Base64.decode(sessionStorage.getItem(key))) : sessionStorage.getItem(key);
  },
  isIn: function (key) {
    return this.getAllItem().hasOwnProperty(key);
  },
  clearItem: function (key) {
    sessionStorage.removeItem(key);
  },
  clear: function () {
    sessionStorage.clear();
  }
};
const cookieCtrl = {
  //设置cookie
  setCookie: function (name, value, day) {
    var date = new Date();
    date.setDate(date.getDate() + day);
    if (typeof (value) == "object") {
      value = JSON.stringify(value);
    }
    document.cookie = name + '=' + Base64.encode(value) + ';expires=' + date;
  },
  //获取cookie
  getCookie: function (name) {
    var reg = RegExp(name + '=([^;]+)');
    var arr = document.cookie.match(reg);
    if (arr) {
      var tmp = Base64.decode(arr[1]);
      if (tmp.indexOf("{") == 0 && tmp.lastIndexOf("}") == tmp.length - 1) {
        tmp = JSON.parse(tmp);
      }
      return tmp;
    } else {
      return '';
    }
  },
  //删除cookie
  delCookie: function (name) {
    if (this.getCookie(name)) {
      this.setCookie(name, null, -1);
    }
  }
};
const validateRegex = {
  IPAddress: "^d{1,3}.d{1,3}.d{1,3}.d{1,3}$",
  IPAddressText: "Must be a numeric IP address",
  IPAddressMask: "[d.]",
  number: "^d+$",
  numberText: "填写内容必须全是数字",
  Double: "^d+.?d{1,2}$",
  DoubleText: "请填入正确的数字，数字的小数位必须是一位或者两位",
  notSpecialChar: "^[\u4E00-\u9FA5A-Za-z0-9_s[]]+$",
  notSpecialCharText: '不允许输入\\:*?"<>|等特殊字符',
  siteUrlChar: "^[a-z0-9-_]+$",
  siteUrlCharText: "只允许输入a-z0-9_等特殊字符",
  taxpayerIdentifyChar: "^[a-z0-9A-Z]+$",
  taxpayerIdentifyCharText: "只允许输入字母和数字",
  email: "^([a-zA-Z0-9_-]+)@([a-zA-Z0-9_-])*(.)*$", //"^([a-zA-Z0-9_-]{1,16})@([a-zA-Z0-9]{1,9})(.[a-zA-Z0-9]{1,9}){0,3}(.(?:com|net|org|edu|gov|mil|cn|us)){1,4}$",
  emailText: '请输入正确的电子邮件地址，格式如： "user@example.com"',
  telphone: "^[0-9-]*$",
  telphoneText: "请输入正确的电话",
  mobilphone: "^[1][3,4,5,7,8][0-9]{9}$",
  urlText: '请输入项必须是URL地址，格式如： "http://www.example.com"'
};
const Base64 = {
  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  // public method for encoding
  encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = Base64._utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }
    return output;
  },
  // public method for decoding
  decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\\+\\/\\=]/g, "");
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = Base64._utf8_decode(output);
    return output;
  },

  // private method for UTF-8 encoding
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c = 0, c2 = 0, c3 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}

export { baseURL, validateRegex, xmlRequest, sstCtrl, cookieCtrl, Base64 };
