import {FILM_COUNT_PER_STEP} from '../consts.js';
import {updateItem} from '../utils.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmsListСontainerView from '../view/films-list-container-view.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

export default class MainPresenter
{
  #filmsContainer = null;
  #filmsModel = null;
  #filmDetailsComponent = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsListСontainerView();
  #sortComponent = new SortView();
  #EmptyFilmComponent = new FilmsListEmptyView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #listFilms = [];
  #renderedFilms = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #film = null;

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#listFilms = [...this.#filmsModel.films];

    this.#renderFilmsComponent();
  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilms, this.#renderedFilms + FILM_COUNT_PER_STEP);

    this.#renderedFilms += FILM_COUNT_PER_STEP;

    if (this.#renderedFilms >= this.#listFilms.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleFilmChange = (updatedFilm) => {
    this.#listFilms = updateItem(this.#listFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainerComponent.element, this.#openPopup, this.#handleFilmChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (from, to) => {
    this.#listFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  };

  #renderEmptyFilmList = () => {
    render(this.#EmptyFilmComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #openPopup = (film) => {
    this.#film = film;

    if (this.#filmDetailsComponent) {
      this.#closePopup();
    }

    this.#filmDetailsComponent = new FilmDetailsView(film);
    this.#filmDetailsComponent.setCloseClickHandler(this.#closePopup);
    this.#filmDetailsComponent.setWatchlistPopupClickHandler(this.#watchlistPopupClickHandler);
    this.#filmDetailsComponent.setWatchedPopupClickHandler(this.#watchedPopupClickHandler);
    this.#filmDetailsComponent.setFavoritePopupClickHandler(this.#favoritePopupClickHandler);
    render(this.#filmDetailsComponent, document.body);

    document.addEventListener('keydown', this.#onEscKeyDown);
    document.body.classList.add('hide-overflow');
  };

  #closePopup = () => {
    remove(this.#filmDetailsComponent);

    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.body.classList.remove('hide-overflow');
    this.#filmDetailsComponent = null;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilms = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #renderFilmsList = () => {
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);

    this.#renderFilms(0, Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP));

    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderFilmsComponent = () => {
    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#listFilms.every((film) => film.isArchive)) {
      this.#renderEmptyFilmList();
      return;
    }

    this.#renderSort();
    this.#renderFilmsList();
  };

  #watchlistPopupClickHandler = () => {
    const film = {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}};

    this.#listFilms = updateItem(this.#listFilms, film);
    this.#filmPresenter.get(film.id).init(film);
    this.#openPopup(film);
  };

  #watchedPopupClickHandler = () => {
    const film = {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}};

    this.#listFilms = updateItem(this.#listFilms, film);
    this.#filmPresenter.get(film.id).init(film);
    this.#openPopup(film);
  };

  #favoritePopupClickHandler = () => {
    const film = {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}};
    this.#listFilms = updateItem(this.#listFilms, film);
    this.#filmPresenter.get(film.id).init(film);
    this.#openPopup(film);
  };
}

