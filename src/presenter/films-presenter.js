import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';
//import FilmCardView from '../view/film-card-view.js';
import NoFilmView from '../view/no-film-view.js';

import { remove, render, RenderPosition } from '../framework/render.js';
import { FILM_COUNT_PER_STEP, SortType } from '../const.js';
import { updateItem } from '../utils/common.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/film.js';

import FilmPresenter from '../presenter/film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

/**5.5. Большие перемены (часть 1)
 * Презентер
Пришло время разгрузить наш презентер и вынести часть связанной логики в дочерний презентер.

Заведите отдельный презентер для фильма. Необходимые данные передайте через конструктор.

Разнесите по презентерам всю логику по отрисовке фильмов, в том числе попапов с подробной информацией, и кнопки «Show more», а также по навешиванию на них обработчиков и т. п.

В «основном» презентере создайте экземпляры дочерних презентеров, передайте данные и инициализируйте их.
Частичный датабиндинг
Реализуем обработку кликов на кнопках «Add to watchlist», «Already watched», «Add to favorites» у карточки фильма и у попапа подробной информации о фильме. Обработчики должны изменять данные фильма — добавлять или удалять из избранного и списка к просмотру, а также помечать его просмотренным или наоборот, и на основе изменённых данных перерисовывать компоненты.

Для этого:

В компоненте фильма и попапа добавьте методы для установки обработчиков клика для каждой кнопки.

В презентере списка фильмов опишите метод изменения данных. Задача метода — обновить моки и вызвать обновление конкретного фильма.

В презентер одного фильма передайте эту функцию изменения данных. Функция должна вызываться в обработчике клика и получать на вход обновлённые данные.

Обратите внимание, что изменение информации о фильме в попапе — клики по кнопкам «Add to watchlist», «Already watched», «Add to favorites» — должно отображаться в списке фильмов мгновенно. При изменении информации и обновлении списка фильмов попап не должен закрываться самовольно.

Только один попап
Мы научились обновлять данные и создавать интерактивные компоненты. Осталось запретить открывать несколько попапов одновременно.

Добавьте в презентер метод для скрытия попапа.

Передайте в презентер фильма колбэк, который нужно вызвать перед тем, как открыть новый попап.

В презентере списка фильмов реализуйте метод для этого колбэка, который скроет попап, если таковой уже открыт.
*/

export default class FilmsPresenter {
  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #films = [];

  #selectedFilm = null;

  /*5.1.4 Реализует очистку списка
Для дальнейшей работы - сортировки и фильтрации - нам нужно научить наш презентер очищать список задач. Стараемся по
максимуму переиспользовать то, что уже есть - метод destroy. Но чтобы вызвать его у каждого Task-презентера, их нужно
запомнить все:
- Заведем свойство #taskPresenter, где Board-презентер будет хранить ссылки на все Task-презентеры. Можно использовать
массив или Set, но оптимальнее будет объект или Map - потому что нам нужно часто обращаться к презентерам. Обратиться по
ключу проще, чем найти нужный элемент в массиве или в Set. */
  #filmPresenter = new Map();
  #filmDetailsPresenter = null;

  /**5.2.4 Реализует метод сортировки
- Объявим в презентере два свойства: для бэкапа массива с задачами и для записи выбранной сортировки */
  #currentSortType = SortType.DEFAULT;
  #sourcedBoardFilms = [];

  //- Заведем счетчик показанных фильмов
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

    /**  // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив: */
    this.#sourcedBoardFilms = [...this.#filmsModel.get()];

