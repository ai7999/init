import { createElement } from '../render.js';

const createFilmCardControlsTemplate = () => '';

export default class FilmCardControlsTemplate {
  getTemplate() {
    return createFilmCardControlsTemplate();
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
