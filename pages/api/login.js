import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    let senddata = {};
    let url = process.env.API_BASE + "loginpremium";
    body.role = "artist";
    
    senddata.username = body.username;
    senddata.password = body.password;
    senddata['g-recaptcha-response'] = body['g-recaptcha-response'];
    
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    
    res.setHeader("Set-Cookie", [
        cookie.serialize("abreakmusic_token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_EVEN !== "development",
            maxAge: 60 * 60 * 1000,
            sameSite: "lax",
            path: "/",
        }),
        cookie.serialize("abreakmusic_username", result.username, {
            httpOnly: true,
            secure: process.env.NODE_EVEN !== "development",
            maxAge: 60 * 60 * 1000,
            sameSite: "lax",
            path: "/",
        })
    ]);

    res.status(200).json({result: result});
}