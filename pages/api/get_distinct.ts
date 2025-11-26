import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./query";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if (req.method!=='GET') return res.status(405).json({Error:"Bad Request"})
     
    try{
        console.log('getting the distincts...')
        const headcount=await db.query(`SELECT DISTINCT headcount FROM phone_data WHERE headcount IS NOT NULL AND headcount <> ''`)
        const industry=await db.query(`SELECT DISTINCT industry FROM phone_data WHERE industry IS NOT NULL AND headcount <> ''`)
        const jobtitle=await db.query(`SELECT DISTINCT job_title FROM phone_data WHERE job_title IS NOT NULL AND headcount <> ''`)
        
        const filter_options={
            headcount:headcount.rows.map(r=>r.headcount),
            industry:industry.rows.map(i=>i.industry),
            jobTitle:jobtitle.rows.map(jt=>jt.job_title)
        }

        return res.status(200).json(filter_options)

    }catch(e){
        console.log('error in getting the distincts from db::',e)
        return res.status(405).json({Error:"Error in getting distincts::\n ",e})
    }
}


