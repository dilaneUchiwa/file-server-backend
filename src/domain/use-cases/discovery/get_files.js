const fs = require('fs');
const path = require('path');

exports.discovery = async (req, res) => {
  const dirname = req.body.directory || process.env.ROOT;

  try {
    const files = await fs.promises.readdir(dirname);

    const results = await Promise.all(
      files.map(async filename => {
        const singlePath = path.join(dirname, filename);
        const stat = await fs.promises.stat(singlePath);

        let result = {
          name: filename,
          extension: path.extname(filename),
        };

        if (stat.isDirectory()) {
          result.count = (await fs.promises.readdir(singlePath)).length;  
        } else {
          result.count = undefined;
        }

        result.size = stat.size;
        result.createdAt = stat.birthtime;
        result.modifiedAt = stat.mtime;
        result.type = stat.isDirectory() ? 'directory' : 'file';
        result.path = singlePath;

        return result;
      })
    );

    results.sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') {
        return -1; 
      } else if (a.type !== 'directory' && b.type === 'directory') {
        return 1;
      } else {
        return 0;
      }
    });

    res.status(200).send(results);

  } catch (err) {
    res.status(500).send(err);
  }

};