/* eslint-disable arrow-body-style */
import {
  getRandomValue,
  getRandomPositiveInteger,
  getRandomPositiveFloat,
  formatStringToDate,
  formatMinutesToTime
} from '../util.js';
import {
  NAME_COUNT, MAX_COMMENTS_ON_FILM, GenreCount, Rating,
  AgeRating, Runtime, YearsDuration, names, surnames,
  titles, posters, genres, description, countries,
} from './const.js';
import { FILM_COUNT } from '../const.js';

const getDate = () => {
  const date = new Date();

  date.setFullYear(
    date.getFullYear() - getRandomPositiveInteger(YearsDuration.MIN, YearsDuration.MAX)
  );

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
      date: formatStringToDate(getDate()),
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

  return films.map((film, index) => {
    const hasComments = getRandomPositiveInteger(0, 1);

    const filmCommentsCount = (hasComments) ? getRandomPositiveInteger(1, MAX_COMMENTS_ON_FILM) : 0;

    totalCommentsCount += filmCommentsCount;//

    return {
      id: String(index + 1),
      comments: (hasComments) ? Array.from({ length: filmCommentsCount }, (_value, commentIndex) => String(totalCommentsCount - commentIndex)) : [],
      filmInfo: film,
    };
  });
};

export { generateFilms };
