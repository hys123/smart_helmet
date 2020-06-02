<template>
  <div class="login">
    <div class="wrapper">
      <div class="title">智能头盔管理系统</div>
      <div class="box">
        <div class="box-title">管理员登陆</div>
        <div class="content">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="70px"
            class="rule-form"
          >
            <el-form-item label="账号" prop="account">
              <el-input v-model="ruleForm.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="verificationCode" class="verification-code">
              <el-input v-model="ruleForm.verificationCode"></el-input>
              <el-button type="primary" plain @click="getVerificationCode">获取验证码</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn" type="primary" @click="submitForm('ruleForm')">登陆</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        account: "",
        password: "",
        verificationCode: ""
      },
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        verificationCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //登陆
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$router.push({
            path: "/home"
          });
        } else {
          return false;
        }
      });
    },
    //获取验证码
    getVerificationCode() {}
  }
};
</script>

<style lang="less" scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom, #4eb1e2, #0557c2);
  .wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .title {
      text-align: center;
      color: #fff;
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 100px;
      margin-top: -100px;
    }
    .box {
      border-radius: 20px;
      padding: 20px;
      box-sizing: border-box;
      background: #fff;
      .box-title {
        font-size: 18px;
        text-align: center;
        color: #606266;
        margin-bottom: 20px;
      }
      .content {
        .verification-code {
          .el-form-item__content {
            .el-input {
              flex: 1;
            }
            button {
              width: 110px;
              margin-left: 20px;
            }
          }
        }
        .login-btn {
          width: 100%;
          margin-top: 30px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>