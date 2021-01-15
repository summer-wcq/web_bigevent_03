// 开发环境
var baseURL = 'http://api-breakingnews-web.itheima.net'
    // 拦截所有Ajax请求：get/post/ajax
$.ajaxPrefilter(function(options) {
    // options获取到Ajax所有参数信息
    // alert(options.url)
    // 拼接对应环境的服务器地址
    options.url = baseURL + options.url
        // alert(options.url)
})