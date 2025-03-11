import { Console } from "console";
import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let senddata = {};
    let url = process.env.API_BASE + "sendnotification";
    let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);

    senddata = {
        type: body.type,
        token: body.userid ? body.userid : userInfo.abreakmusic_token,
        username: body.username ? body.username : userInfo.abreakmusic_username,
        role: "artist"
    }
    
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    res.status(200).json({result: result});
    
}