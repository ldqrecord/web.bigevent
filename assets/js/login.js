$(function(){
  // 点击注册账号的链接
  $('#link_reg').on('click',function(){
      $('.login-box').hide()
      $('.reg-box').show()
  })
  
  // 点去登录的链接
  $('#link_login').on('click',function(){
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 从layui获取form对象 verify自定义校验规则
  var form = layui.form
  var layer = layui.layer
  form.verify({
      pwd:[ /^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
      repwd:function(value){  
          // 属性选择器 找到reg-box下的name
          var pwd =$('.reg-box [name=password]').val()
          if(pwd !== value) {
            return '两次密码不一致'
          }
      }
  })
  
  // 监听注册表单的提交事件
  $('#form_reg').on('submit',function(e){
     e.preventDefault();
     var data = {
      username:$('#form_reg [name=username]').val(),
      password:$('#form_reg [name=password]').val()
     }
     $.post('/api/reguser',data,function(res){
       if(res.status !==0){
         return layer.msg(res.message)
       }
       layer.msg('注册成功，请登录')
       // 模拟人的点击行为 转到登录页面
       $('#link_login').click()
     })
  })
  
  // 登录事件
  $('#form_login').submit(function(e){
    e.preventDefault()
    $.ajax({
      url:"/api/login",
      method:"POST",
      data:$(this).serialize(),
      success:function(res){
        if(res.status !==0){
          return layer.msg('登录失败')
        }
        layer.msg('登录成功')
        // console.log(res.token) 登录成功的token值保存到localStorage中
        localStorage.setItem('token',res.token)
        // 跳到后台主页
        location.href = './index.html'
      }
    })
  })
}) 

