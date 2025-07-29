import { UserStatusTitle, UserStatusValue } from '../const.js';

const getUserStatus = (films) => {
  const watchedFilmCount = films.filter((film) => film.userDetails.alreadyWatched).length;
  // eslint-disable-next-line no-console
  console.log(watchedFilmCount);

  if (watchedFilmCount >= UserStatusValue.NOVICE && watchedFilmCount < UserStatusValue.FAN) {//1 && 11
    return UserStatusTitle.NOVICE;
  }
  if (watchedFilmCount >= UserStatusValue.FAN && watchedFilmCount < UserStatusValue.MOVIE_BUFF) {
    return UserStatusTitle.FAN;
  }
  if (watchedFilmCount >= UserStatusValue.MOVIE_BUFF) {
    return UserStatusTitle.MOVIE_BUFF;
  }

  return null;
};

export { getUserStatus };
