import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

const getDateForPopup = (date) => dayjs(date).format('DD MMMM YYYY');

const getValidRuntime = (runtime) => runtime > 60 ? `${Math.floor(runtime/60)} h ${runtime%60} m` : `${runtime} m`;

const getCommentTemplate = (comment) => `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="${comment.emotion}" width="55" height="55" alt="emoji-${comment.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${dayjs(comment.date).format('YYYY/MM/DD HH:MM')}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;


const createFilmDetailsTemplate = (film) => {
  const isActive = (active) =>
    active
      ? 'film-details__control-button--active'
      :'';
  const comments = film['comments'];
  const commentsTemplate = comments
    .map((comment) => getCommentTemplate(comment))
    .join('');
  return (
    `<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./${film.film_info.poster}" alt="">
        <p class="film-details__age">${film.film_info.age_rating}+</p>
      </div>
      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${film.film_info.title}</h3>
            <p class="film-details__title-original">${film.film_info.alternative_title}</p>
          </div>
          <div class="film-details__rating">
            <p class="film-details__total-rating">${film.film_info.total_rating}</p>
          </div>
        </div>
        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${film.film_info.director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${film.film_info.writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${film.film_info.actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${getDateForPopup(film.film_info.release.date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${getValidRuntime(film.film_info.runtime)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${film.film_info.release.release_country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
              <span class="film-details__genre">${film.film_info.genre}</span></td>
          </tr>
        </table>
        <p class="film-details__film-description">${film.film_info.description}</p>
      </div>
    </div>
    <section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isActive(film.user_details.watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched ${isActive(film.user_details.favorite)}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite ${isActive(film.user_details.already_watched)}" id="favorite" name="favorite">Add to favorites</button>
    </section>
  </div>
  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>
      <ul class="film-details__comments-list">${commentsTemplate}</ul>
      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
          <img src="images/emoji/smile.png" width="55" height="55" alt="emoji-smile">
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">Great movie!</textarea>
        </label>
        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" checked>
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>
    </section>
  </div>
</form>
</section>`  );
};

export default class FilmDetailsView extends AbstractView {

  #film = null;
  constructor (film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film);
  }

  get closeButton() {
    return this.element.querySelector('.film-details__close-btn');
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.closeButton.addEventListener('click', this.#closeClickHandler);
  };

  removeCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.closeButton.removeEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = () => {
    this._callback.closeClick();
  };
}
