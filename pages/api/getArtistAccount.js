import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let senddata = {};
    let url = process.env.API_BASE + "/artist/getartistaccount";
    let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    
    if(!userInfo){
        senddata.token = userInfo.abreakmusic_token;
        senddata.username = userInfo.abreakmusic_username;
    }else{
        senddata.token = body.token;
        senddata.username = body.username;
    }
    
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    res.status(200).json({result: result});
}

export async function getArtistAccount(senddata){
    let url = process.env.API_BASE + "/artist/getartistaccount";
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    return result;
}