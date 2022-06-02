import {render} from './framework/render.js';
import {generateFilter} from './mock/filter-mock.js';
import FilmsModel from './model/films-model.js';
import MainPresenter from './presenter/main-presenter.js';
import MainNavigationView from './view/main-navigation-view.js';
import ProfileView from './view/profile-view.js';
import StatisticsView from './view/statistics-view.js';

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const filters = generateFilter(filmsModel.films);
const filmsPresenter = new MainPresenter(siteMainElement, filmsModel);

render(new ProfileView(), siteHeaderElement);
render(new MainNavigationView(filters), siteMainElement);
render(new StatisticsView(), siteFooterElement);

filmsPresenter.init();
