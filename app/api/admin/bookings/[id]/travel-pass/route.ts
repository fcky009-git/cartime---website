import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { adminBookingEvents,bookingRequests,travelPasses } from "@/db/schema";
import { currentBookingAdmin } from "@/lib/admin-auth";
import { hashAccess,issueTravelPass,newAccessCode,passHeaders } from "@/lib/travel-pass";
export const dynamic="force-dynamic";
type Context={params:Promise<{id:string}>};
export async function GET(_request:Request,{params}:Context){
  if(!await currentBookingAdmin()) return Response.json({error:"Forbidden"},{status:403,headers:passHeaders});
  const {id}=await params;
  if(!z.string().uuid().safeParse(id).success)return Response.json({error:"Invalid ID"},{status:400,headers:passHeaders});
  try{
    const [pass]=await getDb().select({reference:travelPasses.reference,message:travelPasses.message,pickupInstructions:travelPasses.pickupInstructions,confirmedTotalUsd:travelPasses.confirmedTotalUsd,depositUsd:travelPasses.depositUsd,stage:travelPasses.stage}).from(travelPasses).where(eq(travelPasses.bookingId,id));
    return Response.json({pass:pass||null},{headers:passHeaders});
  }catch(error){console.error("Admin travel pass read failed",error);return Response.json({error:"Unavailable"},{status:503,headers:passHeaders});}
}
const update=z.object({rotate:z.boolean().optional(),message:z.string().trim().max(2000).optional(),pickupInstructions:z.string().trim().max(2000).optional(),confirmedTotalUsd:z.number().int().min(0).max(1000000).nullable().optional(),depositUsd:z.number().int().min(0).max(1000000).nullable().optional(),stage:z.enum(["booking","active","completed"]).optional()});
export async function POST(request:Request,{params}:Context){
  if(!await currentBookingAdmin()||request.headers.get("origin")!==new URL(request.url).origin) return Response.json({error:"Forbidden"},{status:403,headers:passHeaders});
  try{
    const {id}=await params;if(!z.string().uuid().safeParse(id).success)return Response.json({error:"Invalid ID"},{status:400});
    const text=await request.text();if(text.length>6000)return Response.json({error:"Too large"},{status:413});
    let body:unknown;try{body=JSON.parse(text);}catch{return Response.json({error:"Invalid JSON"},{status:400,headers:passHeaders});}
    const data=update.safeParse(body);if(!data.success)return Response.json({error:"Invalid fields"},{status:400,headers:passHeaders});
    const db=getDb();const [booking]=await db.select({id:bookingRequests.id,status:bookingRequests.status}).from(bookingRequests).where(eq(bookingRequests.id,id));
    if(!booking)return Response.json({error:"Not found"},{status:404});
    if(data.data.stage&&data.data.stage!=="booking"&&booking.status!=="confirmed")return Response.json({error:"Confirm booking first"},{status:409});
    const [existing]=await db.select().from(travelPasses).where(eq(travelPasses.bookingId,id));let credentials=null;
    if(!existing||data.data.rotate){const code=newAccessCode();if(existing){await db.update(travelPasses).set({accessHash:await hashAccess(code),updatedAt:new Date().toISOString()}).where(eq(travelPasses.bookingId,id));credentials={reference:existing.reference,accessCode:code};}else credentials=await issueTravelPass(id,code);}
    const {rotate:_,...fields}=data.data;void _;
    const now=new Date().toISOString();
    await db.update(travelPasses).set({...fields,updatedAt:now}).where(eq(travelPasses.bookingId,id));
    if(fields.stage&&fields.stage!==(existing?.stage??"booking"))await db.insert(adminBookingEvents).values({id:crypto.randomUUID(),bookingId:id,type:"stage",value:fields.stage,createdAt:now});
    return Response.json({ok:true,credentials},{headers:passHeaders});
  }catch(error){console.error("Admin travel pass failed",error);return Response.json({error:"Unavailable"},{status:503,headers:passHeaders});}
}
