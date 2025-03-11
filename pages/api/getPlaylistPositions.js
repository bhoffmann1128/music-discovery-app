export default async function handler(req, res){;

    let url = process.env.API_BASE + "playlist/getplaylistpositions";
    
    let body = req.body;
    const data = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body)
    });
    const result = await data.json();
    res.status(200).json({data: result});
}