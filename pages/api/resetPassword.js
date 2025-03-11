export default async function handler(req, res){

    const body = req.body;
    let senddata = {};
    let url = process.env.API_BASE + "resetpassword";
    
    senddata.email = body.email;
    senddata['g-recaptcha-response'] = body['g-recaptcha-response'];
    
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(senddata)
    });
    const result = await data.json();
    res.status(200).json({result: result});
}