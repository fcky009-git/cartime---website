import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { adminBookingEvents } from "@/db/schema";
import { findTravelPass, passHeaders, travelAccessAllowed } from "@/lib/travel-pass";
import { buildWalletPass, walletConfigured } from "@/lib/wallet-pass";
export const dynamic = "force-dynamic";
const input = z.object({ reference:z.string().trim().max(32), accessCode:z.string().max(40), wallet:z.boolean().optional() });
export async function POST(request:Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({error:"Forbidden"},{status:403,headers:passHeaders});
  try {
    const raw = await request.text();
    if(raw.length>512) return Response.json({error:"Invalid request"},{status:400,headers:passHeaders});
    const parsed=input.safeParse(JSON.parse(raw));
    if(!parsed.success) return Response.json({error:"Invalid request"},{status:400,headers:passHeaders});
    if(!await travelAccessAllowed(request)) return Response.json({error:"Try later"},{status:429,headers:{...passHeaders,"Retry-After":"900"}});
    const row=await findTravelPass(parsed.data.reference,parsed.data.accessCode);
    if(!row) return Response.json({error:"Not found"},{status:404,headers:passHeaders});
    const {booking:b,pass:p}=row;
    if(parsed.data.wallet){
      if(!walletConfigured()) return Response.json({error:"Wallet unavailable"},{status:503,headers:passHeaders});
      const bytes=await buildWalletPass(row,new URL(request.url).origin,parsed.data.accessCode);
      return new Response(bytes.buffer as ArrayBuffer,{headers:{...passHeaders,"Content-Type":"application/vnd.apple.pkpass","Content-Disposition":`attachment; filename="${p.reference}.pkpass"`}});
    }
    const events=await getDb().select().from(adminBookingEvents).where(eq(adminBookingEvents.bookingId,b.id)).orderBy(asc(adminBookingEvents.createdAt));
    return Response.json({pass:{reference:p.reference,status:b.status,stage:p.stage,updatedAt:[p.updatedAt,b.updatedAt].sort().at(-1),customerName:b.customerName,
      carId:b.carId,carName:b.carName,carYear:b.carYear,fromDate:b.fromDate,fromTime:b.fromTime,toDate:b.toDate,toTime:b.toTime,days:b.days,
      pickup:b.pickup,pickupAddress:b.pickupAddress,dropoff:b.dropoff,returnAddress:b.returnAddress,estimateUsd:b.estimateUsd,
      confirmedTotalUsd:p.confirmedTotalUsd,depositUsd:p.depositUsd,message:p.message,pickupInstructions:p.pickupInstructions,
      history:[{status:"new",at:b.createdAt},...events.filter(e=>e.type==="status").map(e=>({status:e.value,at:e.createdAt}))],walletReady:walletConfigured()}},{headers:passHeaders});
  }catch(error){ console.error("Travel pass request failed",error);return Response.json({error:"Unavailable"},{status:503,headers:passHeaders}); }
}
