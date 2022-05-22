import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListСontainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsListСontainerView extends AbstractView{

  get template() {
    return createFilmsListСontainerTemplate();
  }
}
