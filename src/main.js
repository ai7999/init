import HeaderProfileView from './view/header-profile-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import FilterView from './view/filter-view.js';

import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';

import { render } from './framework/render.js';

//import { generateFilms } from './mock/film';
//import { generateComments } from './mock/comment';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel);

render(new HeaderProfileView(), siteHeaderElement);
render(new FilterView(), siteMainElement);
render(new FooterStatisticsView(), siteFooterStatisticsElement);

filmsPresenter.init();

/*const films = generateFilms();
const comments = generateComments(films);

console.log(films);
console.log(comments);*/
