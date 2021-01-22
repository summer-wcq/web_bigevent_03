$(function() {
    var layer = layui.layer
    var form = layui.form
        // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 1.定义一个q查询对象
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类id
        state: '', //发布状态
    }

    initCate()
    initTable()
        // 2.获取文章列表数据
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染页面数据
                var str = template('tpl_table', res);
                $('tbody').html(str);
                // 调用分页
                renderPage(res.total)
            }
        });
    }
    // 3.初始化文章分类方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎渲染分类的可选项
                var str = template('tpl_cate', res);
                $('[name=cate_id]').html(str);
                form.render();
            }
        });
    }

    // 4.筛选功能
    $('#form_search').on('submit', function(e) {
            e.preventDefault()
                // 获取
            var cate_id = $('[name=cate_id]').val();
            var state = $('[name=state]').val();
            // 赋值
            q.cate_id = cate_id;
            q.state = state;
            // 初始化文章列表
            initTable()
        })
        // 5.分页
    var laypage = layui.laypage;

    function renderPage(total) {
        // alert(total)
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            // 分页模块设置
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页展示多少条
            // 分页发生切换的时候，触发 jump 回调
            jump: function(obj, first) {
                // console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    //    首次不执行
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 6.删除
    $('tbody').on('click', '.btn-delete', function() {
        var Id = $(this).attr('data-id');
        // 6.1显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 删除成功 渲染页面
                    layer.msg('恭喜您，文章删除成功！');
                    // 页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                        initTable();
                }
            });
            layer.close(index);
        });
    })
})