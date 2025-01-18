import HeaderProfileView from './view/header-profile-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import FilterView from './view/filter-view.js';
import { render } from './render.js';


const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');


render(new HeaderProfileView(), siteHeaderElement);
render(new FooterStatisticsView(), siteFooterElement);
render(new FilterView(), siteMainElement);

