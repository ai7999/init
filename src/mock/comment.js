import { getRandomPositiveInteger, getRandomValue, formatStringToDateWithTime } from '../util.js';
import {
  DaysDuration,
  names,
  surnames,
  emotions,
  comment,
} from './const.js';

const getDate = () => {
  const date = new Date();

  date.setDate(
    date.getDate() - getRandomPositiveInteger(DaysDuration.MIN, DaysDuration.MAX)
  );

  return date.toISOString();
};

const generateComment = () => ({
  author: `${getRandomValue(names)} ${getRandomValue(surnames)}`,
  comment,
  date: formatStringToDateWithTime(getDate()),
  emotion: getRandomValue(emotions)
});

const getCommentCount = (films) => films.reduce((count, film) => count + film.comments.length, 0);

const generateComments = (films) => {
  const commentCount = getCommentCount(films);

  return Array.from({ length: commentCount }, (_value, index) => {
    const commentItem = generateComment();

    return {
      id: String(index + 1),
      ...commentItem,
    };
  });
};

export { generateComments };
