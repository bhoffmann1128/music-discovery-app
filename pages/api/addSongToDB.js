import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let userInfo = cookie.parse(req ? req.headers.cookie || "" : document.cookie);

    let editedSongName = body.songname.replace(/\..+$/, '');
    let songdata = {
        songname: editedSongName,
        key: body.key,
        location : body.key,
        token: userInfo.abreakmusic_token,
        username: userInfo.abreakmusic_username,
        role: "artist"
    };

    console.log(songdata);

    let url = process.env.API_BASE + "/artist/addtrackpremium";
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(songdata)
    });
    const result = await data.json();
    console.log("add song result", result);
    res.status(200).json({data: result});
}