import {render} from './framework/render.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ProfileView from './view/profile-view.js';
import StatisticsView from './view/statistics-view.js';

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsPresenter = new MainPresenter(siteMainElement, filmsModel, filterModel);

render(new ProfileView(), siteHeaderElement);
render(new StatisticsView(), siteFooterElement);

filterPresenter.init();
filmsPresenter.init();
