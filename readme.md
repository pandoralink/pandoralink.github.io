# 网页文档
网页代码采用 vue+Filesaver+jszip+element ui

## html 部分

这里只讲嵌套在el-contain的四个el-upload

```Html
<el-upload
    ref="load_1"
    action="https://jsonplaceholder.typicode.com/posts/"
    multiple
    :http-request="elpush"
    style="margin-bottom: 10px;">
    <el-button slot="trigger" type="primary" size="small">上传文件</el-button>
    <el-button type="success" size="small" v-on:click="compressingStream" style="margin-left: 10px;">压缩</el-button>
</el-upload>
``` 
action旁边链接是伪服务器，这个网页并没有用到服务器，但是**el-upload**必选参数里面有action，这个不用管

简单说**el-upload**就是用来上传文件的，需要按钮的要加el-button，不需要的就像第二个el-upload，那一个多了drag(拖拽)也就是有拖拽文件的功能，描述是压缩的那个el-button，是起到处理压缩文件的功能(传递一个函数)，这个后面有说，剩下三个都差不多，但是有两个是压缩，有两个是解压

上面那些并不重要，相当于我只是在某个#include<xx.h>引用函数

## js部分

js部分和jszip.js和Filesevar.js有关

```js
/*elpush 存储上传文件*/
elpush: function(e){
    this.flag = false;  //关闭进度条
    this.percent = 0;   //进度条清0
    var file = this.files;
    this.filename.push(e.file.name);
    file.push(e.file);
}
```
elpush() 存储上传文件，这个网页不涉及到**服务器**所以我自定义了一个处理文件的函数，剩下的不做过多介绍

```js
compressing: function() {
    if(this.files.length === 0)
        this.toop();    //vue method 中方法的互相调用要加上"this."
    else{
        this.flag = true;  //开启进度条
        var file_ing = this.files;
        var filename = this.filename;
        var folder_name = "好家伙"+Math.ceil(Math.random()*1000);
        var zip = new JSZip();
        file_ing.forEach((element,order) => {
            zip.file(filename[order],element,{ base64: true });
        });
        zip.generateAsync({
            type: 'blob' ,
            compression:"DEFLATE", 
            mimeType: "application/zip",
            compressionOptions:{
                level: 9
            }
        },(metadata) => {
            this.percent = parseInt(metadata.percent);
        }).then(content => {
            saveAs(content, folder_name+".zip");
            this.delete(zip);   //清空zip objecr
            this.files = [];
            this.filename = [];
            this.$refs.load_1.clearFiles(); //这个要在el-upload 处设置ref的值
            this.$refs.load_2.clearFiles(); //清空列表
        });   
    }
},
```
这是压缩部分的代码，可能你看到这里的时候想问了，这是一个**压缩网页**那么你的压缩功能是怎么实现的呢？？不是说有**huffman编码**的什么的吗？？不好意思，这个功能我们交给了``var zip = new JsZip();``实现，不要问为什么，问就是压缩核心代码有3000多行，我没时间写，有时间我也不会去写

所以你可以知道**JsZip.js**是我们压缩的头文件，C++ 也有new，应该很好理解

``var folder_name = "好家伙"+Math.ceil(Math.random()*1000);``是下载压缩包的名字，最关键的来了，``zip.file(name, data [,options])``，是处理文件的入口，[,options]是文件的编码格式，我们默认是base64，如果不是base64编码格式的应该会出错，不信你可以试一下

压缩功能用``zip.generateAsync(options[, onUpdate])``options在这里是一个object（对象），onUpdate是方法（你可以理解为函数），options里面属性的功能看名字应该就能知道``this.percent = parseInt(metadata.percent);``是用来做进度条的``saveAs(content, folder_name+".zip");``保存网页二进制数据的一种方法

讲完压缩就可以讲解压，解压elpush_realese()``zip.loadAsync(data [, options])``遍历压缩包内容，返回一个有压缩内容的异步，zip.filter(predicate)用来判断是不是文件夹，跟elpush()一样，压缩最关键的部分来了
```js
realese: function(){
    if(this.flist.length == 0) this.toop();
    this.flist.forEach((item) => {
        item.async("blob").then((content)=>{
                saveAs(content,item.name);
                this.delete(content);
            })
    })
    this.flist = [];
    this.$refs.load_3.clearFiles();
    this.$refs.load_4.clearFiles();
},
```
``toop()``是提示消息，不重要。

this.flist是放压缩内容的，forEach() == for()，``item.async("blob")``是对zipObject处理成blob数据，blob是二进制，zipObject是放在flist里的内容（不重要）``this.delete(content);``清除缓存

# End





