import {UpdateType} from '../consts';
import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #openPopup = null;
  #filmComponent = null;

  #film = null;
  #filmsModel = null;

  constructor(filmListContainer, openPopup, filmsModel) {
    this.#filmListContainer = filmListContainer;
    this.#openPopup = openPopup;
    this.#filmsModel = filmsModel;
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

  #handleWatchlistClick = () => {
    this.#filmsModel.updateFilm(
      UpdateType.MINOR, {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
  };

  #handleWatchedClick = () => {
    this.#filmsModel.updateFilm(
      UpdateType.MINOR, {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
  };

  #handleFavoriteClick = () => {
    this.#filmsModel.updateFilm(
      UpdateType.MINOR,{...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
  };
}
