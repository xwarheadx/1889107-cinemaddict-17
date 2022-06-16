import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import AbstractView from '../framework/view/abstract-view.js';
import {formatDescription} from '../utils.js';

dayjs.extend(duration);

const createFilmCardTemplate = (film) => (`<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${film.film_info.title}</h3>
    <p class="film-card__rating">${film.film_info.total_rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(film.film_info.release.date).format('YYYY')}</span>
      <span class="film-card__duration">${dayjs.duration(film.film_info.runtime, 'minutes').format('H[h] m[m]')}</span>
      <span class="film-card__genre">${film.film_info.genre[0]}</span>
    </p>
    <img src="./${film.film_info.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${formatDescription (film.film_info.description)}</p>
      <span class="film-card__comments">${film.comments.length} comments</span>
  </a>
  <div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.userDetails.watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${film.userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
  </div>
</article>`);

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor (film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setOpenClickHandler = (callback) => {
    this._callback.openClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #openClickHandler = () => {
    this._callback.openClick();
  };

  #watchlistClickHandler = () => {
    this._callback.watchlistClick();
  };

  #watchedClickHandler = () => {
    this._callback.watchedClick();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };
}
