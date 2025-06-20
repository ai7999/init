import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import NoFilmView from '../view/no-film-view.js';
import { render } from '../render.js';
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
  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #filmButtonMoreComponent = new FilmButtonMoreView();

  constructor(container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.get()];

    this.#renderFilmBoard();
  };

  /*
  Первым делом подготовим рабочее место — заведём отдельный метод #renderFilmBoard(), который вберёт в себя логику
  по работе со списком фильмов. Пока что перенесём туда все render()-вызовы всего, что касается списка фильмов, из
  метода .init():
  */
  #renderFilmBoard() {
    render(this.#sortComponent, this.#container);
    render(this.#filmsComponent, this.#container);
    render(this.#filmListComponent, this.#filmsComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);

    /*
    3.1.2 Выделит показ задач в функцию. WIP
    - Избавимся от кода отрисовки формы первой в спиcке,
    - Выделим отрисовку задач в функцию
    */
    //Ограничим первую отрисовку по минимальному количеству, чтобы не пытаться рисовать 8 задач, если всего 5
    /* this.#films.forEach((film) => {
       this.#renderFilm(film, this.#filmListContainerComponent);
     });*/
    if (this.#films.length === 0) {
      render(new NoFilmView(), this.#container);
      return;
    }
    this.#films
      .slice(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP))
      .forEach((film) => this.#renderFilm(film, this.#filmListContainerComponent));

    //render(this.#filmButtonMoreComponent, this.#filmListComponent.element);
    if (this.#films.length > FILM_COUNT_PER_STEP) {
      render(this.#filmButtonMoreComponent, this.#filmListComponent.element);

      this.#filmButtonMoreComponent.element.addEventListener('click', this.#handleFilmButtonMoreComponentClick);
    }
  }

  #renderFilm = (film, container) => {
    const filmCardComponent = new FilmCardView(film);

    const linkFilmCardElement = filmCardComponent.element.querySelector('a');

    linkFilmCardElement.addEventListener('click', () => {
      this.#addFilmDetailsComponent(film);
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    render(filmCardComponent, container.element);
  };

  #renderFilmDetails = (film) => {
    const comments = [...this.#commentsModel.get(film)];
    this.#filmDetailsComponent = new FilmDetailsView(film, comments);

    const closeButtonFilmDetailsElement = this.#filmDetailsComponent.element.querySelector('.film-details__close-btn');

    closeButtonFilmDetailsElement.addEventListener('click', () => {
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

  //- По клику будем допоказывать задачи, опираясь на счётчик
  #handleFilmButtonMoreComponentClick = (evt) => {
    evt.preventDefault();
    this.#films.slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#filmListContainerComponent));

    // Главное на каждый клик наращивать количество уже показанных фильмов
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    //- Если показаны все задачи - скроем кнопку
    if (this.#renderedFilmCount >= this.#films.length) {
      this.#filmButtonMoreComponent.element.remove();
      this.#filmButtonMoreComponent.removeElement();
    }
  };
}
