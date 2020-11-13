const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

function randomValueFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random]; 
}
let storyText="不好了!:insertb:，敌人快要打进来了！\n什么!快去请:inserta:!\n:insertb:,我有办法！\n混账！敌人即将进攻家族，我和:inserta:正在商量防御大计，哪有你李雷说话的份！没用的东西！\n废物就是废物，当初要不是看在你家族的份上，才给了你栖身之地，没想到现在竟然如此大言不惭！\n:inserta:手眼通天，运筹帷幄，他已经被:insertc:选中，我们family家族将晋升为四大家族，李雷还不给:inserta:下跪道歉！\n报！:insertd:来了！\n:insertd:?有失远迎!   \n(:insertd:看向李雷)什么？！是:insertc:！:insertd:参拜:insertc:！\n:insertd:您是不是看错了，他只是我们家族一个废物。\n大胆！敢问:insertc:，family家族如何处置！";
let insertX=['王公子','李公子','赵公子'];
let insertY=['老太君','大长老','老家主'];
let insertZ=['龙王','修罗','战神'];
let insertu=['太上天尊','深渊之主','修罗管家'];
let family=['傲氏','叶氏','萧氏'];
randomize.addEventListener('click', result);

function result() {

let xItem,yItem,zItem,uItem,familyName,name;
let newStory = storyText;
xItem=randomValueFromArray(insertX);
yItem=randomValueFromArray(insertY);
zItem=randomValueFromArray(insertZ);
uItem=randomValueFromArray(insertu);
familyName=randomValueFromArray(family);
  newStory=newStory.replace(/family/g,familyName);
  newStory=newStory.replace(/:inserta:/g,xItem);
  newStory=newStory.replace(/:insertb:/g,yItem);
  newStory=newStory.replace(/:insertc:/g,zItem);
  newStory=newStory.replace(/:insertd:/g,uItem);
	
  if(customName.value !== '') {
    let name = customName.value;
	newStory = newStory.replace(/李雷/g, name);
  }

  if(document.getElementById("ancient").checked) {
	newStory=newStory.replace('敌人快要打进来了','陈氏要收购整个集团');
	newStory=newStory.replace(/公子/g,'少');
	newStory=newStory.replace(/家族/g,'集团');
  }

  story.textContent = newStory;
  story.style.visibility = 'visible';
}
