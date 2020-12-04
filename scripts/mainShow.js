var entry=document.getElementById('yes');
var cleartext=document.getElementById('cleartext')
var text=document.querySelector('textarea');
var doing=document.getElementById('doing');
var form=document.getElementById('product');
var testcase=document.getElementById('testcase');
var done=document.getElementById('done');

$(function() {
    $('.instructions-button').click(function() {
		$('.test').toggle();
	});
});

var table_son="";
var outexcel=[];
var obj=[];
var headform='';

var test="";
fetch('./scripts/真的正交表.txt').then(function(response) {
	response.text().then(function(txt) {
		new jBox('Notice',{color: 'green',content: '资源加载完毕',closeButton: true});
	  test = txt;})
	});

tabB();

function table(str){
	this.factor=str.split(/[:;\|\\；：]/)[0];
	this.state=str.split(/[,，、:;\|\\；：]/);
	this.state.splice(0,1);
}
function head(factor,state){
	this.factor=factor;	
	this.state=state;
}

function init(){
	table_son="";
	outexcel=[];
	obj=[];
	headform='';
	testcase.textContent="";
	form.textContent="";
	tabB();
}

cleartext.onclick=function(){
	init();
	text.value='';
}

entry.onclick = function(){
	init();
	var example=text.value.split(/[(\r\n)\r\n]+/)
	for(var i=0;i<example.length;i++){
		obj[i]=new table(example[i]);
	}
	if(obj[0].factor.trim()==''&&obj[0].state.length==0) { new jBox('Notice',{color: 'red',content: '请输入数据',closeButton: true});return ;}
	var judges=1,judgef=1;
	obj.forEach((item,index) => {
		if(item.factor.trim()==''&&item.state.length==0)
		  obj.splice(index, 1);
		else if(item.state.length==0||item.state[0].trim()=='') judges=0;
		else if(item.factor.trim()==''&&item.state.length>0)	judgef=0;
	})
	if(judgef==0)	{new jBox('Notice',{color: 'blue',content: '检查你的因素数输入',closeButton: true});return ;}
	if(judges==0)	{new jBox('Notice',{color: 'blue',content: '请输入适当的水平数或检查水平是否有遗漏',closeButton: true}); return ;}
	obj.sort(function(a,b){
		if(a.state.length==0||b.state.length==0) judge=0;
		if(a.state.length<b.state.length) return -1;
		else if(a.state.length>b.state.length) return 1;
		else return 0;
	  })
	var flag=[];
	obj.forEach((item,index)=>{
		flag.push(item.state.length);
	})
	var count=1;
	flag.sort();
	var row=[];
	for(var i=0;i<flag.length;i++){
		if(flag[i]==0) continue;
		for(var j=i+1;j<flag.length;j++){
			if(flag[i]==flag[j]){
				count++;
				flag[j]=0;
			}
		}
		row.push(count);
		count=1;
	}
	for(var j=0;j<flag.length;j++){
		if(flag[j]==0){
		  flag.splice(j,1);
		  j-=1;}
	}
	var i=0;
	while(i<test.length){
		if(test[i]=='^')
		{
			var factor=[],state=[],line=0;
			while(test[i]!='\n'){
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
			var factornum=0;	
			for(var m=0;m<factor.length;m++){
				if(state[m]>10) factornum+=2*factor[m];
				else factornum+=factor[m];
			}
			if(state[state.length-1]<flag[flag.length-1]) 	;
			else {
				var factorid=0,factorIng=factor[factorid],num=0;
				for(var j=0;j<flag.length;j++){			
					if(factorid>=factor.length) break;   	
					else if(flag[j]<=state[factorid]){		
						num=factorIng-row[j];
						if(num==0) { factorid += 1;factorIng = factor[factorid]}
						else if(num>0)
							factorIng=num;
						else {	
							factorid += 1;
							factorIng=factor[factorid]+factorIng;
							j-=1;
						}
					}
					else {factorid+=1;factorIng=factor[factorid];j-=1;num=0;}
				}
				if(j==flag.length) {
					console.log("success");
					table_son=test.slice(i+1,i+1+line*(factornum+2));
					console.log(table_son);
					headform=new head(factor,state);
					break;
				}
			}
			i=i+1+line*(factornum+2)+2*2;
		}
		else i++;
	}
	if(i>test.length) new jBox('Notice',{color: 'red',content: '抱歉，没有找到对应的正交表，请修改数据或者重新输入',closeButton: true});
};

function createTable(){
	var testexcel=table_son.split(/[(\r\n)\r\n]+/);
	testexcel.forEach((item,index) => {
		if(!item)
		  testexcel.splice(index, 1);
	})
	outexcel=testexcel;
}

doing.onclick=function(){
	form.textContent=table_son;
};

done.onclick=function(){
	createTable();
	if(!outexcel) alert("请输入你的测试用例");
	testcase.textContent="";
	var outdataTr=document.createElement("tr");	
	var outdataTh=document.createElement("th");	
	var signs=0,signf=0;
	var fail=[];
	var signo=0;
	outdataTh.textContent="次数";
	outdataTr.appendChild(outdataTh);
	var factornum=headform.factor.reduce((a,b)=>a+b);
	for(var i=0;i<factornum;i++){
		outdataTh=document.createElement("th");
		if(signo==obj.length){
			outdataTh.textContent="无";
			fail.push(i);
		}
		else if(headform.state[signs]<obj[signo].state.length){
			outdataTh.textContent="无";
			fail.push(i);
		}
		else {
			outdataTh.textContent=obj[signo].factor;
			signo+=1;
		}
		if(signf+1==headform.factor[signs]) {signs+=1;signf=0;}
		else signf+=1;
		outdataTr.appendChild(outdataTh);
	}
	console.log(fail);
	testcase.appendChild(outdataTr);
	for(var i=0;i<outexcel.length;i++){				
		var outdataTr=document.createElement("tr");
		outdataTh=document.createElement("th");
		outdataTh.textContent=i+1;
		outdataTr.appendChild(outdataTh);
		var factornum=headform.factor[0],index=0;
		signo=0;
		for(var j=0;j<outexcel[i].length;j++){
			var outdataTh=document.createElement("th");
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
				if(fail.includes(j)||parseInt(outexcel[i][j])>=obj[signo].state.length)	{outdataTh.textContent="无";j+=1;}
				else { outdataTh.textContent=obj[signo].state[parseInt(outexcel[i][j]+outexcel[i][j+1])];j+=1;signo+=1;}
			}
			outdataTr.appendChild(outdataTh);
		}
		testcase.appendChild(outdataTr);
	}
};

function tabB(){
	testcase.textContent='';
	for(var i=0;i<2;i++){
		var outdataTr=document.createElement("tr");
		for(var j=0;j<4;j++){
			var outdataTh=document.createElement("th");
			outdataTh.textContent = "________";
			outdataTr.appendChild(outdataTh);
		}
		testcase.appendChild(outdataTr);
	}
};

$('.download').on('click', function () {
	var wb = XLSX.utils.table_to_book(testcase);
	XLSX.writeFile(wb, "好家伙好家伙"+".csv");
});