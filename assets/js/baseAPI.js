// 开发环境
var baseURL = 'http://api-breakingnews-web.itheima.net'
    // 拦截所有Ajax请求：get/post/ajax
$.ajaxPrefilter(function(options) {
    // options获取到Ajax所有参数信息
    // alert(options.url)
    // 拼接对应环境的服务器地址
    options.url = baseURL + options.url
        // alert(options.url)

    // 统一为有权限的接口，设置headers请求头
    // 以/api开头的请求路径，不需要访问权限
    // 以/my开头的请求路径，需要在请求头中携带 Authorization身份认证字段，才能正常访问成功
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 3.登录拦截（不登录，不允许访问其他页面）
    options.complete = function(res) { //complete每次完成都会触发这个函数
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status === 1 && obj.message === '身份认证失败！') {
            // 1.清空本地token
            localStorage.removeItem("token");
            // 2.页面跳转
            location.href = "/login.html";
        }
    }
})