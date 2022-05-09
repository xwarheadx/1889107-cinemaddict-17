import { FILM_COUNT } from '../consts';
import { generateFilm } from '../mock/film-card-mock';
export default class FilmsModel {
  films = Array.from({length: FILM_COUNT}, generateFilm);

  getFilms = () => this.films;
}
