$(function(){
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器 template-web提供
    template.defaults.imports.dataFormat =function(date){
        const dt =new Date(date)
        var y =dt.getFullYear()
        var m = dt.getMonth() + 1
        var d =dt.getDate()
        var hh =dt.getHours()
        var mm =dt.getMinutes()
        var ss =dt.getSeconds()
        return y+'-'+m+ '-'+d+ '-'+hh+ ':'+mm +":"+ss
    }
    // 定义补零的函数
    function padZero(n){
        return n>9?n:'0'+n
    }

    // 定义一个查询的参数对象 将来请求数据的时候
    // 需要将请求参数对象，提交到服务器
    var q = {
        pagenum:1 , //默认请求第一页的数据
        pagesize:2 ,//默认每页显示两条数据
        cate_id:"", //文章分类的id
        state:"" //文章的发布状态
    }
    
    
    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
       $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
           success:function(res){
             if (res.status !== 0) {
                return layer.msg('获取文章列表失败！')
              }
            // layer.msg("")
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            // 调用渲染分页的方法
            renderPage(res.total)
           }
       })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method:"GET",
            url:"/my/article/cates",
            success:function(res){
                if(res.status !==0){
                    return layer.msg('获取分类数据失败')
                }
              var htmlstr = template('tpl-cate',res)
              $('[name=cate_id]').html(htmlstr)
              form.render() //通知layui重新渲染表单区
            }
            
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        var cate_id =$('[name=cate_id]').val()
        var state =$('[name=state]').val()
        // 为查询参数对象q中对应属性赋值
        q.cate_id = cate_id
        q.state =state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })
    
    // 定义渲染分页的方法
    function renderPage(total){
        // console.log(total)
        //执行一个laypage实例
        laypage.render({
            elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit:q.pagesize, //每页显示数据
            curr:q.pagenum,   // 默认选中的分页
            layout:['count','limit','prev','page','next','skip'], //设置底部效果
            limits:[2,3,5,10],
            // 分页发生切换触发， 调用laypage.render()就会触发jump 显示条数也会触发
            jump: function(obj,first){
                //obj包含了当前分页的所有参数，
                // 比如：obj.limit 得到每页显示的条数
                q.pagenum = obj.curr //得到当前页，以便向服务端请求对应页的数据。
                // 根据最新的q获取对应的数据列表并渲染  不能直接调initTable()会死循环
                // first解决反复回调的问题 初次时true即使分页切换触发 非true就是渲染触发
                q.pagesieze = obj.limit
                if(!first){
                    initTable()
                }
              }
        });
    }

    // 为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn-del',function(){
        // 获取删除按钮的个数
        var len =$('.btn-del').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:"GET",
                url:"/my/article/delete/"+id,
                success:function(res){
                    if(res.status !==0){
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 当页数据删光，让页码值-1
                    if(len === 1 ){
                        // len=1证明删完之后，页面没有数据了
                        q.pagenum = q.pagenum ===1 ? 1 :q.pagenum -1
                         
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })
})