import {FILM_COUNT, UpdateType} from '../consts';
import Observable from '../framework/observable.js';
import {generateFilm} from '../mock/film-card-mock';

export default class FilmsModel extends Observable {
  #films = Array.from({length: FILM_COUNT}, generateFilm);

  get films() {
    return [...this.#films];
  }

  set films(value) {
    this.#films = value;

    this._notify(UpdateType.MAJOR, value);
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
