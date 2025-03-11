import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    
    body.token = userInfo.abreakmusic_token;
    body.username = userInfo.abreakmusic_username;
    body.action = "update";
    body.role = "artist";

    let url = process.env.API_BASE + "artist/saveartistprofile";
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body)
    });
    const result = await data.json();
    res.status(200).json({data: result});
}