import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    if(body.token){
        userInfo.abreakmusic_token = body.token;
        userInfo.abreakmusic_username = body.username;
    }
    let senddata = {};
    senddata.token = userInfo.abreakmusic_token;
    senddata.username = userInfo.abreakmusic_username;
    senddata.action = "get";
    senddata.role = "artist";
    
    let url = process.env.API_BASE + "artist/getartistprofile";
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    res.status(200).json({data: result});
}

export async function getArtistProfile(senddata) {
    let url = process.env.API_BASE + "artist/getartistprofile";
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    return result;
}