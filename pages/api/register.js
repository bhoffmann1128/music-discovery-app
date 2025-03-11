import { Console } from "console";
import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let senddata = {};
    let url = process.env.API_BASE + "artist";

    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body)
    });
    const result = await data.json();
    
    if(result.userid){
        res.setHeader("Set-Cookie", [
            cookie.serialize("abreakmusic_token", result.userid, {
                httpOnly: true,
                secure: process.env.NODE_EVEN !== "development",
                maxAge: 60 * 60 * 1000,
                sameSite: "lax",
                path: "/",
            }),
            cookie.serialize("abreakmusic_username", body.username, {
                httpOnly: true,
                secure: process.env.NODE_EVEN !== "development",
                maxAge: 60 * 60 * 1000,
                sameSite: "lax",
                path: "/",
            })
        ]);
    }

    res.status(200).json({result: result});
}