import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../consts.js';

const EmptyFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies in our watchlist',
  [FilterType.HISTORY]: 'There are no watched movies',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createFilmsEmptyTemplate = (filterType) => {
  const emptyTextValue = EmptyFilmsTextType[filterType];

  return (
    `<section class="films-list"><h2 class="films-list__title">
      ${emptyTextValue}
    </h2></section>`);
};
export default class FilmsListEmptyView extends AbstractView {

  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createFilmsEmptyTemplate();
  }
}
