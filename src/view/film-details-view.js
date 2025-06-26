import AbstractView from '../framework/view/abstract-view.js';
import { createFilmDetailsCommentsTemplate } from './film-details-comments-template.js';
import { createFilmDetailsControlsTemplate } from './film-details-controls-template.js';
import { createFilmDetailsFormTemplate } from './film-details-form-template.js';
import { createFilmDetailsInfoTemplate } from './film-details-info-template.js';

const createFilmDetailsTemplate = ({ filmInfo }, comments) => `
  <section class="film-details">
    <div class="film-details__inner">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        ${createFilmDetailsInfoTemplate(filmInfo)}
        ${createFilmDetailsControlsTemplate()}
      </div>
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          ${createFilmDetailsCommentsTemplate(comments)}
          ${createFilmDetailsFormTemplate()}
        </section>
      </div>
    </div>
  </section>
`;

export default class FilmDetailsView extends AbstractView {
  #film = null;
  #comments = null;

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film, this.#comments);
  }
}
