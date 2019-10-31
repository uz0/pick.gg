import fs from 'fs'
import fetch from 'node-fetch'

import { filePath, getMetaTagsString, insertToHead  } from './helpers'

const getTournament = async id => {
  try {
    const response = await fetch(`https://pick.gg/public/tournaments/5d9f665baa31620017493516`);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

const getTournamentIndexFile = (req, res) => {
  const { id } = req.params;

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    getTournament(id).then(tournament => {
      console.log('name',tournament.name)
    });

    const meta = getMetaTagsString('tournament.title', "tournament.description", 'tournament.imageUrl')
    const result = insertToHead(data, meta);
    res.send(result);
  });
}

export default getTournamentIndexFile