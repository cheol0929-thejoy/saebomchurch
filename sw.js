/* 새봄교회 홈페이지 서비스 워커 — build_site.py 가 만든다(손으로 고치지 않는다). CEO 지시 2026-11-23 PWA (R1 수정 반영).
   판 번호 V = 사이트의 모든 파일(이 파일 제외) 내용의 해시 → 어떤 파일이든 바뀌면 V 가 바뀌고, 새 판이 켜질 때 옛 저장소(미리 저장분+쓰다가 저장한 것)를 통째로 지운다.
   HTML·CSS·JS·manifest = 네트워크 먼저(4초 안에 답이 없거나 오류 응답이면 저장본; 저장본이 없으면 오류 응답 그대로(404.html 등), 인터넷이 아예 안 될 때만 HTML 은 offline.html) ·
   그림·글꼴 = 저장본을 먼저 보여 주고 뒤에서 새로 받아 둔다 · 다른 주소(유튜브·지도 등)는 손대지 않는다. */
var V="saebom-site-2f3bdbfe34";
var PRE=["./", "index.html", "welcome.html", "about.html", "greeting.html", "worship.html", "sermons.html", "news.html", "jubo.html", "directions.html", "organization.html", "privacy.html", "terms.html", "legal.html", "en.html", "offline.html", "manifest.webmanifest", "assets/theme.css", "assets/fonts/fonts.css", "assets/mark.svg", "assets/pwa.js", "assets/og/home.jpg", "assets/icons/icon-192.png", "assets/icons/icon-512.png", "assets/icons/apple-touch-icon.png", "assets/icons/favicon-48.png", "assets/icons/favicon-32.png", "assets/icons/favicon-16.png", "assets/icons/icon.svg", "assets/photo/sanct-640.webp", "assets/photo/sanct-1024.webp", "assets/photo/sanct-1600.webp", "assets/photo/pastor-600.webp", "assets/photo/pastor-1200.webp", "assets/photo/pastorsq-400.webp", "assets/photo/pastorsq-800.webp", "assets/og/greeting.jpg", "assets/popup/popup.js", "assets/popup/gajeong-640.webp", "assets/popup/gajeong-1055.webp", "assets/apps/saebom-192.png", "assets/apps/achim-192.png"];
var WAIT=4000;
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(PRE.map(function(u){return new Request(u,{cache:"reload"});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V&&k.indexOf("saebom-site-")===0;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
function put(r,res){if(res&&res.ok&&res.type==="basic"){var c=res.clone();caches.open(V).then(function(ca){ca.put(r,c);});}}
function netFirst(r,html){var opt=html?{ignoreSearch:true}:undefined;
  return new Promise(function(done){var over=false,failed=null;
    function cached(net){return caches.match(r,opt).then(function(m){return m||(html&&net?caches.match("offline.html"):null);});}
    var t=setTimeout(function(){caches.match(r,opt).then(function(m){if(m&&!over){over=true;done(m);}});},WAIT);
    fetch(r).then(function(res){if(res.ok){put(r,res);if(!over){over=true;clearTimeout(t);done(res);}return;}failed=res;throw 0;})
      .catch(function(){clearTimeout(t);if(over)return;cached(!failed).then(function(m){if(over)return;over=true;done(m||failed||Response.error());});});});}
function cacheThenUpdate(r){return caches.match(r).then(function(m){var n=fetch(r).then(function(res){put(r,res);return res;});if(m){n.catch(function(){});return m;}return n;});}
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET")return;var u=new URL(r.url);if(u.origin!==self.location.origin)return;
  var html=r.mode==="navigate"||(r.headers.get("accept")||"").indexOf("text/html")>=0;
  if(html||/\.(css|js|webmanifest)$/.test(u.pathname)){e.respondWith(netFirst(r,html));return;}
  e.respondWith(cacheThenUpdate(r));});
