import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    let senddata = {};
    senddata.token = userInfo.abreakmusic_token;
    senddata.username = userInfo.abreakmusic_username;
    senddata.songid = body.songid;
    senddata.role = "artist";
    let url = process.env.API_BASE + "getsong";
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    res.status(200).json({data: result});
}