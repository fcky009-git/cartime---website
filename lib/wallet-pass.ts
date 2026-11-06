import { env } from "cloudflare:workers";
import forge from "node-forge";
import { zipSync,strToU8 } from "fflate";
import { walletIcon } from "@/lib/wallet-icon";
import { walletConfigured } from "@/lib/travel-pass";
import { contact } from "@/lib/service-info";
import type { bookingRequests,travelPasses } from "@/db/schema";

export async function buildWalletPass(row:{booking:typeof bookingRequests.$inferSelect;pass:typeof travelPasses.$inferSelect},origin:string,code:string){
  if(!walletConfigured())throw new Error("Wallet credentials missing");
  const {booking:b,pass:p}=row;
  const url=`${origin}/${b.locale}/travel-pass#reference=${encodeURIComponent(p.reference)}&code=${encodeURIComponent(code)}`;
  const status=b.status==="cancelled"?"Cancelled":p.stage==="completed"&&b.status==="confirmed"?"Completed":p.stage==="active"&&b.status==="confirmed"?"On the road":b.status==="confirmed"?"Confirmed":"Request received";
  const pass={formatVersion:1,passTypeIdentifier:env.CARTIME_WALLET_PASS_TYPE_ID,teamIdentifier:env.CARTIME_WALLET_TEAM_ID,serialNumber:b.id,organizationName:"CarTime",description:"CarTime Travel Pass",logoText:"CarTime",foregroundColor:"rgb(242,249,255)",backgroundColor:"rgb(10,29,47)",labelColor:"rgb(147,205,238)",voided:b.status==="cancelled",generic:{headerFields:[{key:"status",label:"STATUS",value:status}],primaryFields:[{key:"car",label:p.reference,value:b.carName}],secondaryFields:[{key:"pickup",label:"PICKUP · BAKU TIME",value:`${b.fromDate} ${b.fromTime}`},{key:"return",label:"RETURN · BAKU TIME",value:`${b.toDate} ${b.toTime}`}],auxiliaryFields:[{key:"guest",label:"GUEST",value:b.customerName},{key:"total",label:p.confirmedTotalUsd===null?"ESTIMATE · USD":"AGREED · USD",value:p.confirmedTotalUsd??b.estimateUsd}],backFields:[{key:"open",label:"Live trip details",value:url},{key:"notice",label:"CarTime",value:"Availability and rental terms require manager confirmation. Re-download this pass to refresh its details."},{key:"support",label:"24/7 support",value:contact.allPhones}]},barcodes:[{format:"PKBarcodeFormatQR",message:url,messageEncoding:"iso-8859-1"}]};
  const files:Record<string,Uint8Array>={"pass.json":strToU8(JSON.stringify(pass)),"icon.png":Uint8Array.from(atob(walletIcon),c=>c.charCodeAt(0))};
  const manifest=Object.fromEntries(Object.entries(files).map(([name,bytes])=>[name,forge.md.sha1.create().update(forge.util.binary.raw.encode(bytes)).digest().toHex()]));
  files["manifest.json"]=strToU8(JSON.stringify(manifest));
  const cert=forge.pki.certificateFromPem(env.CARTIME_WALLET_CERT_PEM!);
  const signed=forge.pkcs7.createSignedData();signed.content=forge.util.createBuffer(forge.util.binary.raw.encode(files["manifest.json"]));signed.addCertificate(cert);signed.addCertificate(env.CARTIME_WALLET_WWDR_PEM!);
  signed.addSigner({key:env.CARTIME_WALLET_KEY_PEM!,certificate:cert,digestAlgorithm:forge.pki.oids.sha256,authenticatedAttributes:[{type:forge.pki.oids.contentType,value:forge.pki.oids.data},{type:forge.pki.oids.messageDigest},{type:forge.pki.oids.signingTime}]});signed.sign({detached:true});
  files.signature=forge.util.binary.raw.decode(forge.asn1.toDer(signed.toAsn1()).getBytes());return zipSync(files);
}
