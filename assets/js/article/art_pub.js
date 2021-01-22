$(function() {
    var layer = layui.layer;
    var form = layui.form
        // 调用函数
    initCate()
        // 1.定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎，渲染下拉列表
                var str = template('tpl-cate', res);
                $('[name=cate_id]').html(str)
                form.render()
            }
        });
    }
    //2 初始化富文本编辑器
    initEditor()
        // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮 选择图片
    $('#btnChooseImg').on('click', function() {
            $('#coverFile').click()
        })
        // 5.渲染文章封面 绑定change事件
    $('#coverFile').on('change', function(e) {
        var file = e.target.files[0]
        if (file == undefined) {
            return;
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 6.修改状态
    var state = '已发布';
    $('#btnSave2').on('click', function() {
        state = '已存为草稿';
    })

    // 7. 为表单绑定submit提交事件
    $('#form_pub').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault()
            // 创建FormData对象
        var fd = new FormData(this);
        // 放入状态
        fd.append('state', state)
            // 生成二进制文件图片
        $image.cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            // 将 Canvas 画布上的内容，转化为文件对象
            .toBlob(function(blob) {
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                    // 发送Ajax要在toBlob()函数里面
                    // console.log(...fd); //扩展运算符，一个个的数组
                publishArticle(fd)
            })
    })

    // 8.封装函数
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                // 失败判断
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，发布文章成功！')
                    // 跳转
                    // location.href = '/home/article/art_list.html';
                setTimeout(function() {
                    window.parent.document.getElementById('art_list').click()
                })
            }
        });
    }
})