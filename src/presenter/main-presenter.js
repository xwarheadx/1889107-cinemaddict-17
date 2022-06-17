import {FILM_COUNT_PER_STEP, SortType, UpdateType, FilterType} from '../consts.js';
import {filter, sortFilmByDate, sortFilmByRating} from '../utils.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import CommentsModel from '../model/comments-model.js';
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
  #filterModel = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsListСontainerView();
  #sortComponent = null;
  #EmptyFilmComponent = null;
  #showMoreButtonComponent = null;

  #listFilms = [];
  #renderedFilms = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #film = null;
  #currentSortType = SortType.DEFAULT;
  #commentsModel = new CommentsModel();
  #filterType = FilterType.ALL;

  constructor(filmsContainer, filmsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmsComponent();
  };

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilms + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilms, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilms = newRenderedFilmCount;

    if (this.#renderedFilms >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilmsList();
        this.#renderFilmsComponent();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsList({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmsComponent();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsList({resetRenderedFilmCount: true});
    this.#renderFilmsComponent();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainerComponent.element, this.#openPopup, this.#filmsModel);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderEmptyFilmList = () => {
    this.#EmptyFilmComponent = new FilmsListEmptyView(this.#filterType);
    render(this.#EmptyFilmComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
  };

  #openPopup = (film) => {
    this.#film = film;

    if (this.#filmDetailsComponent) {
      this.#closePopup();
    }
    this.#film.comments = this.#film.comments.map((_, id) => this.#commentsModel.comments[id]);
    this.#filmDetailsComponent = new FilmDetailsView(film);
    this.#filmDetailsComponent.setCloseClickHandler(this.#closePopup);
    this.#filmDetailsComponent.setWatchlistPopupClickHandler(this.#watchlistPopupClickHandler);
    this.#filmDetailsComponent.setWatchedPopupClickHandler(this.#watchedPopupClickHandler);
    this.#filmDetailsComponent.setFavoritePopupClickHandler(this.#favoritePopupClickHandler);
    this.#filmDetailsComponent.setFormSubmitHandler(this.#handleCommentAddHandler);
    this.#filmDetailsComponent.setDeleteClickHandler(this.#handleCommentDeleteHandler);
    render(this.#filmDetailsComponent, document.body);
    document.addEventListener('keydown', this.#onEscKeyDown);
    document.body.classList.add('hide-overflow');
    this.#film.comments = this.#film.comments.map((el) => el.id);
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

  #clearFilmsList = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#EmptyFilmComponent);
    remove(this.#showMoreButtonComponent);
    if (this.#EmptyFilmComponent) {
      remove(this.#EmptyFilmComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilms = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilms = Math.min(filmCount, this.#renderedFilms);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmsComponent = () => {
    const filmCount = this.films.length;
    render(this.#filmsComponent, this.#filmsContainer);

    if (filmCount === 0) {
      this.#renderEmptyFilmList();
      return;
    }

    this.#renderSort();
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);
    this.#renderFilms(this.films.slice(0, Math.min(filmCount, this.#renderedFilms)));

    if (filmCount > this.#renderedFilms) {
      this.#renderShowMoreButton();
    }
  };

  #watchlistPopupClickHandler = () => {
    const film = {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}};

    this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    this.#openPopup(film);
  };

  #watchedPopupClickHandler = () => {
    const film = {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}};

    this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    this.#openPopup(film);
  };

  #favoritePopupClickHandler = () => {
    const film = {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}};
    this.#filmsModel.updateFilm(UpdateType.MINOR, film);
    this.#openPopup(film);
  };

  #handleCommentAddHandler = (film, comment) => {
    film.comments.push(comment);
    this.#commentsModel.addComment(UpdateType.PATCH, comment, film);
    this.#filmsModel.updateFilm(UpdateType.PATCH, film);
    this.#openPopup(film);
  };

  #handleCommentDeleteHandler = (film, comments, id) => {
    const index = comments.findIndex((item) => String(item.id) === id);

    film.comments.splice(index, 1);
    this.#filmsModel.updateFilm(UpdateType.PATCH, film);
    this.#openPopup(film);
  };
}

