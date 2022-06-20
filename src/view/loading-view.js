import AbstractView from '../framework/view/abstract-view.js';

const createLoadingTemplate = () => (
  `<h2 class="films-list__title">
    Now loading...
  </h2>`
);

export default class LoadingView extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}
