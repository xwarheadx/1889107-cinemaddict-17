import {COMMENTS} from '../mock/comment-mock.js';
import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable{
  #comments = COMMENTS;

  get comments() {
    return this.#comments;
  }

  set comments(value) {
    this.#comments = value;
  }

  addComment = (updateType, update, film) => {
    this.#comments = [
      ...this.#comments,
      update,
    ];

    this._notify(updateType, film);
  };

  deleteComment = (updateType, index) => {
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
