$(function(){
    var layer = layui.layer
    getUserInfo()
    $('#btnLogout').on('click',function(){
        // layui身上到处弹出框
        layer.confirm('确认是否退出?', {icon: 3, title:'提示'}, function(index){
            //1.清除本地的token
             localStorage.removeItem('token')
            //2.跳转到登录页
            location.href = './login.html'
            // 3.默认提供，关闭询问框
            layer.close(index);
          });
    })
})

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method:'GET',
        url:"/my/userinfo",
        success:function(res){
            if(res.status !==0){
                return layui.layer.msg('获取用户信息失败')
            }
            // 渲染用户的头像
            renderAvatar(res.data)
        },
        // 无论成功与否都执行，用来作守卫
        /* complete:function(res){
             console.log(res)  
            if(res.responseJSON.status === 1 &&res.responseJSON.message ==='身份认证失败！' ){
               // 1.强制清除本地token
               localStorage.removeItem('token')
               // 2.强制跳转本页面
               location.href = './login.html'
            //    alert('请先登录账号')
            }
        } */
    })
}

// 渲染用户的名字头像
function renderAvatar(user) {
    var name =user.nickname || user.username  //以昵称名优先
    $('#welcome').html('欢迎&nbsp;&nbsp;' +name)
    if(user.user_pic !== null) {
       // 渲染图片头像
       $('.layui-nav-img').attr('src',user.user_pic).show()
       $('.text-avatar').hide()
    }else {
      // 渲染文本头像
      $('.layui-nav-img').hide()
      var first = name[0].toUpperCase()
      $('.text-avatar').html(first).show()
    }
}