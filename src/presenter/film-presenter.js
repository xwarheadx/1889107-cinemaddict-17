import {UpdateType, TimeLimit} from '../consts.js';
import {render, replace, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FilmCardView from '../view/film-card-view.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #openPopup = null;
  #filmsModel = null;
  #uiBlocker = null;

  #film = null;
  #filmComponent = null;

  constructor(filmListContainer, openPopup, filmsModel) {
    this.#filmListContainer = filmListContainer;
    this.#openPopup = openPopup;
    this.#filmsModel = filmsModel;
    this.#uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmCardView(film);

    this.#filmComponent.setOpenClickHandler(() => {
      this.#openPopup(film);
    });
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  setControlsAborting = () => {
    this.#filmComponent.shakeControls(() => {
      this.#filmComponent.updateElement({
        isDisabled: false,
      });
    });
  };

  setPopupControlsAborting = (detailsComponent) => {
    detailsComponent.shakeControls(detailsComponent.resetFormState);
  };

  setAddAborting = (detailsComponent) => {
    detailsComponent.shake(detailsComponent.resetFormState);
  };

  setDeleteAborting = (detailsComponent, target) => {
    const parentBlock = target.closest('.film-details__comment');

    detailsComponent.shakeCommentDelete(detailsComponent.resetFormState, parentBlock);
  };

  #handleWatchlistClick = async () => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...this.#film, watchlist: !this.#film.watchlist},
      );
    } catch(err) {
      this.setControlsAborting();
    }

    this.#uiBlocker.unblock();
  };

  #handleWatchedClick = async () => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...this.#film, watched: !this.#film.watched},
      );
    } catch(err) {
      this.setControlsAborting();
    }

    this.#uiBlocker.unblock();
  };

  #handleFavoriteClick = async () => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...this.#film, favorite: !this.#film.favorite},
      );
    } catch(err) {
      this.setControlsAborting();
    }

    this.#uiBlocker.unblock();
  };
}
