import type { NextApiResponse,NextApiRequest } from "next";
import {google} from 'googleapis'

export default function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        const oauth2_client=new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_AUTH_URL}/api/auth/google/callback`
        )

        const url=oauth2_client.generateAuthUrl({
            access_type:'offline',
            scope:[
                "https://www.googleapis.com/auth/spreadsheets",
                "https://www.googleapis.com/auth/drive.file"

            ],
            prompt:'consent'
        })

        res.redirect(url)

    }catch(e){
        console.log(`error in the google oauth :: ${e}`)
    }
}