    this.#renderFilmBoard();
  };

  #filmChangeHandler = (updatedFilm) => {
    /*5.1.5 Реализует логику обновления задачи
- Опишем в презентере доски обработчик изменений в задаче - #handleTaskChange
- После обновления данных повторно инициализируем Task-презентер уже с новыми данными */
    this.#films = updateItem(this.#films, updatedFilm);//обновленные фильмы
    this.#sourcedBoardFilms = updateItem(this.#sourcedBoardFilms, updatedFilm);

    if (this.#filmPresenter.get(updatedFilm.id)) {
      this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }
    if (this.#filmDetailsPresenter && this.#selectedFilm.id === updatedFilm.id) {
      this.#selectedFilm = updatedFilm;
      this.#renderFilmDetails();
    }
  };

  /**5.2.4 Реализует метод сортировки
- Объявим в презентере два свойства: для бэкапа массива с задачами и для записи выбранной сортировки
- Заведем функцию сортировки #sortTasks
- Опишем switch-блок с функциями сортировки */
  #sortFilms = (sortType) => {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortFilmsByDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortFilmsByRating);
        break;
      default:
        /** 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив */
        this.#films = [...this.#sourcedBoardFilms];
    }
    this.#currentSortType = sortType;
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

  /**5.2.3 Опишет логику сортировки. WIP
- Добавляем пустой (пока) обработчик смены сортировки
- В обработчике помечаем будущую логику

WIP: линтер ругается на неиспользуемую переменную */
  /**5.2.4 Реализует метод сортировки
  - Объявим в презентере два свойства: для бэкапа массива с задачами и для записи выбранной сортировки
  - Заведем функцию сортировки #sortTasks
  - Опишем в обработчике условие-оптимизацию, которое защитит от лишних перерисовок
  - Опишем switch-блок с функциями сортировки
  - Реализуем в утилитах колбэки для метода sort массива
  N.B. Хорошо или плохо мутировать данные - давний спор. В целом, скорее, плохо. В нашем же случае, скорее, хорошо. Потому что благодаря ей, нам не нужно думать о методах перерисовки. Для обновления списка задач, нам будет достаточно (почти) существующего метода #renderTaskList */
  #handleSortTypeChange = (sortType) => {
    // - Сортируем фильмы
    //- Опишем в обработчике условие-оптимизацию, которое защитит от лишних перерисовок
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    /**5.2.5 Свяжет сортировку и рендеринг задач
- Используем методы #renderTaskList и #clearTaskList в обработчике смены сортировки */
    // - Очищаем список
    this.#clearFilmList();

    // - Рендерим список заново
    this.#renderFilmList();
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#filmButtonMoreComponent);
  };

  #renderSort = (container) => {
    /*if (!this.#sortComponent) {
      this.#sortComponent = new SortView(this.#currentSortType);
      render(this.#sortComponent, container);
    } else {
      const updatedSortComponent = new SortView(this.#currentSortType);
      replace(updatedSortComponent, this.#sortComponent);
      this.#sortComponent = updatedSortComponent;
    }*/
    render(this.#sortComponent, container);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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
    //const filmCardComponent = new FilmCardView(film);
    /**5.1.6 Добавит логику обновления задачи
- Передадим функцию обновления из презентера доски в презентер задачи */
    const filmPresenter = new FilmPresenter(container, this.#filmChangeHandler, this.#addFilmDetailsComponent, this.#onEscKeyDown);


    /*this.#addFilmDetailsComponent(film);
    document.addEventListener('keydown', this.#onEscKeyDown);*/
    filmPresenter.init(film);

    /*5.1.4 Реализует очистку списка
    - Ключами для презентеров сделаем id задачи. Предварительно научив наши моки эти id генерировать */
    this.#filmPresenter.set(film.id, filmPresenter);//сохраняем в хранилище типа Map связку по идентификатору фильма
  };

  #renderLoadMoreButton(container) {
    render(this.#filmButtonMoreComponent, container, RenderPosition.BEFOREEND);

    this.#filmButtonMoreComponent.setButtonMoreClickHandler(() => this.#handleLoadMoreButtonClick());
  }

  //- По клику будем допоказывать задачи, опираясь на счётчик
  //5.1.1 Выделит в презентере рендеринг компонентов
  //Разделим отрисовку компонентов доски на отдельные методы так, чтобы каждый решал ровно одну задачу
  #handleLoadMoreButtonClick() {

    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP, this.#filmListContainerComponent.element);

    // Главное на каждый клик наращивать количество уже показанных фильмов
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;


    //- Если показаны все задачи - скроем кнопку
    if (this.#renderedFilmCount >= this.#films.length) {
      this.#filmButtonMoreComponent.element.remove();
      this.#filmButtonMoreComponent.removeElement();
    }
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  /**5.1.7 Ограничит количество форм за раз
Схема следующая: при попытке открыть задачу на редактирование мы просим все презентеры задач сменить режим с
редактирования на просмотр.

- В презентере задачи заведём поле-флаг - в каком режиме задача: просмотр (по умолчанию) или редактирование
- Реализуем метод resetView для смены режима на тот, что по умолчанию
- В презентере доски опишем метод уведомления всех презентеров о смене режима
- В resetView опишем условие, чтобы режим сменялся только если задача была открыта на редактирование
- На этот же режим завяжем проверку, какой компонент заменять при повторной инициализации */
  #addFilmDetailsComponent = (film) => {
    if (this.#selectedFilm && this.#selectedFilm.id === film.id) {
      return;
    }
    if (this.#selectedFilm && this.#selectedFilm.id !== film.id) {
      this.#removeFilmDetailsComponent();
    }

    this.#selectedFilm = film;
    this.#renderFilmDetails();
    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetailsComponent = () => {
    /*5.1.4 Реализует очистку списка
    - Для очистки списка будем последовательно вызывать destroy всех Task-презентеров, а после очистим всю Map,
    чтобы "убить" ссылки на Task-презентеры и чтобы сборщик мусора их собрал. */
    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#selectedFilm = null;

    document.body.classList.remove('hide-overflow');
  };

  #renderFilmDetails() {
    const comments = [...this.#commentsModel.get(this.#selectedFilm)];

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentNode,
        this.#filmChangeHandler,
        this.#removeFilmDetailsComponent,
        this.#onEscKeyDown
      );
    }
    /*this.#filmDetailsComponent = new FilmDetailsView(film, comments);

    this.#filmDetailsComponent.setCloseButtonHandler(() => {
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    render(this.#filmDetailsComponent, this.#container.parentElement);*/
    this.#filmDetailsPresenter.init(this.#selectedFilm, comments);
  }

}
