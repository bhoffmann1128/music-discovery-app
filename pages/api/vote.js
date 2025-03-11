import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    
    let senddata = {};
    let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);

    if(userInfo){
        senddata.token = userInfo.abreakmusic_token;
        senddata.username = userInfo.abreakmusic_username;
    }
    senddata.role = "artist";
    senddata.artist = body.artist;
    senddata.song = body.song;
    senddata.songid = body.songid;
    senddata.type = body.type;
    senddata.vote = body.vote;

    let category = 1;
    if(body.category){
        category = body.category;
    }
    senddata.category = category;
    let url = process.env.API_BASE_PROXY + "proxydevelopment/vote?";

    const data = await fetch(url + new URLSearchParams(senddata));
    const result = await data.json();
    res.status(200).json({status: result.results});
    
}