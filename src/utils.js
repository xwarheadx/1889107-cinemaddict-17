import {FilterType, MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH, DESCRIPTION_SLICE_LENGTH, profileRating} from '../src/consts';
import dayjs from 'dayjs';

export const selectedFilter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.watched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.favorite),
};

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
export const sortFilmByComments = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA['comments'].length, filmB['comments'].length);

  return weight ?? filmB['comments'].length - filmA['comments'].length;
};
export const formatDescription = (description) => description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(MIN_DESCRIPTION_LENGTH, DESCRIPTION_SLICE_LENGTH)}...` : description;

export const getProfileRating = (item) => {
  if (item >= profileRating.MOVIE_BUFF) {
    return 'Movie Buff';
  } else if (item >= profileRating.FAN && item < profileRating.MOVIE_BUFF) {
    return 'Fan';
  } else if (item > 0 && item < profileRating.FAN) {
    return 'Novice';
  }
  return '';
};
