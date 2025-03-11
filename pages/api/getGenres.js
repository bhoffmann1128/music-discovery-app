import { Console } from "console";
import cookie from "cookie";

export default async function handler(req, res){;

    let url = process.env.API_BASE + "getgenres";
    const data = await fetch(url, {
        method: 'post',
        body: null
    });
    const result = await data.json();
    res.status(200).json({genres: result});
}

export async function getGenres(){
    let url = process.env.API_BASE + "getgenres";
    const data = await fetch(url, {
        method: 'post',
        body: null
    });
    const result = await data.json();
    return result;
}