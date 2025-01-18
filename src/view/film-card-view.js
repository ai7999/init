import { createElement } from '../render.js';
import { FilmCardControlsTemplate } from './film-card-controls-template.js';
import { FilmCardInfoTemplate } from './film-card-info-template.js';

const createFilmCardTemplate = () => '';

export default class FilmCardView {
  getTemplate() {
    return createFilmCardTemplate();
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
