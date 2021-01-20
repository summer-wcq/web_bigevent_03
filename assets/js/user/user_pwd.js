// 1.入口函数
$(function() {
    // 2.定义校验规则
    var form = layui.form;
    var layer = layui.layer
    form.verify({
            // 1.1密码
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 1.2新旧不重复
            samePwd: function(value) {
                // value是新密码，旧密码需要获取
                if (value == $('[name=oldPwd]').val()) {
                    return '新密码与原始密码不能相同！'
                }
            },
            // 1.3两次新密码必须相同
            rePwd: function(value) {
                // value是再次输入的新密码，新密码需要重新获取
                if (value !== $('[name=newPwd]').val()) {
                    return '两次密码输入不一致！'
                }
            }
        })
        // 3.表单提交
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        // 发起请求
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改密码成功！');
                $('.layui-form')[0].reset()
            }
        });
    })
})