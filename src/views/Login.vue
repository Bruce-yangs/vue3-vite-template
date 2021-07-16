<template>
  <div class="login-container top-box">
    <div class="content-box">
      <el-form
        label-position="right"
        label-width="0"
        :model="form"
        ref="ruleForm"
        :rules="rules"
      >
        <div class="title">差点是帅哥、</div>
        <p class="tip">用户名</p>
        <el-form-item prop="loginName">
          <el-input
            v-model.trim="form.loginName"
            clearable
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <p class="tip">密码</p>
        <el-form-item prop="pwd">
          <el-input
            v-model.trim="form.pwd"
            clearable
            type="password"
            placeholder="6-20位字母数字、数字或者英文符号，区分大小写"
          ></el-input>
        </el-form-item>
        <p class="tip">验证码</p>
        <el-form-item prop="authCode" style="margin-bottom: 7px;">
          <el-input
            @keyup.enter="onClickLoginBtn"
            clearable
            v-model.trim="form.authCode"
            placeholder="请输入验证码"
          ></el-input>
          <img
            :src="imgSrc"
            alt=""
            class="auth_code"
            @click="asyncGetImgCode"
          />
        </el-form-item>
        <div class="error-info" v-show="errorText">
          <i class="el-icon-warning"></i>
          <span>{{ errorText }}</span>
        </div>
        <div class="login-btn" @click="onClickLoginBtn">登 录</div>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import { ref, reactive, toRefs, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../utils/request'

export default {
  setup() {
    const router = useRouter()
    const ruleForm = ref(null)

    const datas = reactive({
      form: {
        loginName: '',
        pwd: '',
        authCode: ''
      },
      rules: {
        loginName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        authCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      imgSrc: '',
      authCodeKey: '', //后端需要校验是否过期
      errorText: '',
      timer: null //定时刷新验证码
    })

    //获取图形验证码
    const asyncGetImgCode = () => {
      axios.get('/common/authCode').then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          datas.imgSrc = 'data:image/jpeg;base64,' + data.authCode
          datas.authCodeKey = data.authCodeKey
          if (datas.timer) clearInterval(datas.timer)
          datas.timer = setInterval(asyncGetImgCode, 60000)
        }
      })
    }

    //登录
    const asyncLogin = () => {
      const { pwd, ...data } = datas.form
      const _data = {
        ...data,
        authCodeKey: datas.authCodeKey,
        pwd: md5(pwd)
      }

      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: '/conductorUser/login',
          data: {
            ..._data
          }
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    }

    //获取菜单权限
    const asyncGetPowerList = () => {
      axios
        .get('/conductorUser/getPowerList')
        .then(res => {
          if (res.data.code === 200) {
            const menuData = res.data.data
            let btnLists = []
            menuData &&
              menuData.map(item => {
                if (item.btns && item.btns.length > 0) {
                  btnLists = btnLists.concat(item.btns)
                }
                if (item.children && item.children.length > 0) {
                  item.children.map(val => {
                    if (val.btns && val.btns.length > 0) {
                      btnLists = btnLists.concat(val.btns)
                    }
                  })
                }
              })
            sessionStorage.setItem('menuList', JSON.stringify(menuData))

            sessionStorage.setItem('btnLists', JSON.stringify(btnLists))
            router.push('/index')
          } else {
            datas.errorText = ' ' + res.data.msg
          }
        })
        .catch(error => {
          datas.errorText = ' ' + error
        })
    }

    //点击--登录
    const onClickLoginBtn = () => {
      ruleForm.value.validate(valid => {
        if (valid) {
          asyncLogin()
            .then(res => {
              if (res.data.code === 200) {
                localStorage.setItem('loginName', datas.form.loginName)
                localStorage.setItem('token', res.data.data)
                localStorage.setItem('username', res.data.data.name)
                if (datas.timer) clearInterval(datas.timer)
                asyncGetPowerList()
              } else {
                datas.errorText = ' ' + res.data.msg
                asyncGetImgCode()
              }
            })
            .catch(error => {
              if (!error.response) {
                datas.errorText = ' 网络中断，请检查后重试'
              } else {
                datas.errorText = ' 登录超时，请重新登录'
              }
              asyncGetImgCode()
            })
        }
      })
    }

    asyncGetImgCode()

    onBeforeUnmount(() => {
      if (datas.timer) clearInterval(datas.timer)
      datas.timer = null
    })

    return {
      ...toRefs(datas),
      onClickLoginBtn,
      ruleForm,
      asyncGetPowerList,
      asyncGetImgCode


      


    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
.login-container {
  width: 100%;
  height: 100%;
}
@keyframes scales {
  0% {
    // transform: scale(1);
    background-size: 100% 100%;
  }
  100% {
    // transform: scale(1.1);
    background-size: 120% 120%;
  }
}
.top-box {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: url('https://qntemp3.bejson.com/upload/97364482649104210.jpg?imageView2/0/w/0/h/0/format/webp')
    no-repeat top center;
  // background: url('../assets/login_bg.webp') no-repeat top center;
  background-size: 100% 100%;
  animation: scales 30s linear forwards;

  .content-box {
    div.title {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin: 20px 0 40px 0;
      color: #ff4b61;
    }
    p.tip {
      padding-bottom: 3px;
      font-size: 14px;
      color: #6f788c;
    }
  }
  .el-form {
    width: 480px;
    // height: 505px;
    padding: 20px 65px 57px;
    background: rgb(252 253 255 / 70%);
    border-radius: 4px;
    box-sizing: border-box;
    .el-form-item {
      .icon {
        position: absolute;
        top: 12px;
        left: 13px;
        z-index: 1;
        &.name {
          top: 18px;
        }
      }

      .auth_code {
        position: absolute;
        top: 1px;
        right: 1px;
        height: 53px;
        width: 107px;
        cursor: pointer;
        border-radius: 0 8px 8px 0;
      }
    }

    .error-info {
      color: #f0474c;
      margin-bottom: 3px;
      font-size: 14px;
    }

    .login-btn {
      height: 50px;
      line-height: 50px;
      margin-top: 40px;
      text-align: center;
      cursor: pointer;
      color: #fff;
      letter-spacing: 2px;
      background: #517ef6;
      font-weight: bold;
    }
  }
}
</style>
<style>
.login-container .el-input {
  height: 55px;
  width: 100%;
  font-size: 13px;
}
.login-container .el-input .el-input__inner {
  height: 55px;
  width: 100%;
  font-size: 13px;
}

.login-container .el-input .el-input__inner:focus {
  border-color: #59b9e2;
}

.login-container .el-form-item__content .el-form-item__error {
  width: 100%;
  padding-top: 6px;
  color: #f0474c;
  text-align: right;
}

.login-container .el-form-item {
  margin-bottom: 10px;
}
.login-container .el-input__suffix .el-input__suffix-inner {
  position: relative;
  top: 12px;
}
</style>
