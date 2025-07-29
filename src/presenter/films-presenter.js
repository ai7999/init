import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import NoFilmView from '../view/no-film-view.js';
import { render, RenderPosition } from '../framework/render.js';
import { FILM_COUNT_PER_STEP } from '../const.js';

export default class FilmsPresenter {
  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filmDetailsComponent = null;

  #films = [];
  //- Заведем счетчик показанных задач
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #sortComponent = new SortView();
  #noFilmComponent = new NoFilmView();
  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #filmButtonMoreComponent = new FilmButtonMoreView();

  constructor(container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }
  /*
    Первым делом подготовим рабочее место — заведём отдельный метод #renderFilmBoard(), который вберёт в себя логику
    по работе со списком фильмов. Пока что перенесём туда все render()-вызовы всего, что касается списка фильмов, из
    метода .init():
    */

  init = () => {
    this.#films = [...this.#filmsModel.get()];

    this.#renderFilmBoard();
  };

  #renderFilmBoard = () => {
    if (this.#films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    this.#renderFilmList();
  };

  #renderNoFilms = () => {
    render(this.#noFilmComponent, this.#container);
  };

  #renderSort = (container) => {
    render(this.#sortComponent, container);
  };

  #renderFilmListContainer = (container) => {
    render(this.#filmsComponent, container);
    render(this.#filmListComponent, this.#filmsComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
  };

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP), this.#filmListContainerComponent.element);

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderLoadMoreButton(this.#filmListComponent.element);
    }
  };

  #renderFilms(from, to, container) {
    //render(this.#sortComponent, this.#container);
    //render(this.#filmsComponent, this.#container);
    this.#films.slice(from, to).forEach((film) => this.#renderFilm(film, container));
  }

  #renderFilm = (film, container) => {
    const filmCardComponent = new FilmCardView(film);

    filmCardComponent.setCardClickHandler(() => {
      this.#addFilmDetailsComponent(film);
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    render(filmCardComponent, container);
  };

  #renderLoadMoreButton = (container) => {
    render(this.#filmButtonMoreComponent, container, RenderPosition.BEFOREEND);

    this.#filmButtonMoreComponent.setButtonMoreClickHandler(this.#handleLoadMoreButtonClick);
  };

  //- По клику будем допоказывать задачи, опираясь на счётчик
  //5.1.1 Выделит в презентере рендеринг компонентов
  //Разделим отрисовку компонентов доски на отдельные методы так, чтобы каждый решал ровно одну задачу
  #handleLoadMoreButtonClick = () => {

    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP, this.#filmListContainerComponent.element);

    // Главное на каждый клик наращивать количество уже показанных фильмов
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;


    //- Если показаны все задачи - скроем кнопку
    if (this.#renderedFilmCount >= this.#films.length) {
      this.#filmButtonMoreComponent.element.remove();
      this.#filmButtonMoreComponent.removeElement();
    }
  };

  #renderFilmDetails = (film) => {
    const comments = [...this.#commentsModel.get(film)];
    this.#filmDetailsComponent = new FilmDetailsView(film, comments);

    this.#filmDetailsComponent.setCloseButtonHandler(() => {
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    render(this.#filmDetailsComponent, this.#container.parentElement);
  };

  #addFilmDetailsComponent = (film) => {
    this.#renderFilmDetails(film);
    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetailsComponent = () => {
    this.#filmDetailsComponent.element.remove();
    this.#filmDetailsComponent = null;
    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}
