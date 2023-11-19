const fs = require('fs');

exports.read_video = (req, res) => {

    // Vérifiez si videoPath est fourni
    if (!req.query.videoPath) {
        res.status(404).send({ error: "videoPath is required" });
        return;
    }

    const videoPath=req.query.videoPath;

    fs.stat(videoPath, (err, stat) => {
        if (err) {
            // Gestion des erreurs lors de la vérification de la statut du fichier
            console.error(err);
            res.status(500).send({ error: "Internal Server Error" });
            return;
        }

        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            // Gestion des demandes de plage (Range requests)
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });

            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4'
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            // Gestion des demandes sans plage (Full content requests)
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4'
            };

            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    });
};
