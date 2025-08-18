const FILM_COUNT = 24;

const FILM_COUNT_PER_STEP = 5;

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const FILTER_TYPE_ALL_NAME = 'All movies';

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const UserStatusValue = {
  NOVICE: 1,
  FAN: 11,
  MOVIE_BUFF: 21,
};

const UserStatusTitle = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff'
};

/**5.2.1 Поправит шаблон сортировки
- Добавляем data-атрибуты, чтобы при клике можно было определить, какой тип сортировки выбрал пользователь
- Все возможные типы сортировки описываем в константе */
const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export {
  FILM_COUNT,
  EMOTIONS,
  FILM_COUNT_PER_STEP,
  FilterType,
  UserStatusTitle,
  UserStatusValue,
  FILTER_TYPE_ALL_NAME,
  SortType
};
