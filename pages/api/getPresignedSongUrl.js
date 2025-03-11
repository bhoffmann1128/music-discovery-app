import { Console } from "console";
import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let senddata = {};
    let url = process.env.API_BASE + "addTrack/getsignedurl";
    let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    senddata.token = userInfo.abreakmusic_token;
    senddata.username = userInfo.abreakmusic_username;
    senddata.key = body.key;
    senddata.action = "PUT";
    senddata.metadata = body.metadata;
    //first get presigned url...
    
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    res.status(200).json({result: result});
}