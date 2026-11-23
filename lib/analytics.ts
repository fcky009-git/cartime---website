/** GTM remains opt-in through NEXT_PUBLIC_GTM_ID. Configure consent before enabling it. */
const rawId = process.env.NEXT_PUBLIC_GTM_ID ?? "";
export const gtmId = /^GTM-[A-Z0-9]{4,12}$/.test(rawId) ? rawId : "";

export function gtmHeadScript(id: string) {
  // Staff pages and private travel credentials never enter the analytics data layer.
  return `if(!/\\/(?:admin|travel-pass)\\/?$/.test(location.pathname)){
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
    var tag=document.createElement('script');
    tag.async=true;
    tag.src='https://www.googletagmanager.com/gtm.js?id=${id}';
    document.head.appendChild(tag);
    document.addEventListener('click',function(e){
      var a=e.target instanceof Element?e.target.closest('a[href]'):null;
      if(!a)return;
      var url=new URL(a.href,location.href);
      var name=url.protocol==='tel:'?'click_phone':url.protocol==='mailto:'?'click_email':
        /^(?:wa\\.me|(?:[a-z]+\\.)?whatsapp\\.com)$/i.test(url.hostname)?'click_whatsapp':'';
      if(name)window.dataLayer.push({event:name});
    },true);
  }`;
}

export function recordBookingLead() {
  // The form calls this after the server confirms a saved request. Send no booking fields.
  (window as Window & { dataLayer?: { event: string }[] }).dataLayer?.push({ event: "generate_lead" });
}
