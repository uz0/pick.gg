import TournamentModel from '../../models/tournament';

export default async (req, res) => {
  const { id } = req.params;

  const tournament = await TournamentModel
    .findOne({ _id: id });

  res.json({ tournament });
};



  // router.get('/:id', async (req, res) => {
  //   const { id } = req.params;

  //   const tournament = await FantasyTournament
  //     .findOne({ _id: id })
  //     .populate({ path: 'users.players', select: '_id id name photo' })
  //     .populate({ path: 'users.user', select: '_id username isStreamer' })
  //     .populate('rules.rule')
  //     .populate({ path: 'winner', select: 'id username' })
  //     .populate({ path: 'creator', select: 'id username isStreamer' })
  //     .populate('tournament')
  //     .populate({
  //       path: 'tournament',
  //       populate: {
  //         path: 'champions',
  //       }
  //     })
  //     .populate({
  //       path: 'tournament',
  //       populate: {
  //         path: 'matches',
  //         populate: {
  //           path: 'results'
  //         }
  //       }
  //     });

  //   res.json({ tournament });
  // });