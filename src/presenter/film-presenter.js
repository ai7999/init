import FilmCardView from '../view/film-card-view.js';

import { render, replace, remove } from '../framework/render.js';

export default class FilmPresenter {
  #container = null;

  #changeData = null;
  #clickCardHandler = null;
  #escKeyDownHandler = null;

  #filmCardComponent = null;

  #film = null;

  constructor(container, changeData, clickCardHandler, escKeyDownHandler) {
    this.#container = container;
    /**5.1.6 Добавит логику обновления задачи
- Передадим функцию обновления из презентера доски в презентер задачи
- В презентере задачи опишем обработчики клика по кнопкам "Архив" и "В избранное" */
    this.#changeData = changeData;
    this.#clickCardHandler = clickCardHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
  }

  init = (film) => {
    this.#film = film;

    /*- Добавим возможность повторно инициализировать презентер задачи. Для этого в методе init будем запоминать
    предыдущие компоненты. Если они null, то есть не создавались, рендерим как раньше. Если они отличны от null,
     то есть создавались, то заменяем их новыми и удаляем */
    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);

    this.#filmCardComponent.setCardClickHandler(() => {
      this.#clickCardHandler(this.#film);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });
    /**5.1.6 Добавит логику обновления задачи
     * - В презентере задачи опишем обработчики клика по кнопкам "Архив" и "В избранное"
     *  - В представлении опишем механизм подписки на эти события
     * - Передадим из презентера задачи в представление обработчики
     * - Сохранение задачи тоже проведём через #changeData, но, пока форма не редактируется, эффекта видно не будет

Теперь, если вы попробуете кликнуть по кнопкам, то у задачи поменяется признак: в архиве или в избранном она, смотря
куда кликнуть. Пока что эта информация нигде не сохраняется, поэтому после перезагрузки страницы все данные сгенерируются
заново. Это нормально
     */
    this.#filmCardComponent.setWatchlistBtnClickHandler(this.#watchlistBtnClickHandler);
    this.#filmCardComponent.setWatchedBtnClickHandler(this.#watchedBtnClickHandler);
    this.#filmCardComponent.setFavoriteBtnClickHandler(this.#favoriteBtnClickHandler);

    /*- Добавим возможность повторно инициализировать презентер задачи. Для этого в методе init будем запоминать предыдущие
     компоненты. Если они null, то есть не создавались, рендерим как раньше. Если они отличны от null, то есть создавались,
     то заменяем их новыми и удаляем */
    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#container);
      return;
    }

    replace(this.#filmCardComponent, prevFilmCardComponent);

    remove(prevFilmCardComponent);
  };

  /*- Добавим метод destroy для удаления компонентов. Он пригодится нам для очистки списка фильмов при фильтрации
   и сортировке */
  destroy = () => {
    remove(this.#filmCardComponent);
  };

  #watchlistBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist
      },
    });
  };

  #watchedBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched
      },
    });
  };

  #favoriteBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite
      },
    });
  };

}
