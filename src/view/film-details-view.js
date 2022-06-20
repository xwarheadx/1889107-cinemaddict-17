import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import he from 'he';
import {EMOTIONS, SHAKE_CLASS_NAME, SHAKE_ANIMATION_TIMEOUT} from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const createFilmDetailsTemplate = (film, comments) => {
  const {isDisabled} = film;

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
            <td class="film-details__cell">${dayjs(film.film_info.release.date).format('DD MMMM YYYY')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${dayjs.duration(film.film_info.runtime, 'minutes').format('H[h] m[m]')}</td>
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
    <button type="button" class="film-details__control-button ${film.watchlist ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist" ${isDisabled ? 'disabled' : ''}>Add to watchlist</button>
    <button type="button" class="film-details__control-button ${film.watched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched" ${isDisabled ? 'disabled' : ''}>Already watched</button>
    <button type="button" class="film-details__control-button ${film.favorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite" ${isDisabled ? 'disabled' : ''}>Add to favorites</button>
  </section>
  </div>
  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>
      <ul class="film-details__comments-list">${comments.map((comment) => `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
      ${comment.emotion ? `<img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">` : ''}
      </span>
          <div>
            <p class="film-details__comment-text">${`${he.encode(comment.comment)}`}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${dayjs(comment.date).fromNow()}</span>
              <button class="film-details__comment-delete" data-button-delete="${comment.id}">Delete</button>
            </p>
          </div>
        </li>`).join('')}
        </ul>
        <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">${film.commentEmotion ? `<img src="./images/emoji/${film.commentEmotion}.png" width="55" height="55" alt="emoji">` : ''}
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${film.commentText ? `${he.encode(film.commentText)}` : ''}</textarea>
        </label>
        <div class="film-details__emoji-list">
          ${EMOTIONS.map((el) => (`<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${el}" value="${el}" ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-${el}">
                <img src="./images/emoji/${el}.png" width="30" height="30" alt="emoji-${el}">
              </label>`)).join('')}
        </div>
    </div>
  </section>
</div>
</form>
</section>`);
};

export default class FilmDetailsView extends AbstractStatefulView {
  _scrollTop = 0;

  constructor (film, comments) {
    super();
    this._state = FilmDetailsView.parseFilmToState(film);
    this._comments = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._state, this._comments);
  }

  get controls() {
    return this.element.querySelector('.film-details__controls');
  }

  _setStateComments = (updateComments, update) => {
    this._comments = updateComments;
    this._state = {...this._state, ...update};
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setWatchlistPopupClickHandler(this._callback.watchlistPopupClick);
    this.setWatchedPopupClickHandler(this._callback.watchedPopupClick);
    this.setFavoritePopupClickHandler(this._callback.favoritePopupClick);
    this.setAddSubmitHandler(this._callback.addSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.element.scrollTop = this._scrollTop;
  };

  shakeControls(callback) {
    this.controls.classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      this.controls.classList.remove(SHAKE_CLASS_NAME);
      callback?.();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakeCommentDelete(callback, block) {
    block.classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      block.classList.remove(SHAKE_CLASS_NAME);
      callback?.();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  resetFormState = () => {
    this.updateElement({
      isDisabled: false,
    });
  };

  updateElementByComments = (updateComments, update) => {
    if (!updateComments) {
      return;
    }

    this._setStateComments(updateComments, update);

    this.#rerenderElementByComments();
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  setWatchlistPopupClickHandler = (callback) => {
    this._callback.watchlistPopupClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistPopupClickHandler);
  };

  setWatchedPopupClickHandler = (callback) => {
    this._callback.watchedPopupClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedPopupClickHandler);
  };

  setFavoritePopupClickHandler = (callback) => {
    this._callback.favoritePopupClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoritePopupClickHandler);
  };

  setAddSubmitHandler = (callback) => {
    this._callback.addSubmit = callback;
    this.element.addEventListener('keydown', this.#commentAddSubmitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;

    const deleteButtons = this.element.querySelectorAll('.film-details__comment-delete');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', this.#commentDeleteClickHandler);
    });
  };

  #rerenderElementByComments = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();
    this._setState({
      commentText: '',
      commentEmotion: '',
    });
    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  };

  #closeClickHandler = () => {
    this._callback.closeClick();
  };

  #watchlistPopupClickHandler = () => {
    this._scrollTop = this.element.scrollTop;
    this._callback.watchlistPopupClick(this._state);
  };

  #watchedPopupClickHandler = () => {
    this._scrollTop = this.element.scrollTop;
    this._callback.watchedPopupClick(this._state);
  };

  #favoritePopupClickHandler = () => {
    this._scrollTop = this.element.scrollTop;
    this._callback.favoritePopupClick(this._state);
  };

  #emotionChangeHandler = (evt) => {
    this._scrollTop = this.element.scrollTop;
    this.updateElement({
      commentEmotion: evt.target.value,
    });
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._scrollTop = this.element.scrollTop;
    this._setState({
      commentText: evt.target.value,
    });
  };

  #commentAddSubmitHandler = (evt) => {
    if ((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') {
      this._scrollTop = this.element.scrollTop;
      this._setState({
        isDisabled: true,
      });
      this._callback.addSubmit(FilmDetailsView.parseStateToFilm(this._state), FilmDetailsView.newComment(this._state));
    }
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    const idDelete = evt.target.dataset.buttonDelete;
    const target = evt.target;
    this._scrollTop = this.element.scrollTop;

    this._callback.deleteClick(FilmDetailsView.parseStateToFilm(this._state), idDelete, target, this._comments);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emotionChangeHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  static parseFilmToState = (film) => (
    {...film,
      commentText: '',
      commentEmotion: '',
      isDisabled: false,
    }
  );

  static parseStateToFilm = (state) => {
    const film = {
      ...state
    };

    delete film.commentText;
    delete film.commentEmotion;
    delete film.isDisabled;

    return film;
  };

  static newComment = (state) => ({
    comment: state.commentText,
    emotion: state.commentEmotion,
  });
}
