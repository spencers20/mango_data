import { NextApiResponse,NextApiRequest } from "next";
import {Pool} from 'pg';

export const db=new Pool(
    {connectionString:"postgresql://neondb_owner:npg_tzmip5BK3Pjw@ep-snowy-smoke-ah0qlnma-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require",
     ssl:{
        rejectUnauthorized:false
     }
    }
)


export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=='POST') return res.status(405).json({"error":"wrong method"})
    
    try{
        
        const body=req.body;
        const data_type=body.dataType;
        const filters=body.filters
        const headcounts=filters.headcount || [];
        const industries=filters.industry || [];
        const jobtitle=filters.jobTitle || [];
        const count=filters.entriesToRetrieve || 100;
        const dbaseType=data_type=='phone'?'phone_data':'email_data'
        console.log('dbaseType....',dbaseType)

        const query=`
        SELECT * FROM ${dbaseType}
        WHERE
          (
           $1::text[] IS NULL OR array_length($1::text[],1) IS NULL
           OR EXISTS(
              SELECT 1 FROM unnest($1::text[])AS hc
              WHERE headcount ILIKE '%' || hc || '%')
          ) 
        AND (
            $2::text[] IS NULL OR array_length($2::text[],1) IS NULL
            OR EXISTS(
               SELECT 1 FROM unnest($2::text[])AS ind
               WHERE industry ILIKE '%' || ind || '%')
        )
        AND (
            $3::text[] IS NULL OR array_length($3::text[],1) IS NULL
            OR EXISTS(
                SELECT 1 FROM unnest($3::text[])AS jt
                WHERE job_title ILIKE '%' || jt || '%')
        )
        LIMIT $4
        `;
        const values=[
            headcounts.length>0? headcounts:null,
            industries.length>0? industries:null,
            jobtitle.length>0? jobtitle:null,
            count
        ]

        const {rows}= await db.query(query,values)
        console.log(`successfully returned with entries ${rows.length}`)

        res.status(200).json({"data":rows})




    }catch(e){
        console.log(`error in getting data:: ${e}`)
        return res.status(405).json({"error":"error in getting the data:: ",e})
    }
}



