import {FilterType} from '../consts.js';
import AbstractView from '../framework/view/abstract-view.js';

const EmptyFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies in your watchlist',
  [FilterType.HISTORY]: 'There are no watched movies',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createFilmsEmptyTemplate = (filterType) => (
  `<section class="films-list"><h2 class="films-list__title">
      ${EmptyFilmsTextType[filterType]}
    </h2></section>`);
export default class FilmsListEmptyView extends AbstractView {

  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createFilmsEmptyTemplate(this.#filterType);
  }
}
