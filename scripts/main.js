//const example= document.getElementById('example');
const button=document.getElementById('yes');
var text=document.querySelector('textarea');
var doing=document.getElementById('doing');
var form=document.getElementById('product');
var testcase=document.getElementById('testcase');	//貌似关键字冲突,话说js有case关键字吗？
var done=document.getElementById('done');

var table_son="";	//这个是要传出去的字符串，所以要给ta上个全局buff
var outexcel=[];	//同上
var obj=[];			//使用者的输入

function table(str){	//传进来一个字符串
	this.factor=str.split(':')[0];		//因子	因素
	this.state=str.split(/[,:]/); 		//状态(水平) 这个正则表达式是抄的，还不懂为啥是这样
	this.state.splice(0,1);
}

button.onclick=function(){
	//alert(text.value);
	var example=text.value.split(/[(\r\n)\r\n]+/)
	for(var i=0;i<example.length;i++){
		obj[i]=new table(example[i]);
	}
	obj.forEach((item,index) => { // 删除空项	success	forEach相当于for()遍历了一遍obj数组
		if(!item.factor)
		  obj.splice(index, 1);	//删除函数 '1'是指要删除的个数，index是下标
	})
	var flag=[];	//存放索引
	obj.forEach((item,index)=>{
		flag.push(item.state.length);
	})
	var count=1;
	var flagstr="";
	flag.sort();	//给索引排个序
	var lineNumber=0;	//行数
	var row=0;
	for(var i=0;i<flag.length;i++){
		if(flag[i]==0) continue;
		for(var j=i+1;j<flag.length;j++){
			if(flag[i]==flag[j]){
				count++;
				flag[j]=0;
			}
		}
		row=row+count;
		if(flagstr.length==0)
				flagstr=flagstr+flag[i]+'^'+count;
		else flagstr=flagstr+' '+flag[i]+'^'+count;
		lineNumber=count*(flag[i]-1)+1+lineNumber;
		count=1;
	}
	flagstr=flagstr+'     '+'n='+lineNumber;
	console.log(flagstr);
	var test="";
	fetch('./scripts/真的正交表.txt').then(function(response) {
  	response.text().then(function(text) {
		test = text;
		begin=text.indexOf(flagstr);
		table_son=text.slice(begin+flagstr.length+2,begin+flagstr.length+2+lineNumber*(row+2));	//为什么换行符占了两个字节？
	  });
	});
}
/*
function excel(data){
	this.row=[];
	for(var i=0;i<data.length;i++){
		if(data[i]=='\n'||data[i]!='\r') continue;
		this.row.push(data[i]);
		
	}
}*/
doing.onclick=function(){
	form.textContent=table_son;
	var testexcel=table_son.split(/[(\r\n)\r\n]+/);
	testexcel.forEach((item,index) => {
		if(!item)
		  testexcel.splice(index, 1);
	})
	outexcel=testexcel;
}

done.onclick=function(){
	if(!outexcel) alert("请输入你的测试用例");
	//先以字符串形式实现
	/*
	var outdata=""; 
	for(var i=0;i<outexcel.length;i++){					//行
		for(var j=0;j<outexcel[i].length;j++){			//列
			outdata=outdata+obj[j].state[parseInt(outexcel[i][j])]+' ';	//没有输出,就先这样吧
		}
		outdata=outdata+'\n';
	}
	testcase.textContent=outdata;
	*/
	//table
	//var outdata=document.createElement("table");
	var outdataTr=document.createElement("tr");	//行
	var outdataTh=document.createElement("th");	//列
	for(var i=0;i<outexcel.length;i++){					//行
		var outdataTr=document.createElement("tr");
		for(var j=0;j<outexcel[i].length;j++){			//列
			var outdataTh=document.createElement("th");
			outdataTh.textContent=obj[j].state[parseInt(outexcel[i][j])];	//表格内容填充是用textContent,获取ta的内容是用value
			outdataTr.appendChild(outdataTh);
		}
		testcase.appendChild(outdataTr);
	}
}

//2020/11/13 16:10 大体框架已经完成，开始准备软件测试
//2020/11/13 18:14 更新了表格实现，还没有开始软件测试