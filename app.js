const messages=[
{id:1,from:"ДИСПЕТЧЕР",time:"20:56",date:"13.10.2056",text:"Абонент 56-17. Приём. Подтвердите, что устройство у вас.",unread:true},
{id:2,from:"ДИЛЬДО",time:"19:42",date:"13.10.2056",text:"Цель - связист. Молодой щуплый парнишка. Главное - устройство радиопередачи при нем. Оставить в живых. Узнать о \"Рубеже\".",unread:true},
{id:3,from:"СИСТЕМА",time:"03:17",date:"12.10.2056",text:"Регистрация в сети НСК завершена. Канал: 07. Идентификатор: N56-1704.",unread:false},
{id:4,from:"РУКОВОДСТВО",time:"08:00",date:"11.10.2056",text:"РУКОВОДСТВО ПОЛЬЗОВАТЕЛЯ\n\n▲ / ▼ — выбор пункта или сообщения.\n● — открыть выбранный пункт.\n↩ — вернуться назад.\n≡ — главное меню.\n\nЭкран не является сенсорным. Управление устройством осуществляется кнопками на корпусе.",unread:false}
];
let screen="inbox",selected=0,current=null;
const display=document.querySelector("#display"),hint=document.querySelector("#hint"),clock=document.querySelector("#clock");
function esc(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function render(){
 if(screen==="inbox"){display.innerHTML='<div class="title">СООБЩЕНИЯ</div><div class="counter">ПАМЯТЬ '+messages.length+'/24 · НОВЫХ '+messages.filter(m=>m.unread).length+'</div>'+messages.map((m,i)=>'<div class="message-row '+(i===selected?"selected":"")+'"><span class="unread">'+(m.unread?"◆":"·")+'</span><span class="from">'+esc(m.from)+'</span><span class="time">'+m.time+'</span></div>').join("");hint.textContent="▲▼ ВЫБОР · ● ОТКРЫТЬ · ≡ МЕНЮ"}
 else if(screen==="message"){const m=messages[current];display.innerHTML='<div class="title">'+esc(m.from)+'</div><div class="message-view"><div class="meta">'+m.date+' // '+m.time+' // MSG '+String(m.id).padStart(3,"0")+'</div><p>'+esc(m.text)+'</p></div>';hint.textContent="↩ НАЗАД · ▲▼ ПРОКРУТКА"}
 else{const items=["СООБЩЕНИЯ","СЕТЬ: НСК-7","ЗВУК: ВИБРО","ПОДСВЕТКА: АВТО","ОБ УСТРОЙСТВЕ"];display.innerHTML='<div class="title">ГЛАВНОЕ МЕНЮ</div>'+items.map((x,i)=>'<div class="menu-row '+(i===selected?"selected":"")+'">'+x+'</div>').join("");hint.textContent="▲▼ ВЫБОР · ● ОК · ↩ НАЗАД"}
 display.querySelector(".selected")?.scrollIntoView({block:"nearest"});
}
function action(a){
 if(screen==="message"&&(a==="up"||a==="down")){display.scrollBy({top:a==="up"?-70:70,behavior:"smooth"});return}
 const max=screen==="inbox"?messages.length-1:4;
 if(a==="up"){selected=Math.max(0,selected-1)}
 if(a==="down"){selected=Math.min(max,selected+1)}
 if(a==="back"){if(screen!=="inbox"){screen="inbox";selected=current??0}}
 if(a==="menu"){screen="menu";selected=0}
 if(a==="select"){
  if(screen==="inbox"){current=selected;messages[current].unread=false;screen="message"}
  else if(screen==="menu"&&selected===0){screen="inbox";selected=0}
 }
 render()
}
document.querySelectorAll("button[data-action]").forEach(b=>b.addEventListener("click",()=>action(b.dataset.action)));
function tick(){const d=new Date();clock.textContent=d.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})} tick();setInterval(tick,30000);render();