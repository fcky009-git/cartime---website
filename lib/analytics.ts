const rawId = process.env.NEXT_PUBLIC_GTM_ID ?? "";
export const gtmId = /^GTM-[A-Z0-9]{4,12}$/.test(rawId) ? rawId : "";

export type MeasurementChoice = "allow" | "reject";

declare global {
  interface Window {
    cartimeMeasurement?: {
      getChoice(): MeasurementChoice | null;
      setChoice(choice: MeasurementChoice): void;
      recordLead(requestId: string): void;
    };
  }
}

export function gtmHeadScript(id: string) {
  // This bootstrap runs before any Google measurement tag. Private pages are excluded.
  return `(function(){
    var container=${JSON.stringify(id)};
    var privatePath=/\\/(?:admin|travel-pass)(?:\\/|$)/i;
    if(privatePath.test(location.pathname))return;

    var key='cartime-measurement-v1';
    var lifetime=180*24*60*60*1000;
    var choice=readChoice();
    var loaded=false;
    var leads=new Set();
    window.dataLayer=window.dataLayer||[];
    function consent(command,value){
      function gtag(){window.dataLayer.push(arguments);}
      gtag('consent',command,{
        ad_storage:value,analytics_storage:value,ad_user_data:value,ad_personalization:'denied'
      });
    }
    function readChoice(){
      try{
        var saved=JSON.parse(localStorage.getItem(key));
        if(saved&&saved.until>Date.now()&&(saved.value==='allow'||saved.value==='reject'))return saved.value;
      }catch{}
      return null;
    }
    function load(){
      if(loaded||privatePath.test(location.pathname))return;
      loaded=true;
      consent('update','granted');
      window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
      var tag=document.createElement('script');
      tag.async=true;
      tag.src='https://www.googletagmanager.com/gtm.js?id='+container;
      document.head.appendChild(tag);
    }
    function emit(event){
      if(choice==='allow'&&!privatePath.test(location.pathname))window.dataLayer.push({event:event});
    }
    function apply(next){
      choice=next;
      window.dispatchEvent(new Event('cartime-measurement-change'));
      if(next==='allow'){load();return;}
      consent('update','denied');
      if(loaded)location.reload();
    }
    consent('default','denied');
    window.cartimeMeasurement={
      getChoice:function(){return choice;},
      setChoice:function(next){
        try{localStorage.setItem(key,JSON.stringify({value:next,until:Date.now()+lifetime}));}catch{}
        apply(next);
      },
      recordLead:function(requestId){
        if(choice!=='allow'||leads.has(requestId)||privatePath.test(location.pathname))return;
        leads.add(requestId);
        emit('generate_lead');
      }
    };
    window.addEventListener('storage',function(e){
      if(e.key===key||e.key===null)apply(readChoice());
    });
    if(choice==='allow')load();
    document.addEventListener('click',function(e){
      if(choice!=='allow')return;
      var a=e.target instanceof Element?e.target.closest('a[href]'):null;
      if(!a)return;
      var url=new URL(a.href,location.href);
      var name=url.protocol==='tel:'?'click_phone':url.protocol==='mailto:'?'click_email':
        /^(?:wa\\.me|(?:[a-z]+\\.)?whatsapp\\.com)$/i.test(url.hostname)?'click_whatsapp':'';
      if(name)emit(name);
    },true);
  })();`;
}

export function recordBookingLead(requestId: string) {
  // Use the request ID for in-page deduplication only. Send no booking fields.
  window.cartimeMeasurement?.recordLead(requestId);
}
