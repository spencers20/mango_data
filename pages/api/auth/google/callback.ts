import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        const oauth2_client=new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_AUTH_URL}/api/auth/google/callback`
        )

        const {code}=req.query
         if (!code) {
            console.log('ERROR: No code provided')
            return res.status(400).send("Missing Authorization code")
        }
        console.log('Code received:', code)
        console.log('Exchanging code for tokens...')

        const {tokens}=await oauth2_client.getToken(code as string)
        console.log(`received tokens ${tokens}`)
        oauth2_client.setCredentials(tokens)

        res.setHeader(
            "Set-Cookie",
            cookie.serialize('google_tokens',JSON.stringify(tokens),{
                httpOnly:true,
                secure: false,
                sameSite: 'lax',
                path:"/",
                maxAge:3600 * 24*7
            })
        )

        console.log('Cookie set, redirecting to /')
        console.log('=== CALLBACK HANDLER END ===')

        res.redirect('/')
    }catch(e){
        console.log(`error in the callback function ${e}`)
        res.status(500).send("Google authentication failed")
    }
}