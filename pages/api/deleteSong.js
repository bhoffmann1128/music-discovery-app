import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);

    let songData = body;
    songData.token = userInfo.abreakmusic_token;
    songData.username = userInfo.abreakmusic_username;
    songData.role = "artist";
    
    let url = process.env.API_BASE + "song/deletesong";
    
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(songData)
    });
    const result = await data.json();
    res.status(200).json({data: result});
}