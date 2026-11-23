/* 새봄교회 홈페이지 앱 설치 (PWA) — CEO 지시 2026-11-23 「홈페이지 앱을 만들어라」. 아침한권·새봄묵상 설치 방식 그대로.
   서비스 워커 등록(같은 주소 안 sw.js) · 안드로이드/PC 크롬 = 설치 창(beforeinstallprompt) · 아이폰/아이패드 사파리 = 글 안내 · 사파리가 아닌 iOS 브라우저 = 「Safari로 열기」 안내 ·
   안드로이드 앱 안 브라우저(카카오톡·네이버·인스타그램 등) = 「다른 브라우저로 열기」 안내.
   이미 앱으로 열렸으면(standalone) 「앱으로 설치」 단추만 숨기고, 설명 글은 짧은 글(data-t="app")로 바꿔 계속 보인다(오너 AMENDMENT 3).
   「맨 위로」 단추(data-top): 600px 넘게 내려가면 보이고, 누르면 맨 위로 부드럽게 올라간다(움직임 줄이기 설정이면 바로).
   저장소·쿠키·외부 주소를 쓰지 않는다. audit_site.py 가 이 파일의 sha256 을 고정해 확인한다. */
(function(){
  var nav=window.navigator,UA=nav.userAgent;
  var IOS=/iPad|iPhone|iPod/.test(UA)||(nav.platform==="MacIntel"&&nav.maxTouchPoints>1);
  var IPAD=IOS&&(/iPad/.test(UA)||(nav.platform==="MacIntel"&&nav.maxTouchPoints>1));
  var INAPP=/KAKAOTALK|NAVER|Instagram|FBAN|FBAV|FB_IAB|Line\/|DaumApps|DaumDevice|; wv\)/.test(UA);
  var NOTSAFARI=IOS&&(INAPP||/CriOS|FxiOS|EdgiOS|OPiOS|Whale/.test(UA)||!/Safari\//.test(UA));
  var DEFER=null,INSTALLED=false;
  function standalone(){return (window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||nav.standalone===true;}
  function which(){return NOTSAFARI?"notsafari":IPAD?"ipad":IOS?"iphone":INAPP?"inapp":"other";}
  function ui(){var done=standalone()||INSTALLED;
    document.querySelectorAll("[data-t]").forEach(function(t){t.hidden=(t.getAttribute("data-t")==="app")!==done;});
    document.querySelectorAll("[data-pwa]").forEach(function(box){if(done)delete box.dataset.open;
      var b=box.querySelector(".pwa-btn");if(b){b.hidden=done;b.setAttribute("aria-expanded",String(!!box.dataset.open));}
      box.querySelectorAll("[data-g]").forEach(function(g){g.hidden=!(box.dataset.open&&g.getAttribute("data-g")===which());});});}
  window.addEventListener("beforeinstallprompt",function(ev){ev.preventDefault();DEFER=ev;ui();});
  window.addEventListener("appinstalled",function(){INSTALLED=true;DEFER=null;ui();});
  document.addEventListener("click",function(ev){var b=ev.target.closest&&ev.target.closest(".pwa-btn");if(!b)return;var box=b.closest("[data-pwa]");
    if(DEFER){var e=DEFER;DEFER=null;e.prompt();if(e.userChoice)e.userChoice.then(function(c){if(c&&c.outcome==="accepted"){INSTALLED=true;}ui();});return;}
    if(box.dataset.open)delete box.dataset.open;else box.dataset.open="1";ui();});
  if("serviceWorker" in nav){window.addEventListener("load",function(){nav.serviceWorker.register("sw.js").catch(function(){});});}
  ui();
  var top=document.querySelector("[data-top]");
  if(top){var sc=function(){top.hidden=(window.pageYOffset||document.documentElement.scrollTop||0)<600;};
    window.addEventListener("scroll",sc,{passive:true});sc();
    top.addEventListener("click",function(){var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({top:0,behavior:rm?"auto":"smooth"});var h=document.querySelector(".brand");if(h)h.focus({preventScroll:true});});}
})();
