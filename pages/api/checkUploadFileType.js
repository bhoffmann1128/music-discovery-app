import fs from 'fs';
import {fileTypeFromStream} from 'file-type';

export default async function handler(req, res){

    
    const body = req.body;
    const fileType = {

    }
    let u = new Uint8Array(body);
    const stream = fs.createReadStream(u);
    console.log(await fileTypeFromStream(stream));
    res.status(200).json({check: fileType});
    
}