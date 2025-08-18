import AbstractView from '../framework/view/abstract-view.js';
import { createFilmCardControlsTemplate } from './film-card-controls-template.js';
import { createFilmCardInfoTemplate } from './film-card-info-template.js';

const createFilmCardTemplate = ({ filmInfo, comments, userDetails }) =>
  `
    <article class="film-card">
      ${createFilmCardInfoTemplate(filmInfo, comments.length)}
      ${createFilmCardControlsTemplate(userDetails)}
    </article>
  `;

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  /**5.1.6 Добавит логику обновления задачи
  - Передадим функцию обновления из презентера доски в презентер задачи
  - В презентере задачи опишем обработчики клика по кнопкам "Архив" и "В избранное"
  - В представлении опишем механизм подписки на эти события
  - Передадим из презентера задачи в представление обработчики */
  setCardClickHandler(callback) {
    this._callback.cardClick = callback;
    this.element.querySelector('a').addEventListener('click', this.#cardClickHandler);
  }

  setWatchlistBtnClickHandler(callback) {
    this._callback.watchlistBtnClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistBtnClickHandler);
  }

  setWatchedBtnClickHandler(callback) {
    this._callback.watchedBtnClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedBtnClickHandler);
  }

  setFavoriteBtnClickHandler(callback) {
    this._callback.favoriteBtnClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteBtnClickHandler);
  }

  #cardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cardClick();
  };

  #watchlistBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistBtnClick();
  };

  #watchedBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedBtnClick();
  };

  #favoriteBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteBtnClick();
  };
}
