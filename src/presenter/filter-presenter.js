import {FilterType, UpdateType} from '../consts.js';
import {selectedFilter} from '../utils.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';
import MainNavigationView from '../view/main-navigation-view.js';


export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filteredFilms() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: '',
        href: 'all',
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: selectedFilter[FilterType.WATCHLIST](films).length,
        href: 'watchlist',
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: selectedFilter[FilterType.HISTORY](films).length,
        href: 'history',
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: selectedFilter[FilterType.FAVORITES](films).length,
        href: 'favorites',
      },
    ];
  }

  init = () => {
    const filteredFilms = this.filteredFilms;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new MainNavigationView(filteredFilms, this.#filterModel.selectedFilter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.selectedFilter === filterType) {
      return;
    }

    this.#filterModel.setSelectedFilter(UpdateType.MAJOR, filterType);
  };
}
