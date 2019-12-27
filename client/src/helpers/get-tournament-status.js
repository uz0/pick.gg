export default ({
  isEmpty,
  isApplicationsAvailable,
  isForecastingActive,
  isStarted,
  isFinalized,
}) => {
  if (isEmpty) {
    return 'creating_tournament';
  }

  if (isStarted && !isFinalized) {
    return 'tournament_go';
  }

  if (isFinalized) {
    return 'is_over';
  }

  if (isForecastingActive) {
    return 'let_viewers_make_forecasts';
  }

  if (!isForecastingActive && !isEmpty && !isApplicationsAvailable) {
    return 'creating_tournament';
  }

  if (!isForecastingActive && !isEmpty && isApplicationsAvailable) {
    return 'creating_tournament';
  }

  if (!isApplicationsAvailable && !isFinalized && isForecastingActive) {
    return 'creating_tournament';
  }

  if (!isForecastingActive && !isEmpty && isApplicationsAvailable) {
    return 'waiting_applicants';
  }

  if (isForecastingActive) {
    return 'waiting_viewers';
  }
};
