import dayjs from 'dayjs';
import {createElement} from '../render.js';

const createFilmCardTemplate = (film) => (`<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${film.film_info.title}</h3>
    <p class="film-card__rating">${film.film_info.total_rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(film.film_info.release.date).format('YYYY')}</span>
      <span class="film-card__duration">${film.film_info.runtime}m</span>
      <span class="film-card__genre">${film.film_info.genre[0]}</span>
    </p>
    <img src="./${film.film_info.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${film.film_info.description}</p>
      <span class="film-card__comments">${film.comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.user_details.watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.user_details.already_watched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${film.user_details.favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
  </div>
</article>`);

export default class FilmCardView {
  constructor (film) {
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
