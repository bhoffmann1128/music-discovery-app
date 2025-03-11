import { Console } from "console";
import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let senddata = {};
    let url = process.env.API_BASE + "/artist/updateaccountinfo";
    let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);

    senddata.token = userInfo.abreakmusic_token;
    senddata.username = userInfo.abreakmusic_username;
    senddata.customer_id = body.customer_id;
    senddata.subscription_id = body.subscription_id;
    senddata.subscription_type = body.subscription_type;
    senddata.payment_intent = body.payment_intent;
    senddata.subscription_status = body.status;
    
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    res.status(200).json({result: result});
}

export async function updateAccount(senddata){
    let url = process.env.API_BASE + "/artist/updateaccountinfo";
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    return result;
}