export default async function handler(req, res){;

    let url = process.env.API_BASE + "playlist/getarchive";
    const data = await fetch(url, {
        method: 'post',
        body: null
    });
    const result = await data.json();
    res.status(200).json({data: result});
}