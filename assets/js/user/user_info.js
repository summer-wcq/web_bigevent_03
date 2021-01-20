$(function() {
    var form = layui.form;
    var layer = layui.layer;
    // 1.自定义校验规则
    form.verify({
            nickname: function(value) {
                if (value.length > 6) {
                    return '昵称长度必须在 1 ~ 6 个字符之间！'
                }
            }
        })
        // 用户渲染
    initUserInfo()
        // 2.初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res);
                // form.val('filter', object);快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        });
    }

    // 3.重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    // 4.修改用户信息
    $('.layui-form').on('submit', function(e) {
        // 组hi在表单的默认重置行为
        e.preventDefault()
            // 发起请求
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败！')
                }
                layer.msg('恭喜您，用户信息修改成功！')
                window.parent.getUserInfo()
            }
        });
    })
})