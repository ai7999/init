import { createElement } from '../render.js';
import { FilmDetailsCommentsTemplate } from './film-details-comments-template.js';
import { FilmDetailsControlsTemplate } from './film-details-controls-template.js';
import { FilmDetailsFormTemplate } from './film-details-form-template.js';
import { FilmDetailsInfoTemplate } from './film-details-info-template.js';

const createFilmDetailsTemplate = () => '';

export default class FilmDetailsView {
  getTemplate() {
    return createFilmDetailsTemplate();
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
