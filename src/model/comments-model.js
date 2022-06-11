import {COMMENTS} from '../mock/comment-mock.js';

export default class CommentsModel {
  #comments = COMMENTS;

  get comments() {
    return this.#comments;
  }

  set comments(value) {
    this.#comments = value;
  }
}
