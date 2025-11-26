import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie'
import { google } from "googleapis";

function get_sheet_id(url:any){
    const match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

function convertToSheetData(data: any[]): any[][] {
    if (!data || data.length === 0) return [];
    
    // If already in correct format (array of arrays), return as is
    if (Array.isArray(data[0])) {
        return data;
    }
    
    // If array of objects, convert to 2D array
    const keys = Object.keys(data[0]);
    const headers = keys;
    const rows = data.map(obj => keys.map(key => obj[key] ?? ''));
    
    return [headers, ...rows];
}


export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        console.log('storing to spreadsheet...')
        console.log('Raw cookie header:', req.headers.cookie)
        const cookies = cookie.parse(req.headers.cookie || "")
        const tokens =cookies.google_tokens? JSON.parse(cookies.google_tokens):null

        if(!tokens) return res.status(401).json({error: "Not authorized"})

        const oauth2_client=new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
        )

        oauth2_client.setCredentials(tokens);
        const credentials = oauth2_client.credentials
        console.log('OAuth2 client credentials set:', JSON.stringify(credentials, null, 2))
        const sheets=google.sheets({version:"v4",auth:oauth2_client})
        const body=req.body
        const spreadsheet_url=body.spreadsheetUrl
        const raw_data=body.data

        const sheet_data=convertToSheetData(raw_data)

        const spreadsheet_id=get_sheet_id(spreadsheet_url)
        console.log('Attempting to update spreadsheet:', spreadsheet_id)

        await sheets.spreadsheets.values.update({
            spreadsheetId:spreadsheet_id,
            range:"Sheet1!A1",
            valueInputOption:"RAW",
            requestBody:{values:sheet_data},
        })

        return res.status(200).json({success:"data updated to the sheets successfully"})


    }catch(e){
        console.log(`error in updating the google sheets ${e}`)
        return res.status(500).json({error:'Failed to update sheet'})
    }
}