const messages=[
{id:1,from:"ДИСПЕТЧЕР",time:"20:56",date:"13.10.2056",text:"Абонент 56-17. Приём. Подтвердите, что устройство у вас.",unread:true},
{id:2,from:"ДИЛЬДО",time:"19:42",date:"13.10.2056",text:"Цель - связист. Молодой щуплый парнишка. Главное - устройство радиопередачи при нем. Оставить в живых. Узнать о \"Рубеже\".",unread:true},
{id:3,from:"СИСТЕМА",time:"03:17",date:"12.10.2056",text:"Регистрация в сети НСК завершена. Канал: 07. Идентификатор: N56-1704.",unread:false},
{id:4,from:"РУКОВОДСТВО",time:"08:00",date:"11.10.2056",text:"РУКОВОДСТВО ПОЛЬЗОВАТЕЛЯ\n\n▲ / ▼ — выбор пункта или сообщения.\n● — открыть выбранный пункт.\n↩ — вернуться назад.\n≡ — главное меню.\n\nЭкран не является сенсорным. Управление устройством осуществляется кнопками на корпусе.",unread:false}
];
const state={screen:"inbox",selected:0,current:null,sound:"ВИБРО",backlight:"АВТО"};
const display=document.querySelector("#display"),hint=document.querySelector("#hint"),clock=document.querySelector("#clock");
function esc(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function menuItems(){return ["СООБЩЕНИЯ","СЕТЬ: НСК-7","ЗВУК: "+state.sound,"ПОДСВЕТКА: "+state.backlight,"ОБ УСТРОЙСТВЕ"]}
function render(){
 const {screen,selected,current}=state;
 if(screen==="inbox"){
  display.innerHTML='<div class="title">СООБЩЕНИЯ</div><div class="counter">ПАМЯТЬ '+messages.length+'/24 · НОВЫХ '+messages.filter(m=>m.unread).length+'</div>'+messages.map((m,i)=>'<div class="message-row '+(i===selected?"selected":"")+'"><span class="unread">'+(m.unread?"◆":"·")+'</span><span class="from">'+esc(m.from)+'</span><span class="time">'+m.time+'</span></div>').join("");
  hint.textContent="▲▼ ВЫБОР · ● ОТКРЫТЬ · ≡ МЕНЮ";
 } else if(screen==="message"){
  const m=messages[current]; display.innerHTML='<div class="title">'+esc(m.from)+'</div><div class="message-view"><div class="meta">'+m.date+' // '+m.time+' // MSG '+String(m.id).padStart(3,"0")+'</div><p>'+esc(m.text)+'</p></div>'; hint.textContent="↩ НАЗАД · ▲▼ ПРОКРУТКА";
 } else if(screen==="menu"){
  display.innerHTML='<div class="title">ГЛАВНОЕ МЕНЮ</div>'+menuItems().map((x,i)=>'<div class="menu-row '+(i===selected?"selected":"")+'">'+x+'</div>').join(""); hint.textContent="▲▼ ВЫБОР · ● ОК · ↩ НАЗАД";
 } else if(screen==="network"){
  display.innerHTML='<div class="title">СЕТЬ</div><div class="info-screen">СЕТЬ: НСК-7<br>СТАТУС: В СЕТИ<br>КАНАЛ: 07<br>СИГНАЛ: СТАБИЛЬНЫЙ<br><br>ID: N56-1704</div>'; hint.textContent="↩ НАЗАД";
 } else if(screen==="about"){
  display.innerHTML='<div class="title">ОБ УСТРОЙСТВЕ</div><div class="info-screen">СИБСВЯЗЬ<br>НСК-2056<br><br>ALPHANUMERIC RECEIVER<br>МОДЕЛЬ: N-56<br>ПАМЯТЬ: 24 MSG<br>ПРОШИВКА: 5.6.13</div>'; hint.textContent="↩ НАЗАД";
 }
 display.querySelector(".selected")?.scrollIntoView({block:"nearest"});
}
function goMenu(){state.screen="menu";state.selected=0;render()}
function action(a){
 if(state.screen==="message"&&(a==="up"||a==="down")){display.scrollBy({top:a==="up"?-70:70,behavior:"smooth"});return}
 if(state.screen==="inbox"){
  if(a==="up")state.selected=Math.max(0,state.selected-1);
  if(a==="down")state.selected=Math.min(messages.length-1,state.selected+1);
  if(a==="select"){state.current=state.selected;messages[state.current].unread=false;state.screen="message"}
  if(a==="menu")goMenu();
 } else if(state.screen==="message"){
  if(a==="back"){state.screen="inbox";state.selected=state.current??0}
  if(a==="menu")goMenu();
 } else if(state.screen==="menu"){
  if(a==="up")state.selected=Math.max(0,state.selected-1);
  if(a==="down")state.selected=Math.min(4,state.selected+1);
  if(a==="back"){state.screen="inbox";state.selected=0}
  if(a==="select"){
   if(state.selected===0){state.screen="inbox";state.selected=0}
   else if(state.selected===1){state.screen="network"}
   else if(state.selected===2){state.sound=state.sound==="ВИБРО"?"ЗВУК":state.sound==="ЗВУК"?"БЕЗ ЗВУКА":"ВИБРО"}
   else if(state.selected===3){state.backlight=state.backlight==="АВТО"?"ВКЛ":state.backlight==="ВКЛ"?"ВЫКЛ":"АВТО";document.querySelector(".screen").classList.toggle("light-off",state.backlight==="ВЫКЛ")}
   else if(state.selected===4){state.screen="about"}
  }
 } else {
  if(a==="back"||a==="menu")goMenu();
 }
 render();
}
document.querySelectorAll("button[data-action]").forEach(b=>b.addEventListener("click",()=>action(b.dataset.action)));
function tick(){const d=new Date();clock.textContent=d.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})}tick();setInterval(tick,30000);render();