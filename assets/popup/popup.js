/* 새봄교회 홈페이지 첫 화면 알림 카드 — 오너 지시 2026-11-26 AMENDMENT 4 + 홈릴리스2(「팝업이 너무 크다」 → 작은 떠 있는 카드). index.html 에서만 불러온다.
   #pop 의 data-until(YYYY-MM-DD, 한국 시각) 날짜까지만 보인다 — 지나면 코드는 남아도 띄우지 않는다.
   첫 화면에 글·그림이 처음 그려진 뒤(first-contentful-paint, 지원하지 않는 브라우저는 load)에, 단추 글자에 필요한 글꼴을 먼저 받아 두고(최대 1.5초) 연다.
   화면 위에 떠 있는 고정 카드라 본문이 밀리지 않고, 뒤 화면은 그대로 쓸 수 있다(가림막·스크롤 막기·초점 가두기 없음). 카드는 본문 맨 앞이라 Tab 으로 바로 갈 수 있다.
   「오늘 하루 보지 않기」 = 이 기기 브라우저 저장소(localStorage)에 오늘 날짜 한 줄만 적는다(기기 밖으로 보내지 않는다, 저장소가 막혀 있으면 그냥 닫기만 한다).
   닫기: ✕(이름 「닫기」) · ESC. 카드 안에 초점이 있을 때 닫으면 초점을 본문 맨 앞으로 옮긴다.
   네트워크·쿠키·외부 주소를 쓰지 않는다. audit_site.py 가 이 파일의 sha256 을 고정해 확인한다. */
(function(){
  var p=document.getElementById("pop");if(!p)return;
  var KEY="saebom-popup-hide";
  function two(n){return(n<10?"0":"")+n;}
  var k=new Date(Date.now()+324e5),today=k.getUTCFullYear()+"-"+two(k.getUTCMonth()+1)+"-"+two(k.getUTCDate());
  var until=p.getAttribute("data-until")||"";
  if(!/^\d{4}-\d{2}-\d{2}$/.test(until)||today>until)return;
  try{if(window.localStorage.getItem(KEY)===today)return;}catch(e){}
  function key(e){if(e.key==="Escape"||e.key==="Esc"){close();}}
  function close(){
    if(p.hidden)return;
    var had=p.contains(document.activeElement);
    p.hidden=true;document.removeEventListener("keydown",key);
    if(had){var m=document.getElementById("main")||document.body;m.setAttribute("tabindex","-1");m.focus({preventScroll:true});m.removeAttribute("tabindex");}
  }
  function place(){var h=document.querySelector(".hd");if(h)p.style.setProperty("--pop-top",Math.max(0,Math.round(h.getBoundingClientRect().bottom))+12+"px");}
  function open(){place();p.hidden=false;document.addEventListener("keydown",key);}
  p.querySelector("[data-pop-close]").addEventListener("click",close);
  p.querySelector("[data-pop-today]").addEventListener("click",function(){try{window.localStorage.setItem(KEY,today);}catch(e){}close();});
  var started=false;
  function show(){requestAnimationFrame(function(){requestAnimationFrame(open);});}
  function go(){
    if(started)return;started=true;
    var f=document.fonts,t=p.querySelector(".pop-today"),done=false;
    function fin(){if(done)return;done=true;show();}
    setTimeout(fin,1500);
    try{var s=getComputedStyle(t);f.load(s.fontWeight+" "+s.fontSize+" "+s.fontFamily,t.textContent).then(fin,fin);}catch(e){fin();}
  }
  var types=(window.PerformanceObserver&&PerformanceObserver.supportedEntryTypes)||[];
  if(types.indexOf("paint")>=0){
    try{var po=new PerformanceObserver(function(l){if(l.getEntriesByName("first-contentful-paint").length){po.disconnect();go();}});po.observe({type:"paint",buffered:true});}catch(e){}
    window.addEventListener("load",function(){setTimeout(go,500);});  /* safety net: a page without contentful paint entry still opens */
  }else if(document.readyState==="complete")go();else window.addEventListener("load",go);
})();
