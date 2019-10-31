import fs from 'fs'

import { filePath, getMetaTagsString, insertToHead } from './helpers'

const getHomePageIndexFile = (req, res) => {
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    const meta = getMetaTagsString(
      'Сервис для проведения турниров по лиге легенд между стримерами',
      'Pick.gg',
      '$Image'
    );

    const result = insertToHead(data, meta);

    res.send(result);
  });
};

export default getHomePageIndexFile