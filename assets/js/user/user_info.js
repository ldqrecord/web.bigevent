$(function(){
    var layer = layui.layer
    var form = layui.form
    form.verify({
        nickname:function(value){
            if(value.length >6){
                return '昵称必须在1-6个之间'
            }
        }
    })
    initUserinfo()
    // 初始化用户的基本信息
    function initUserinfo(){
        $.ajax({
            method:"GET",
            url:"/my/userinfo",
            success:function(res){
               if(res.status !==0){
                   return layer.msg('获取用户信息失败')
               }
               // console.log(res)
               form.val("formUserInfo",res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click',function(e){
        // 阻止表单的默认重置事件
        e.preventDefault()
        initUserinfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        e.preventDefault()    
        $.ajax({
            method:"POST",
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面的方法发，重新渲染用户的头像和昵称
                window.parent.getUserInfo()
            }
        })
    })
})
