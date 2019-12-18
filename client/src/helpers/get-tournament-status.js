import i18n from 'i18next';

export default (tournament) => {
  const getTournamentStatus = tournament => {
    const isEmpty = tournament.isEmpty;
    const isApplicationsAvailable = tournament.isApplicationsAvailable;
    const isForecastingActive = tournament.isForecastingActive;
    const isStarted = tournament.isStarted;
    const isFinalized = tournament.isFinalized;
  
    if (isEmpty) {
      return i18n.t('creating_tournament');
    }
  
    if ((!isForecastingActive && !isEmpty) && isApplicationsAvailable) {
      return i18n.t('creating_tournament');
    }
  
    if ((!isApplicationsAvailable && !isFinalized) && isForecastingActive) {
      return i18n.t('creating_tournament');
    }
    if ((!isForecastingActive && !isEmpty) && isApplicationsAvailable) {
      return i18n.t('waiting_applicants');
    }
  
    if (isForecastingActive) {
      return i18n.t('waiting_viewers');
    }
  
    if (isStarted && !isFinalized) {
      return i18n.t('tournament_go');
    }
  
    if (isFinalized) {
      return i18n.t('is_over');
    }
  };
  return getTournamentStatus(tournament);
}