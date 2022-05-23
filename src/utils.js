import {FilterType} from '../src/consts';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const filter = {
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film['user_details']['watchlist']),
  [FilterType.HISTORY]: (films) => films.filter((film) => film['user_details']['already_watched']),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film['user_details']['favorite']),
};

export {filter};
