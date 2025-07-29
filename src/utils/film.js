const formatStringToDate = (date) =>
  new Date(date).toLocaleString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

const formatStringToYear = (date) =>
  new Date(date).getFullYear();

const formatMinutesToTime = (minutes) => {
  const MINUTES_PER_HOUR = 60;

  return (minutes < MINUTES_PER_HOUR)
    ? `${minutes}m`
    : `${Math.floor(minutes / MINUTES_PER_HOUR)}h ${minutes % MINUTES_PER_HOUR}m`;
};

const formatStringToDateWithTime = (date) =>
  new Date(date).toLocaleString('en-GB', { day: '2-digit', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });


export {
  formatStringToDate,
  formatStringToYear,
  formatMinutesToTime,
  formatStringToDateWithTime,
};
