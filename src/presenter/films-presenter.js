import {FILM_COUNT} from '../consts.js';
import {render} from '../render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmsListСontainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

export default class FilmsPresenter {
  filmsComponent = new FilmsView();
  filmsListComponent = new FilmsListView();
  filmsСontainerComponent = new FilmsListСontainerView();

  init = (filmsContainer) => {
    this.filmsContainer = filmsContainer;

    render(this.filmsComponent, this.filmsContainer);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(this.filmsСontainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < FILM_COUNT; i++) {
      render(new FilmCardView(), this.filmsСontainerComponent.getElement());
    }

    render(new ShowMoreButtonView(), this.filmsListComponent.getElement());
  };
}
