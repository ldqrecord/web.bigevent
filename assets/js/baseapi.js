// 每次调用$.get() $.post() 或$.ajax() 
//会先调用下函数 可拿到ajax提供的配置对象
$.ajaxPrefilter(function(options){
    options.url = 'http://api-breakingnews-web.itheima.net' +options.url
    // console.log(options.url)

    // 统一为my有权限的接口，设置header请求头
    if(options.url.indexOf('/my')!== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI'
        }
    }

    // 全局统一挂载 complete回调函数
    options.complete = function(res) {
        if(res.responseJSON.status === 1 &&res.responseJSON.message ==='身份认证失败！' ){
            // 1.强制清除本地token
            localStorage.removeItem('token')
            // 2.强制跳转本页面
            location.href = './login.html'
         //    alert('请先登录账号')
         }
    }
})