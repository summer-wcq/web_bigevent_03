$(function() {
    // 1.点击按钮
    $('#link-reg').on('click', function() {
        $('.login').hide()
        $('.reg').show()
    })
    $('#link-login').on('click', function() {
        $('.login').show()
        $('.reg').hide()
    })

    // 2.自定义校验规则
    var form = layui.form
    var layer = layui.layer
        // 通过form.verify函数自定义校验规则
    form.verify({
        // 自定义了一个pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function(value) {
            // 获取密码的值
            var pwd = $('.reg input[name=password]').val().trim()
                // 比较
            if (value !== pwd) {
                return '两次密码输入不一致'
            }
        }
    });

    // 3.注册
    $('#form_reg').on('submit', function(e) {
        // 阻止默认跳转
        e.preventDefault();
        // 发送请求、
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: $(this).serialize(), //{
            //     username: $('.reg [name=username]').val(),
            //     password: $('.reg [name=password]').val(),
            // },
            success: function(res) {
                // 返回判断状态
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功后处理代码
                layer.msg('注册成功，请前往登录')
                    // 手动切换到登录表单
                $('#link-login').click();
                // 重置form表单  清空
                $('#form_reg')[0].reset()
            }
        });
    })

    // 4.登录功能
    $('#form_login').on('submit', function(e) {
        e.preventDefault()
            // 提交
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功
                layer.msg('登录成功')
                    // 跳转
                location.href = '/index.html';
                // 保存token
                localStorage.setItem('token', res.token)
            }
        });
    })
})