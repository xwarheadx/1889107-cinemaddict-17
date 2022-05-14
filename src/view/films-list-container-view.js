import {createElement} from '../render.js';

const createFilmsListСontainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsListСontainerView {
  #element = null;

  get template() {
    return createFilmsListСontainerTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
