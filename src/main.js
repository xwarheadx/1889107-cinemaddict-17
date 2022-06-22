import {remove, render} from './framework/render.js';
import CommentsApiService from './api/comments-api-service.js';
import FilmsApiService from './api/films-api-service.js';
import CommentsModel from './model/comments-model.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import StatisticsView from './view/statistics-view.js';


const AUTHORIZATION = 'Basic iddqd1315idkfa1';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const statisticsView = new StatisticsView(filmsModel.films);

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const mainPresenter = new MainPresenter(siteMainElement, filterModel, filmsModel, commentsModel);
render(statisticsView, siteFooterElement);

mainPresenter.init();
filterPresenter.init();
filmsModel.init()
  .finally(() => {
    remove(statisticsView);
    render(new StatisticsView(filmsModel.films), siteFooterElement);
  });
