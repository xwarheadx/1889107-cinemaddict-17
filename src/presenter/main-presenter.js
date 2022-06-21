import {FILM_COUNT_PER_STEP, SortType, UpdateType, FilterType, TimeLimit} from '../consts.js';
import {selectedFilter, sortFilmByDate, sortFilmByRating, sortFilmByComments} from '../utils.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import FilmsView from '../view/films-view.js';
import LoadingView from '../view/loading-view.js';
import ProfileView from '../view/profile-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');

export default class MainPresenter
{
  #filmsContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #filmDetailsComponent = null;

  #filmsComponent = new FilmsView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #emptyFilmComponent = null;
  #showMoreButtonComponent = null;
  #profileView = null;


  #renderedFilms = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #filmTopRatedPresenter = new Map();
  #filmMostCommentedPresenter = new Map();
  #film = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;
  #uiBlocker = null;

  constructor(filmsContainer, filterModel, filmsModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);

    this.#uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  }

  get films() {
    this.#filterType = this.#filterModel.selectedFilter;
    const films = this.#filmsModel.films;
    const filteredFilms = selectedFilter[this.#filterType](films);

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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmsComponent();
        break;
    }
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderProfileButton = () => {
    const films = this.#filmsModel.films;
    const watchedFilms = selectedFilter[FilterType.HISTORY](films).length;

    if (watchedFilms === 0) {
      return;
    }

    this.#profileView = new ProfileView(watchedFilms);

    render(this.#profileView, siteHeaderElement);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsList({resetRenderedFilmCount: true});
    this.#renderFilmsComponent();
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsComponent.mainListElement, this.#openPopup, this.#filmsModel);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderTopRatedFilm = (film) => {
    const filmTopRatedPresenter = new FilmPresenter(this.#filmsComponent.topRatedListElement, this.#openPopup, this.#filmsModel);

    filmTopRatedPresenter.init(film);
    this.#filmTopRatedPresenter.set(film.id, filmTopRatedPresenter);
  };

  #renderTopRatedFilms = (films) => {
    films.forEach((film) => this.#renderTopRatedFilm(film));
  };

  #renderMostCommentedFilm = (film) => {
    const filmMostCommentedPresenter = new FilmPresenter(this.#filmsComponent.mostCommentedListElement, this.#openPopup, this.#filmsModel);

    filmMostCommentedPresenter.init(film);
    this.#filmMostCommentedPresenter.set(film.id, filmMostCommentedPresenter);
  };

  #renderMostCommentedFilms = (films) => {
    films.forEach((film) => this.#renderMostCommentedFilm(film));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderEmptyFilmList = () => {
    this.#emptyFilmComponent = new FilmsListEmptyView(this.#filterType);
    render(this.#emptyFilmComponent, this.#filmsComponent.mainListElement, RenderPosition.AFTERBEGIN);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#showMoreButtonComponent, this.#filmsComponent.mainListElement, RenderPosition.AFTEREND);
  };

  #openPopup = async (film) => {
    this.#film = film;

    if (this.#filmDetailsComponent) {
      this.#closePopup();
    }

    const comments = await this.#commentsModel.getComments(film.id);

    this.#filmDetailsComponent = new FilmDetailsView(this.#film, comments);
    this.#filmDetailsComponent.setCloseClickHandler(this.#closePopup);
    this.#filmDetailsComponent.setWatchlistPopupClickHandler(this.#watchlistPopupClickHandler);
    this.#filmDetailsComponent.setWatchedPopupClickHandler(this.#watchedPopupClickHandler);
    this.#filmDetailsComponent.setFavoritePopupClickHandler(this.#favoritePopupClickHandler);
    this.#filmDetailsComponent.setAddSubmitHandler(this.#handleCommentAddHandler);
    this.#filmDetailsComponent.setDeleteClickHandler(this.#handleCommentDeleteHandler);

    render(this.#filmDetailsComponent, siteBodyElement);

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

  #clearFilmsList = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#filmTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmTopRatedPresenter.clear();
    this.#filmMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmMostCommentedPresenter.clear();


    remove(this.#sortComponent);
    remove(this.#emptyFilmComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#profileView);

    if (this.#emptyFilmComponent) {
      remove(this.#emptyFilmComponent);
    }

    this.#renderedFilms = resetRenderedFilmCount ? FILM_COUNT_PER_STEP : Math.min(filmCount, this.#renderedFilms);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmsComponent = () => {
    const filmCount = this.films.length;
    render(this.#filmsComponent, siteMainElement);

    if (this.#isLoading) {
      this.#renderLoading();
      this.#filmsComponent.hideExtraList();
      return;
    }
    if (filmCount === 0) {
      this.#renderEmptyFilmList();
      this.#filmsComponent.hideExtraList();
      return;
    }
    this.#filmsComponent.showExtraList();

    this.#renderProfileButton();
    this.#renderSort();

    this.#renderFilms(this.films.slice(0, Math.min(filmCount, this.#renderedFilms)));

    if (filmCount > this.#renderedFilms) {
      this.#renderShowMoreButton();
    }
    this.#renderTopRatedFilms(this.films.sort(sortFilmByRating).slice(0, 2));

    this.#renderMostCommentedFilms(this.films.sort(sortFilmByComments).slice(0, 2));
  };

  #watchlistPopupClickHandler = async (film) => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...film, watchlist: !film.watchlist},
      );

      this.#filmDetailsComponent.updateElement({watchlist: !film.watchlist});
    } catch(err) {
      this.#filmPresenter.get(film.id).setPopupControlsAborting(this.#filmDetailsComponent);
    }

    this.#uiBlocker.unblock();
  };

  #watchedPopupClickHandler = async (film) => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...film, watched: !film.watched},
      );

      this.#filmDetailsComponent.updateElement({watched: !film.watched});
    } catch(err) {
      this.#filmPresenter.get(film.id).setPopupControlsAborting(this.#filmDetailsComponent);
    }

    this.#uiBlocker.unblock();
  };

  #favoritePopupClickHandler = async (film) => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...film, favorite: !film.favorite},
      );

      this.#filmDetailsComponent.updateElement({favorite: !film.favorite});
    } catch(err) {
      this.#filmPresenter.get(film.id).setPopupControlsAborting(this.#filmDetailsComponent);
    }

    this.#uiBlocker.unblock();
  };

  #handleCommentAddHandler = async (film, comment) => {
    this.#uiBlocker.block();

    try {
      const newComments = await this.#commentsModel.addComment(UpdateType.PATCH, comment, film);
      await this.#filmsModel.updateFilm(UpdateType.MINOR, {...film});
      this.#filmDetailsComponent.updateElementByComments(newComments, {comments: film.comments});
    } catch(err) {
      this.#filmPresenter.get(film.id).setAddAborting(this.#filmDetailsComponent);
    }

    this.#uiBlocker.unblock();
  };

  #handleCommentDeleteHandler = async (film, id, target, comments) => {
    this.#uiBlocker.block();

    target.setAttribute('disabled', 'disabled');
    target.textContent = 'Deleting...';
    const newComments = comments.filter((comment) => comment.id !== id);

    try {
      await this.#commentsModel.deleteComment(UpdateType.PATCH, id, film, comments);
      await this.#filmsModel.updateFilm(UpdateType.MINOR, {...film});
      this.#filmDetailsComponent.updateElementByComments(newComments, {comments: film.comments});
    } catch(err) {
      target.textContent = 'Delete';
      target.removeAttribute('disabled', 'disabled');
      this.#filmPresenter.get(film.id).setDeleteAborting(this.#filmDetailsComponent, target);
    }

    this.#uiBlocker.unblock();
  };
}
