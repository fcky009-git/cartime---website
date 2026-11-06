export type TravelCredentials={reference:string;accessCode:string};
export function makeAccessCode(){const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";return Array.from(crypto.getRandomValues(new Uint8Array(12)),b=>alphabet[b&31]).join("");}
export function travelLink(locale:string,credentials:TravelCredentials){return `/${locale}/travel-pass#${new URLSearchParams({reference:credentials.reference,code:credentials.accessCode})}`;}
export function formattedCode(code:string){return code.match(/.{1,4}/g)?.join("-")||code;}
