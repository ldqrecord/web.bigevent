// 每次调用$.get() $.post() 或$.ajax() 
//会先调用下函数 可拿到ajax提供的配置对象
$.ajaxPrefilter(function(options){
    options.url = 'http://api-breakingnews-web.itheima.net' +options.url
    console.log(options.url)
})