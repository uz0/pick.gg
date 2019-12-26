import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import some from 'lodash/some';

export default (currentUser, tournament) => {
  if (isEmpty(currentUser) || isEmpty(tournament)) {
    return {
      isCurrentUserCreator: false,
      isCurrentUserModerator: false,
      isCurrentUserAdmin: false,
      isCurrentUserCanEdit: false,
    };
  }

  const currentUserId = currentUser._id;
  const tournamentCreatorId = tournament.creator._id;
  const tournamentModerators = tournament.moderators;

  const isCurrentUserAdmin = currentUser.isAdmin;
  const isCurrentUserCreator = isEqual(currentUserId, tournamentCreatorId);
  const isCurrentUserModerator = includes(tournamentModerators, currentUserId);
  const isCurrentUserCanEdit = some([isCurrentUserCreator, isCurrentUserAdmin, isCurrentUserModerator], true);

  return {
    isCurrentUserAdmin,
    isCurrentUserCreator,
    isCurrentUserModerator,
    isCurrentUserCanEdit,
  };
};
