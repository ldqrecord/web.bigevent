$(function(){
    var layer = layui.layer
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
      aspectRatio: 1,  //控制裁剪区域宽高比
      // 指定预览区域
      preview: '.img-preview'
    }
    
    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click',function(){
        $('#file').click()
    })
 
    $('#file').on('change',function(e){   //监听文件选择框改变
        // console.log(e)  获取用户选择的文件
        var filelist =e.target.files
        if(filelist.length ===0 ){
           return layer.msg('请选择照片！')
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })

    $('#btnUpload').on('click',function(){
        // 1拿到用户裁剪后的头像
        var dataURL = $image
        .cropper('getCroppedCanvas', { 
            width: 100,
            height: 100
        })
        .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2上传
        $.ajax({
            method:"POST",
            url:"/my/update/avatar",
            data:{
                avatar:dataURL
            },
            success:function(res){
                if(res.status !==0) {
                    return layer.msg('更新头像失败')
                }
                layer.msg('更新头像成功')
                window.parent.getUserInfo()
            }
        })
    })
})
