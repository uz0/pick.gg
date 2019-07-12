import { withValidationHandler } from "../../helpers";
import { param } from "express-validator/check";
import { isEntityExists } from "../../validators";
import tournament from "../../../models/tournament";
import match from "../../../models/match";

export const validator = [
    param('tournamentId').custom(id => isEntityExists(id, tournament)),
    param('matchId').custom(id => isEntityExists(id< match))
]

export const handler = withValidationHandler(async (req,res) => {
    const { matchId } = req.params;

    const wantedMatch = await match.findById(matchId).exec()

    res.json(wantedMatch)
})
