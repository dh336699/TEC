//index.js
//获取应用实例
import * as api from '../../api/index.js'
import * as xx from '../../common/wx.js' 

Page({
    data: {
        userInfo: {},
        skipUrl: '',
        systemType: {}
    },
    userInfoHandler(e) {
        wx.showLoading({
            title: '获取微信授权中',
            mask: true
        })
        this.setData({
            userInfo: e.detail.userInfo
        })
        if (!this.data.userInfo) {
            wx.showToast({
                title: '您拒绝了授权请求请重新获取',
                icon: 'none',
            })
        } else {
            this._login()
        }
    },
    _login() {
        let that = this
        wx.login({
            success(res) {
                if (res.code) {
                    let obj = {}
                    obj.code = res.code
                    that._getToken(obj)
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },
    _getToken(obj) {
        const datas = {
            code: obj.code
        }
        api.getToken(datas).then(res => {
            if (res.data.sessionId) {
                xx.hide()
                xx.setCookie('token', res.data.sessionId)
                this.teacherCheck()
            } else {
                xx.toast2(res.data.msg)
            }
        })
    },
    teacherCheck () {
        api.teacherCheck().then(res => {
            console.log(res)
            if (res.data.retCode === '000003') {
                xx.newTo('/pages/teacher-check/teacher-check')
            } else xx.newTo('/pages/login/login')
        })
    }
})