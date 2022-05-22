import {render} from './framework/render.js';
import FilmsModel from './model/films-model.js';
import FilmsPresenter from './presenter/films-presenter.js';
import MainNavigationView from './view/main-navigation-view.js';
import ProfileView from './view/profile-view.js';
import StatisticsView from './view/statistics-view.js';

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel);

render(new ProfileView(), siteHeaderElement);
render(new MainNavigationView(), siteMainElement);
render(new StatisticsView(), siteFooterElement);

filmsPresenter.init();
