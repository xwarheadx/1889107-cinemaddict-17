import {FILM_COUNT_PER_STEP} from '../consts.js';
import {render} from '../render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmsListСontainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmDetailsComponent = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsСontainerComponent = new FilmsListСontainerView();

  #listFilms = [];

  #renderFilm = (film) => {
    const filmCardComponent = new FilmCardView(film);

    filmCardComponent.element.addEventListener('click', (evt) => {
      evt.stopPropagation();
      if (this.#filmDetailsComponent) {
        this.#closePopup();
      } else {
        this.#openPopup(film);
      }
    });

    render(filmCardComponent, this.#filmsСontainerComponent.element);};

  #openPopup = (film) => {
    this.#filmDetailsComponent = new FilmDetailsView(film);
    this.#filmDetailsComponent.closeButton.addEventListener('click', this.#closePopup);
    document.addEventListener('keydown', this.#onEscKeyDown);
    render(this.#filmDetailsComponent, document.body);
    document.body.classList.add('hide-overflow');
  };

  #closePopup = () => {
    this.#filmDetailsComponent.element.remove();
    this.#filmDetailsComponent.removeElement();
    this.#filmDetailsComponent.closeButton.removeEventListener('click', this.#closePopup);
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

  init = (filmsContainer, filmsModel) => {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#listFilms = [...this.#filmsModel.films];

    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsСontainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < FILM_COUNT_PER_STEP; i++) {
      this.#renderFilm(this.#listFilms[i]);
    }

    render(new ShowMoreButtonView(), this.#filmsListComponent.element);
  };
}
