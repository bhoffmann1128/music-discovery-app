import cookie  from "cookie";

export default async function handler(req, res){

    res.setHeader("Set-Cookie", [
        cookie.serialize("token", null, {
            httpOnly: true,
            secure: process.env.NODE_EVEN !== "development",
            maxAge: -1,
            sameSite: "lax",
            path: "/",
        }),
        cookie.serialize("username", null, {
            httpOnly: true,
            secure: process.env.NODE_EVEN !== "development",
            maxAge: -1,
            sameSite: "lax",
            path: "/",
        }),
        cookie.serialize("abreak-isLoggedIn", false, {
            httpOnly: true,
            secure: process.env.NODE_EVEN !== "development",
            maxAge: -1,
            sameSite: "lax",
            path: "/",
        }),
    ]);

    let result = "success";
    res.status(200).json({result: result});
}

export async function clearCookies(){

    res.setHeader("Set-Cookie", [
        cookie.serialize("abreakmusic_token", null, {
            httpOnly: true,
            secure: process.env.NODE_EVEN !== "development",
            maxAge: -1,
            sameSite: "lax",
            path: "/",
        }),
        cookie.serialize("abreakmusic_username", null, {
            httpOnly: true,
            secure: process.env.NODE_EVEN !== "development",
            maxAge: -1,
            sameSite: "lax",
            path: "/",
        }),
        cookie.serialize("abreakmusic_isLoggedIn", false, {
            httpOnly: true,
            secure: process.env.NODE_EVEN !== "development",
            maxAge: -1,
            sameSite: "lax",
            path: "/",
        }),
    ]);

    let result = "success";
    return result;

}