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
var headform='';

function table(str){	//传进来一个字符串
	this.factor=str.split(':')[0];		//因子	因素
	this.state=str.split(/[,:]/); 		//状态(水平) 这个正则表达式是抄的，还不懂为啥是这样
	this.state.splice(0,1);
}
function head(factor,state){
	this.factor=factor;	//匹配正交表水平数 数组
	this.state=state;	//匹配正交表因素数 数组
}

button.onclick=function(){
	//对全局变量重置，避免起到重复的错误
	table_son="";	//这个是要传出去的字符串，所以要给ta上个全局buff
	outexcel=[];	//同上
	obj=[];			//使用者的输入
	headform='';
	
	testcase.textContent="";
	form.textContent="";
	var example=text.value.split(/[(\r\n)\r\n]+/)
	for(var i=0;i<example.length;i++){
		obj[i]=new table(example[i]);
	}
	if(obj[0].factor.trim()==''&&obj[0].state.length==0) {alert("请输入数据");return ;}	//1 无输入
	var judges=1,judgef=1;	//判断水平，因素 加入了trim()之后不用在担心末尾的非法输入一定能删除末尾[不管你输入多少空格]
	obj.forEach((item,index) => { // 删除空项	success	forEach相当于for()遍历了一遍obj数组
		if(item.factor.trim()==''&&item.state.length==0)	//如果是回车加换行的话 ta的factor=='',state.length==0
		  obj.splice(index, 1);	//删除函数'1'是指要删除的个数，index是下标
		else if(item.state.length==0||item.state[0].trim()=='') judges=0;
		else if(item.factor.trim()==''&&item.state.length>0)	judgef=0;
	})
	if(judgef==0)	{alert("检查你的因素数输入");return ;}	//2 因素数输入非法
	if(judges==0)	{alert("请输入适当的水平数或检查水平是否有遗漏"); return ;}	//3 水平数输入非法
	//文件给的正交表中因子的位置与长度(水平长度)大小顺序相同,输入数据排个序,同时也是为了保证输出用例与状态的一致性
	obj.sort(function(a,b){
		if(a.state.length==0||b.state.length==0) judge=0;
		if(a.state.length<b.state.length) return -1;
		else if(a.state.length>b.state.length) return 1;
		else return 0;
	  })
	/*也可以这样写 obj.sort(function(a,b){return a.state.length-b.state.length;})*/
	var flag=[];	//水平数 数组
	obj.forEach((item,index)=>{
		flag.push(item.state.length);
	})
	var count=1;
	flag.sort();	//给索引排个序
	//var flagstr="";
	//var lineNumber=0;	//行数
	var row=[];	//因子个数 数组
	for(var i=0;i<flag.length;i++){
		if(flag[i]==0) continue;
		for(var j=i+1;j<flag.length;j++){
			if(flag[i]==flag[j]){
				count++;
				flag[j]=0;
			}
		}
		row.push(count);
		//第一种查表方法 部分
		/*
		if(flagstr.length==0)
				flagstr=flagstr+flag[i]+'^'+count;
		else flagstr=flagstr+' '+flag[i]+'^'+count;
		lineNumber=count*(flag[i]-1)+1+lineNumber;*/
		count=1;
	}
	for(var j=0;j<flag.length;j++){ //把flag里面等于0的都删了
		if(flag[j]==0){
		  flag.splice(j,1);
		  j-=1;}
	}
	//现在 flag+row => 2^3 3^1 => flag[0]^row[0] flag[1]^row[1]
	//第一种查表方法 部分
	/*flagstr=flagstr+'     '+'n='+lineNumber;
	console.log(flagstr);*/
	var test="";
	//看着很多，也就178个表
	fetch('./scripts/真的正交表.txt').then(function(response) {
  	response.text().then(function(text) {
		test = text;
		//第一种查表方法，无法判断混合正交表，只能找到表内的数据
		/*
		begin=text.indexOf(flagstr);
		if(begin==-1)	{alert("抱歉，没有找到对应的正交表，请修改数据或者重新输入");return ;}
		table_son=text.slice(begin+flagstr.length+2,begin+flagstr.length+2+lineNumber*(row+2));	//为什么换行符占了两个字节？*/
		//改良版，尽量做到能给每个测试用例找到用例
		var i=0;	//记录i的值
		console.time('testTime');
		while(i<test.length){
			if(test[i]=='^')	//定位表头
			{
				var factor=[],state=[],line=0;	//初始化
				//shift tab 整体左移
				while(test[i]!='\n'){	//小知识：文本在不同的浏览器中的换行是不一样的,chrome里的是\r\n mac里的是\n 所以这个代码应该只能在windows上用
					if(test[i]==' ') i++;
					else if(test[i]=='^'){
						var sign=1,tempfa='',tempst='',tempn='';
						while(test[i-sign]<='9'&&test[i-sign]>='0'){
							tempst=test[i-sign]+tempst;
							sign=sign+1;
						}
						i=i+1;
						while(test[i]<='9'&&test[i]>='0'){
							tempfa=tempfa+test[i];
							i=i+1;
						}
						factor.push(parseInt(tempfa));
						state.push(parseInt(tempst));
						}
					else if(test[i]=='n'){
						i=i+2;
						while(test[i]<='9'&&test[i]>='0'){
							tempn=tempn+test[i];
							i++;
						}
						line=parseInt(tempn);
					}
					else i++;
				}
				var factornum=0;	//计算出整个表的列数,由于有一些列是两位数水平数列,所以要特殊处理
				for(var m=0;m<factor.length;m++){
					if(state[m]>10) factornum+=2*factor[m];	//当state[m]>11时才需要两列表示 state[m]=11时0~9就可以表示
					else factornum+=factor[m];
				}
				//表头检索完毕，开始检测是否匹配[能运行到这里的情况应该不存在找不到的情况]
				if(state[state.length-1]<flag[flag.length-1]) 	;	//匹配正交表的最大水平数小于输入正交表的最大水平数的话
				else {
					var stateid=0;	//state的下标
					for(var j=0;j<flag.length;j++){		//这里原来是i值和总索引混了
					if(stateid>=factor.length) break;
					else if(flag[j]<=state[stateid]){
						num=factor[stateid]-row[j];
						if(num==0) stateid+=1;
						else if(num<0){
							stateid+=1;
							if(stateid==factor.length) break;	//此时正交表已经无法匹配输入数据
							num=factor[stateid]+num;}
					}
					else if(stateid<factor.length){stateid+=1;j-=1;num=0;}
					}
					if(j==flag.length) {
						console.log("success");
						table_son=text.slice(i+1,i+1+line*(factornum+2));
						console.log(table_son);
						headform=new head(factor,state);
						break;
					}
				}
				i=i+1+line*(factornum+2)+2*2	//2*2是因为每个正交表间 间隔两次换行 line*(factor+2)是正交表[我们只需要表头，就省略优化]，1是让下一个i值为下一个表头
			}
			else i++;
		}
		if(i==test.length) alert("抱歉，没有找到对应的正交表，请修改数据或者重新输入");
		console.timeEnd('testTime');
	  });
	});
}

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
			outdata=outdata+obj[j].state[parseInt(outexcel[i][j])]+' ';
		}
		outdata=outdata+'\n';
	}
	testcase.textContent=outdata;
	*/
	//table
	//打表的优化，最后的优化啦啦啦！！
	//由于会出现非标准正交表和两位数的水平数组 要进行分类讨论
	testcase.textContent="";	//对table进行清空
	var outdataTr=document.createElement("tr");	//行
	var outdataTh=document.createElement("th");	//列
	var signs=0,signf=0;	//用来判断当前列是否能表示输入数据列(匹配水平数<实际数 fail 匹配水平数>实际数 success)
	var fail=[]; //记录无效列
	var signo=0;	//记录实际列位置
	outdataTh.textContent="次数";	//制作表头
	outdataTr.appendChild(outdataTh);
	var factornum=headform.factor.reduce((a,b)=>a+b);
	for(var i=0;i<factornum;i++){
		outdataTh=document.createElement("th");
		if(signo==obj.length){		//实际列已经遍历完
			outdataTh.textContent="无";
			fail.push(i);
		}
		else if(headform.state[signs]<obj[signo].state.length){			//比如 2^2 3^2
			outdataTh.textContent="无";
			fail.push(i);
		}
		else {
			outdataTh.textContent=obj[signo].factor;
			signo+=1;
		}
		if(signf+1==headform.factor[signs]) {signs+=1;signf=0;}
		else signf+=1;	//signf用来记录不同水平数的因素数位置 比如2^1 3^4 如果现在i=0 则signf=0 1-0 2-1 3-2 4-3
		outdataTr.appendChild(outdataTh);
	}
	console.log(fail);
	testcase.appendChild(outdataTr);
	for(var i=0;i<outexcel.length;i++){					//行
		var outdataTr=document.createElement("tr");
		outdataTh=document.createElement("th");
		outdataTh.textContent=i+1;
		outdataTr.appendChild(outdataTh);	//记录行数
		/*
		for(var j=0;j<outexcel[i].length;j++){			//列
			var outdataTh=document.createElement("th");
			outdataTh.textContent=obj[j].state[parseInt(outexcel[i][j])];	//表格内容填充是用textContent,获取ta的内容是用value
			outdataTr.appendChild(outdataTh);
		}*/
		var factornum=headform.factor[0],index=0;
		signo=0;	//同上signo
		for(var j=0;j<outexcel[i].length;j++){			//列
			var outdataTh=document.createElement("th");
			//factornum[]是水平数组，state是因素数组
			if(j==factornum){
				factornum=0,index+=1;
				for(var k=0;k<index;k++) factornum=factornum+headform.factor[k];
			}
			if(signo==obj.length)	outdataTh.textContent="无";
			else if(headform.state[index]<=10){
				if(fail.includes(j)||parseInt(outexcel[i][j])>=obj[signo].state.length)	outdataTh.textContent="无";
				else {outdataTh.textContent=obj[signo].state[parseInt(outexcel[i][j])];signo+=1;}
			}
			else{
				if(fail.includes(j)||parseInt(outexcel[i][j])>=obj[signo].state.length)	{outdataTh.textContent="无";j+=1;}	//error: 进入双列判断后,不管是否赋值成功,j都应该+1
				else { outdataTh.textContent=obj[signo].state[parseInt(outexcel[i][j]+outexcel[i][j+1])];j+=1;signo+=1;}
			}
			outdataTr.appendChild(outdataTh);
		}
		testcase.appendChild(outdataTr);
	}
}

//2020/11/13 16:10 大体框架已经完成，开始准备软件测试
//2020/11/13 18:14 更新了表格实现，还没有开始软件测试
//2020/11/14 1:40 更新了控件样式，文件上传至github,但还是没有进行软件测试,预计快2~3天做完，慢则要1个星期
//2020/11/15 18:52 对混合正交表进行判断,尽可能的做到了可能的情况并有匹配的正交表,但对于混合正交表匹配后答案似乎还有不正确的比如 12^1 可以匹配到 2^12 12^1 但打表的时候应该是最后一列有数据,其他无所以还需要解决的问题是对于混合正交表列的匹配相等
//2020/11/15 22:06 完成了对混合正交表的实际列和匹配列的相符匹配
//2020/11/15 23:30 修正多次测验后结果出错的情况