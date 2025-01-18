import { createElement } from '../render.js';

const createFilmCardInfoTemplate = () => '';

export default class FilmCardInfoTemplate {
  getTemplate() {
    return createFilmCardInfoTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
