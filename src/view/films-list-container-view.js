import {createElement} from '../render.js';

const createFilmsListСontainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsListСontainerView {
  getTemplate() {
    return createFilmsListСontainerTemplate();
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
