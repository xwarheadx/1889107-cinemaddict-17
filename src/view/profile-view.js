import AbstractView from '../framework/view/abstract-view.js';
import {getProfileRating} from '../utils.js';

const createProfileTemplate = (count) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getProfileRating(count)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);

export default class ProfileView extends AbstractView {
  #countWatchedFilms = null;

  constructor(countWatchedFilms) {
    super();
    this.#countWatchedFilms = countWatchedFilms;
  }

  get template() {
    return createProfileTemplate(this.#countWatchedFilms);
  }
}
