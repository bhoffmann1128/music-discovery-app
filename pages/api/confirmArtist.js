import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    const confirmCode = body.confirmationCode;
    let senddata = {
        user: confirmCode
    }
    let url = process.env.API_BASE + "confirmartist";
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    res.status(200).json({data: result});
}

export async function confirmArtist(confirmationCode){
    let senddata = {
        user: confirmationCode
    }
    let url = process.env.API_BASE + "confirmartist";
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    return result;
}