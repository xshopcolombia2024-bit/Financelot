(function(){
const C=window.APP_CONFIG,nat=!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform()),droid=/android/i.test(navigator.userAgent);
let user=null,db=null,au=null,offer=null,done=null,tm,pro=false;
try{pro=localStorage.getItem('fp')==='1'}catch(e){}
const P=()=>window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.Purchases;
window.isPro=()=>pro||!!C.devUnlock;
const ov=document.createElement('div');
ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;padding:16px;z-index:9';
document.body.appendChild(ov);
const show=h=>{ov.innerHTML='<div class="card" style="max-width:420px;width:100%;max-height:90%;overflow:auto;margin:0">'+h+'</div>';ov.style.display='flex'};
window.closeOv=()=>{ov.style.display='none'};
const CB='<button class="btn s" onclick="closeOv()">Cerrar</button>';
const load=src=>new Promise((r,j)=>{const s=document.createElement('script');s.src=src;s.onload=r;s.onerror=j;document.head.appendChild(s)});
const setPro=v=>{pro=!!v;try{localStorage.setItem('fp',pro?'1':'0')}catch(e){}};
const setInfo=x=>{const i=(x&&x.customerInfo)||x;setPro(i&&i.entitlements&&i.entitlements.active&&i.entitlements.active[C.rc.entitlement])};
function refresh(){if(!isPro()){if(S.m==='e')S.m='p';if(S.tab==='g'||S.tab==='v')S.tab='r'}R()}
const em=e=>({'auth/invalid-credential':'Correo o contraseña incorrectos.','auth/wrong-password':'Correo o contraseña incorrectos.','auth/user-not-found':'Correo o contraseña incorrectos.','auth/email-already-in-use':'Ese correo ya tiene cuenta. Entra con tu contraseña.','auth/weak-password':'La contraseña debe tener mínimo 6 caracteres.','auth/invalid-email':'Escribe un correo válido.'}[e.code]||(e.message==='cfg'?'Falta configurar Firebase en config.js.':'No pudimos completar la acción. Revisa tu conexión.'));
async function initFb(){if(au)return;if(!C.firebase.apiKey||C.firebase.apiKey.startsWith('TU_'))throw new Error('cfg');
 for(const f of['app','auth','firestore'])await load('https://www.gstatic.com/firebasejs/10.12.2/firebase-'+f+'-compat.js');
 firebase.initializeApp(C.firebase);au=firebase.auth();db=firebase.firestore();
 au.onAuthStateChanged(u=>{if(u&&u.uid!==done)after(u).then(refresh);if(!u)user=null})}
async function after(u){user=u;done=u.uid;try{localStorage.setItem('acct','1')}catch(e){}await initPurch(u.uid);await pull()}
async function initPurch(uid){const p=P();if(!nat||!p)return;try{if(!initPurch.ok){await p.configure({apiKey:droid?C.rc.android:C.rc.ios,appUserID:uid});initPurch.ok=1}else await p.logIn({appUserID:uid});setInfo(await p.getCustomerInfo())}catch(e){}}
async function pull(){if(!db||!user||!isPro())return;try{const d=await db.doc('users/'+user.uid).get(),r=d.exists&&d.data();
 if(!r){push();return}if(r.at>(S.at||0)){S=JSON.parse(r.json);try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}else if(r.at<(S.at||0))push()}catch(e){}}
function push(){if(db&&user&&isPro())db.doc('users/'+user.uid).set({json:JSON.stringify(S),at:S.at||Date.now()}).catch(()=>{})}
window.onSave=()=>{S.at=Date.now();clearTimeout(tm);tm=setTimeout(push,1500)};
window.gate=(k,v)=>{if(isPro())return true;if((k==='m'&&v==='e')||(k==='tab'&&(v==='g'||v==='v'))||k==='csv'){paywall();return false}return true};
window.login=m=>show('<h2>Entra para continuar</h2><p class="mut">Tu cuenta guarda tu suscripción y sincroniza tus datos.</p><label>Correo<input id="le" type="email" autocomplete="email"></label><label>Contraseña<input id="lp" type="password" autocomplete="current-password"></label><div class="err" id="lm">'+(m||'')+'</div><button class="btn" onclick="doAuth(0)">Entrar</button><p><button class="btn s" onclick="doAuth(1)">Crear cuenta</button> <button class="btn s" onclick="doReset()">Olvidé mi contraseña</button> <button class="btn s" onclick="closeOv()">Cancelar</button></p>');
window.doAuth=async n=>{const m=$('#lm');m.textContent='';try{await initFb();const e=$('#le').value.trim(),p=$('#lp').value,c=n?await au.createUserWithEmailAndPassword(e,p):await au.signInWithEmailAndPassword(e,p);await after(c.user);closeOv();refresh();if(!isPro())paywall()}catch(x){m.textContent=em(x)}};
window.doReset=async()=>{const m=$('#lm');try{await initFb();await au.sendPasswordResetEmail($('#le').value.trim());m.textContent='Te enviamos un correo para restablecerla.'}catch(x){m.textContent=em(x)}};
window.paywall=async()=>{if(!user)return login();
 if(!nat||!P())return show('<h2>Premium</h2><p>Para suscribirte, descarga la app desde Google Play o App Store.</p>'+CB);
 show('<p>Cargando planes…</p>');let pk=null;try{const o=await P().getOfferings();pk=o.current&&o.current.availablePackages[0]}catch(e){}
 if(!pk)return show('<h2>Premium</h2><p class="mut">No pudimos cargar los planes. Intenta más tarde.</p>'+CB);
 offer=pk;
 show('<h2>Financelot Premium</h2><p>Modo Empresa, metas de ahorro, resumen anual, exportar a Excel y sincronización en todos tus dispositivos.</p><p><b>'+esc(pk.product.priceString)+' / mes</b></p><p class="mut">Suscripción mensual con renovación automática. Se cobra a tu cuenta de '+(droid?'Google Play':'Apple')+' y se renueva salvo que la canceles al menos 24 horas antes de que termine el periodo. Puedes gestionarla o cancelarla en los ajustes de tu tienda. <a href="'+C.site+'/terms.html" target="_blank">Términos</a> · <a href="'+C.site+'/privacy.html" target="_blank">Privacidad</a></p><div class="err" id="lm"></div><button class="btn" onclick="buy()">Suscribirme</button><p><button class="btn s" onclick="restore()">Restaurar compras</button> <button class="btn s" onclick="closeOv()">Ahora no</button></p>')};
window.buy=async()=>{const m=$('#lm');try{setInfo(await P().purchasePackage({aPackage:offer}));closeOv();refresh()}catch(x){if(!x.userCancelled)m.textContent='No se pudo completar la compra.'}};
window.restore=async()=>{try{if(!P())throw 0;setInfo(await P().restorePurchases());refresh();alert(isPro()?'Premium restaurado.':'No encontramos compras para restaurar.')}catch(e){alert('No se pudo restaurar. Intenta de nuevo.')}};
window.out=async()=>{try{await au.signOut();if(P())P().logOut().catch(()=>{})}catch(e){}user=null;done=null;setPro(false);refresh()};
window.delAcc=async()=>{if(!confirm('Se eliminará tu cuenta y tus datos en la nube. Si tienes una suscripción, debes cancelarla en tu tienda. ¿Continuar?'))return;
 try{try{await db.doc('users/'+user.uid).delete()}catch(e){}await user.delete();user=null;done=null;setPro(false);refresh();alert('Cuenta eliminada.')}catch(e){alert(e.code==='auth/requires-recent-login'?'Cierra sesión, vuelve a entrar y repite la eliminación.':'No se pudo eliminar. Intenta de nuevo.')}};
window.acctCard=()=>'<div class="card"><h2>Cuenta y plan</h2>'+(user?'<p>'+esc(user.email)+'<br><span class="mut">Plan: '+(isPro()?'Premium':'Gratis')+'</span></p><div class="row" style="gap:8px">'+(isPro()?'':'<button class="btn s" onclick="paywall()">Ver Premium</button>')+'<button class="btn s" onclick="restore()">Restaurar compras</button><button class="btn s" onclick="out()">Cerrar sesión</button><button class="btn s" onclick="delAcc()">Eliminar cuenta</button></div>':'<p class="mut">Plan: '+(isPro()?'Premium':'Gratis')+'. Crea una cuenta para suscribirte y sincronizar tus datos.</p><button class="btn s" onclick="login()">Entrar o crear cuenta</button>')+'</div>';
window.addEventListener('load',()=>{let a;try{a=localStorage.getItem('acct')}catch(e){}if(a)initFb().catch(()=>{});refresh()});
})();
