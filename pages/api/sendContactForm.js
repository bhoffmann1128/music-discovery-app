import { Console } from "console";
import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let senddata = {};
    let url = process.env.API_BASE + "sendnotification";
    
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body)
    });
    const result = await data.json();
    res.status(200).json({result: result});
    
}