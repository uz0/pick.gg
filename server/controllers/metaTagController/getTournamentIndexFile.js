import fs from 'fs'
import fetch from 'node-fetch'

import { filePath, getMetaTagsString, insertToHead  } from './helpers'

const getTournament = async id => {
  try {
    const response = await fetch(`https://pick.gg/public/tournaments/${id}`);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

const getTournamentIndexFile = (req, res) => {
  const { id } = req.params;

  fs.readFile(filePath, 'utf8', function (err, indexFileData) {
    if (err) {
      return console.log(err);
    }

    getTournament(id).then(tournament => {
      if (tournament) {
        const meta = getMetaTagsString(
          tournament.name,
          tournament.description,
          tournament.imageUrl
        )
        const result = insertToHead(indexFileData, meta);
        res.send(result);
      } else {
        res.send(indexFileData)
      }
    }).catch(err => console.log(err));
  });
}

export default getTournamentIndexFile