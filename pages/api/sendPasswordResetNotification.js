import { Console } from "console";
import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let senddata = {};
    let url = process.env.API_BASE + "sendnotification";

    senddata = {
        type: body.type,
        token: body.token,
        username: body.username, 
        role: "artist"
    }
    
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    res.status(200).json({result: result});
    
}