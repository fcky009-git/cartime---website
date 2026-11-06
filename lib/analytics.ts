/**
 * Google Tag Manager is loaded only when NEXT_PUBLIC_GTM_ID is set (format GTM-XXXXXXX).
 * Without it nothing is loaded. Before enabling it for visitors from the EU/EEA, add a
 * consent banner (Consent Mode v2); see the launch checklist in docs/claude-seo-handoff.md.
 */
const rawId = process.env.NEXT_PUBLIC_GTM_ID ?? "";
export const gtmId = /^GTM-[A-Z0-9]{4,12}$/.test(rawId) ? rawId : "";

export function gtmHeadScript(id: string) {
  // The Travel Pass address holds the customer's private access code.
  return `if(!/\\/travel-pass\\/?$/.test(location.pathname)){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');}`;
}

/** Pushes click_phone, click_email and click_whatsapp events to dataLayer for conversion tracking. */
export const clickEventsScript = `window.dataLayer=window.dataLayer||[];document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;var h=a.getAttribute('href')||'';var n=h.indexOf('tel:')===0?'click_phone':h.indexOf('mailto:')===0?'click_email':/wa\\.me|whatsapp/i.test(h)?'click_whatsapp':'';if(n)window.dataLayer.push({event:n,link_url:h})},true);`;
