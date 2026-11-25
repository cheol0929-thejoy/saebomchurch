/* 새봄교회 홈페이지 첫 화면 알림(팝업) — 오너 지시 2026-11-26 AMENDMENT 4 「첫 화면에 팝업 띄워라」. index.html 에서만 불러온다.
   #pop 의 data-until(YYYY-MM-DD, 한국 시각) 날짜까지만 보인다 — 지나면 코드는 남아도 띄우지 않는다.
   첫 화면에 글·그림이 처음 그려진 뒤(first-contentful-paint, 지원하지 않는 브라우저는 load)에, 단추 글자에 필요한 글꼴을 먼저 받아 두고(최대 1.5초) 연다 ·
   화면 위에 덮는 고정 상자라 본문이 밀리지 않고, 포스터 크기는 화면 크기로 미리 정해져 그림이 늦게 와도 상자가 커지지 않는다.
   「오늘 하루 보지 않기」 = 이 기기 브라우저 저장소(localStorage)에 오늘 날짜 한 줄만 적는다(기기 밖으로 보내지 않는다, 저장소가 막혀 있으면 그냥 닫기만 한다).
   닫기: 「닫기」 단추 · ESC · 바깥 어두운 곳 누르기. 열려 있는 동안 Tab 은 알림 안에서만 돌고, 닫으면 열기 전 자리로 초점을 돌려준다
   (열기 전에 아무 데도 초점이 없었으면 쪽의 맨 처음 — 다음 Tab 은 「본문으로 건너뛰기」부터).
   열려 있는 동안 뒤 화면은 스크롤되지 않는다(html.pop-open — 사라진 스크롤 막대 폭만큼 오른쪽 여백을 주어 옆으로 밀리지 않는다), 닫으면 되돌린다.
   네트워크·쿠키·외부 주소를 쓰지 않는다. audit_site.py 가 이 파일의 sha256 을 고정해 확인한다. */
(function(){
  var p=document.getElementById("pop");if(!p)return;
  var KEY="saebom-popup-hide",box=p.querySelector(".pop-box"),last=null;
  function two(n){return(n<10?"0":"")+n;}
  var k=new Date(Date.now()+324e5),today=k.getUTCFullYear()+"-"+two(k.getUTCMonth()+1)+"-"+two(k.getUTCDate());
  var until=p.getAttribute("data-until")||"";
  if(!/^\d{4}-\d{2}-\d{2}$/.test(until)||today>until)return;
  try{if(window.localStorage.getItem(KEY)===today)return;}catch(e){}
  function items(){return Array.prototype.filter.call(box.querySelectorAll("a[href],button"),function(x){return !x.disabled&&x.getClientRects().length>0;});}
  function key(e){
    if(e.key==="Escape"||e.key==="Esc"){e.preventDefault();close();return;}
    if(e.key!=="Tab")return;
    var f=items();if(!f.length)return;
    var a=f[0],z=f[f.length-1],c=document.activeElement,inside=box.contains(c);
    if(e.shiftKey){if(c===a||!inside){e.preventDefault();z.focus();}}
    else if(c===z||!inside){e.preventDefault();a.focus();}
  }
  function close(){
    if(p.hidden)return;
    var de=document.documentElement;p.hidden=true;de.classList.remove("pop-open");de.style.paddingRight="";document.removeEventListener("keydown",key,true);
    if(last&&last!==document.body&&typeof last.focus==="function"&&document.documentElement.contains(last)){last.focus({preventScroll:true});return;}
    var b=document.body;b.setAttribute("tabindex","-1");b.focus({preventScroll:true});b.removeAttribute("tabindex");
  }
  function open(){
    var de=document.documentElement,cw=de.clientWidth;last=document.activeElement;de.classList.add("pop-open");
    var gap=de.clientWidth-cw;if(gap>0)de.style.paddingRight=gap+"px";
    p.hidden=false;document.addEventListener("keydown",key,true);
    var x=p.querySelector("[data-pop-close]");if(x)x.focus({preventScroll:true});
  }
  p.addEventListener("click",function(e){if(e.target===p)close();});
  p.querySelector("[data-pop-close]").addEventListener("click",close);
  p.querySelector("[data-pop-today]").addEventListener("click",function(){try{window.localStorage.setItem(KEY,today);}catch(e){}close();});
  var started=false;
  function show(){requestAnimationFrame(function(){requestAnimationFrame(open);});}
  function go(){
    if(started)return;started=true;
    var f=document.fonts,t=p.querySelector(".pop-bar"),done=false;
    function fin(){if(done)return;done=true;show();}
    setTimeout(fin,1500);
    try{var s=getComputedStyle(t.querySelector("button"));f.load(s.fontWeight+" "+s.fontSize+" "+s.fontFamily,t.textContent).then(fin,fin);}catch(e){fin();}
  }
  var types=(window.PerformanceObserver&&PerformanceObserver.supportedEntryTypes)||[];
  if(types.indexOf("paint")>=0){
    try{var po=new PerformanceObserver(function(l){if(l.getEntriesByName("first-contentful-paint").length){po.disconnect();go();}});po.observe({type:"paint",buffered:true});}catch(e){}
    window.addEventListener("load",function(){setTimeout(go,500);});  /* safety net: a page without contentful paint entry still opens */
  }else if(document.readyState==="complete")go();else window.addEventListener("load",go);
})();
