import cookie from "cookie";

export default async function handler(req, res){

    const body = req.body;
    const username = body.username;
    let senddata = {};
    
    senddata.username = username;
    let url = process.env.API_BASE + "checkUsernameDuplicate";

    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    res.status(200).json({check: result});
    
}