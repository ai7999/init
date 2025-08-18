/* eslint-disable arrow-body-style */
import {
  getRandomValue,
  getRandomPositiveInteger,
  getRandomPositiveFloat,
} from '../utils/common.js';

import {
  formatStringToDate,
  formatMinutesToTime,
} from '../utils/film.js';

import {
  NAME_COUNT, MAX_COMMENTS_ON_FILM, GenreCount, Rating,
  AgeRating, Runtime, YearsDuration, names, surnames,
  titles, posters, genres, description, countries, DateType,
  DaysDuration
} from './const.js';
import { FILM_COUNT } from '../const.js';

const getDate = (type) => {
  const date = new Date();

  switch (type) {
    case DateType.FILM_INFO:
      date.setFullYear(
        date.getFullYear() - getRandomPositiveInteger(YearsDuration.MIN, YearsDuration.MAX)
      );
      break;
    case DateType.USER_DETAILS:
      date.setDate(
        date.getDate() - getRandomPositiveInteger(DaysDuration.MIN, DaysDuration.MAX)
      );
      break;
  }
  return date.toISOString();
};

const generateFilm = () => (
  {
    title: getRandomValue(titles),
    alternativeTitle: getRandomValue(titles),
    totalRating: getRandomPositiveFloat(Rating.MIN, Rating.MAX),
    poster: getRandomValue(posters),
    ageRating: `${getRandomPositiveInteger(AgeRating.MIN, AgeRating.MAX)}+`,
    director: `${getRandomValue(names)} ${getRandomValue(surnames)}`,
    writers: Array.from({ length: NAME_COUNT }, () => `${getRandomValue(names)} ${getRandomValue(surnames)}`),
    actors: Array.from({ length: NAME_COUNT }, () => `${getRandomValue(names)} ${getRandomValue(surnames)}`),
    release: {
      date: formatStringToDate(getDate(DateType.FILM_INFO)),
      releaseCountry: getRandomValue(countries)
    },
    runtime: formatMinutesToTime(getRandomPositiveInteger(Runtime.MIN, Runtime.MAX)),
    genre: Array.from({ length: getRandomPositiveInteger(GenreCount.MIN, GenreCount.MAX) }, () => getRandomValue(genres)),
    // eslint-disable-next-line no-useless-escape
    description
  }
);

const generateFilms = () => {
  const films = Array.from({ length: FILM_COUNT }, generateFilm);

  let totalCommentsCount = 0;

  const getWatchingDate = () => getDate(DateType.USER_DETAILS);

  return films.map((film, index) => {
    const hasComments = getRandomPositiveInteger(0, 1);

    const filmCommentsCount = (hasComments) ? getRandomPositiveInteger(1, MAX_COMMENTS_ON_FILM) : 0;

    totalCommentsCount += filmCommentsCount;//

    const alreadyWatched = Boolean(getRandomPositiveInteger(0, 1));//

    return {
      id: String(index + 1),
      comments: (hasComments) ? Array.from({ length: filmCommentsCount }, (_value, commentIndex) => String(totalCommentsCount - commentIndex)) : [],
      filmInfo: film,
      /*
      В этом блоке содержится так называемая мета-информация (служебная, дополнительная) о фильме. Нужно её тоже
       сгенерировать, для этого перенесёмся в файл /src/mock/film.js и добавим код для генерации данных:
      */
      userDetails: {
        watchList: Boolean(getRandomPositiveInteger(0, 1)),
        alreadyWatched,
        watchingDate: (alreadyWatched) ? getWatchingDate() : null,// Мы ведь генерируем данные похожие на настоящие,
        // а просмотренный фильм без даты просмотра существовать не может.
        favorite: Boolean(getRandomPositiveInteger(0, 1)),
      }
    };
  });
};

export { generateFilms };
