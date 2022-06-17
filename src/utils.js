import {FilterType, MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH, DESCRIPTION_SLICE_LENGTH} from '../src/consts';
import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film['userDetails']['watchlist']),
  [FilterType.HISTORY]: (films) => films.filter((film) => film['userDetails']['alreadyWatched']),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film['userDetails']['favorite']),
};

export {filter};


const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const getWeightForNullRating = (ratingA, ratingB) => {
  if (ratingA === null && ratingB === null) {
    return 0;
  }

  if (ratingA === null) {
    return 1;
  }

  if (ratingB === null) {
    return -1;
  }

  return null;
};

export const sortFilmByDate = (filmA, filmB) => {
  const weight = getWeightForNullRating(filmA['film_info']['release']['date'], filmB['film_info']['release']['date']);

  return weight ?? dayjs(filmB['film_info']['release']['date']).diff(dayjs(filmA['film_info']['release']['date']));
};

export const sortFilmByRating = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA['film_info']['total_rating'], filmB['film_info']['total_rating']);

  return weight ?? filmB['film_info']['total_rating'] - filmA['film_info']['total_rating'];
};

export const formatDescription = (description) => description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(MIN_DESCRIPTION_LENGTH, DESCRIPTION_SLICE_LENGTH)}...` : description;
