// 1.入口函数
$(function() {

    // 1.文章类别列表展示
    initArtCateList()
        // 封装函数
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                var str = template('tpl-cate', res)
                $('tbody').html(str)
            }
        });
    }

    // 2.显示添加文章分类列表
    var layer = layui.layer;
    $('#btnAdd').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#cate-add').html()
        });

    })

    // 3.提交文章分类添加（事件委托）
    var indexAdd = null;
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
            // 发起请求
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加成功，重新渲染页面
                initArtCateList()
                layer.msg('恭喜您，文章类别添加成功！')
                layer.close(indexAdd)
            }
        });
    })

    // 4.修改  获取原本值
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function() {
            //4.1 显示提示添加文章类别区域
            indexEdit = layer.open({
                type: 1,
                title: '修改文章分类',
                area: ['500px', '250px'],
                content: $('#cate-edit').html()
            });

            // 4.2获取Id发送Ajax请求 渲染到页面
            var Id = $(this).attr('data-id');
            $.ajax({
                method: "GET",
                url: "/my/article/cates/" + Id,
                success: function(res) {
                    form.val('form-edit', res.data)
                }
            });
        })
        // 5修改  提交
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败！')
                    }
                    layer.msg('更新分类数据成功！')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })
        // 6.删除
    $('tbody').on('click', '.btn-delete', function() {
        var Id = $(this).attr('data-id');
        // 先是对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // layer.close(index);
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg('恭喜您，文章类别删除成功！')
                    layer.close(index)
                }
            });
        });

    })
})