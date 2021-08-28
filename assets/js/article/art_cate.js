$(function(){
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method:"GET",
            url:"/my/article/cates",
            success:function(res){
                if(res.status !==0 ){
                    return layui.layer.msg('获取文章列表失败')
                }
                // layui.layer.msg('获取文章列表成功')
                var htmlstr = template("tpl-table",res)
                $('tbody').html(htmlstr)
            }
        })
    }
    
    var indexAdd = null   //添加弹出层关闭需要layer.open的返回值作为参数
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            type:'1',
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area: ['500px', '300px']
          });   
    })
    

    // 通过代理形式，为form-add表单绑定submit事件  表单先前未创建
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        $.ajax({
            method:"POST",
            url:"/my/article/addcates",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('新增分类失败')
                }
                initArtCateList()
                layer.msg('新增分类成功')
                layer.close(indexAdd)
            }
        })
    })
     
    // 代理修改点击事件
    var indexEdit =null
    $('tbody').on('click',".btn-edit",function(){
        // 弹出修改文章分类层
        indexEdit = layer.open({
            type:'1',
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
          })
          // 通过自定义属性data-id获取id
          var id =$(this).attr('data-Id')
          // console.log(id)
          $.ajax({
              method:"GET",
              url:"/my/article/cates/"+id,
              success:function(res){
                // 表单赋值 借用隐藏域赋值
                console.log(res)
                form.val('form-edit', res.data)
              }
          })
    })

    // 监听表单提交行为
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method:"POST",
            url:"/my/article/updatecate",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('更新分类失败')
                }
                initArtCateList()
                layer.msg('更新分类成功')
                layer.close(indexEdit)
            }
        })
    })

    //
    
    $('tbody').on('click',".btn-del",function(){
        var id =$(this).attr('data-Id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:"GET",
                url:"/my/article/deletecate/"+id,
                success:function(res){
                    if(res.status !==0 ){
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index)
                    initArtCateList()
                }
            })
        });
    })
})