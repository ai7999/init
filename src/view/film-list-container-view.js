import { createElement } from '../render.js';

const createFilmListContainerTemplate = () => '';

export default class FilmListContainerView {
  getTemplate() {
    return createFilmListContainerTemplate();
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
