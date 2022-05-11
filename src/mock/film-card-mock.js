import {getRandomInteger} from '../utils';
import {generateComment} from './comment-mock';

const RELEASE_YEAR_START = 1931;
const REALESE_YEAR_END = 2021;
const MIN_RUNTIME = 10;
const MAX_RUNTIME = 180;
const WHATCHING_DATE_MIN = 2005;
const WHATCHING_DATE_MAX = 2022;

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, conctetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, Purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
];

const MOVIE_TITLES = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor'
];

const GENRES = [
  'Action',
  'Drama',
  'Film-Noir',
  'Mystery',
  'Cartoon',
  'Comedy',
  'Musical',
  'Western',
];

const POSTERS = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

const AGE_RATING = [
  '0',
  '6',
  '12',
  '16',
  '18'
];

const COUNTRIES = [
  'United States',
  'China',
  'Australia',
  'France',
  'Canada',
  'Germany',
  'United Kingdom'
];

const DIRECTORS = [
  'Alfred Hitchcock',
  'Anthony Mann',
  'Steven Spielberg',
  'George Lucas',
  'Robert Zemeckis',
  'Jeffrey Jacob Abrams',
  'Martin Scorsese',
  'Francis Ford Coppola'
];

const WRITERS = [
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Jeffrey Jacob Abrams',
  'Bob Gale',
  'Edgar Wright',
  'Michael Mann',
  'Art Linson'
];

const ACTORS = [
  'Al Pacino',
  'Robert De Niro',
  'Tom Sizemore',
  'Tom Cruise',
  'Nicole Kidman',
  'Frances McDormand',
  'William H. Macy',
  'Steve Buscemi',
  'Billy Bob Thornton',
  'Martin Freeman',
  'Kirsten Dunst',
  'Patrick Wilson'
];

const  getRandomBoolean = () => Boolean(getRandomInteger(0, 1));

const getRandomArray = (list) => {
  const elements = [];
  while (elements.length <= getRandomInteger(0, list.length)) {
    const randomNumber = getRandomInteger(0, list.length - 1);
    if (elements.indexOf(list[randomNumber]) === -1) {
      elements.push(list[randomNumber]);
    }
  }
  return elements;
};

export const generateFilm = () => ({
  'id': getRandomInteger(0,9999),
  'comments': Array.from({length: getRandomInteger(1,10)}, generateComment),
  'film_info': {
    'title': MOVIE_TITLES[getRandomInteger(0, MOVIE_TITLES.length-1)],
    'alternative_title': MOVIE_TITLES[getRandomInteger(0, MOVIE_TITLES.length-1)],
    'total_rating': `${getRandomInteger(1, 9)}.${getRandomInteger(0, 9)}`,
    'poster': POSTERS[getRandomInteger(0, POSTERS.length-1)],
    'age_rating': AGE_RATING[getRandomInteger(0, AGE_RATING.length-1)],
    'director': DIRECTORS[getRandomInteger(0, DIRECTORS.length-1)],
    'writers': getRandomArray(WRITERS),
    'actors': getRandomArray(ACTORS),
    'release': {
      'date': `${getRandomInteger(RELEASE_YEAR_START, REALESE_YEAR_END)}-05-11T00:00:00.000Z`,
      'release_country': getRandomArray(COUNTRIES)
    },
    'runtime': getRandomInteger(MIN_RUNTIME, MAX_RUNTIME),
    'genre': getRandomArray(GENRES),
    'description': DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length-1)],
  },
  'user_details': {
    'watchlist': getRandomBoolean(),
    'already_watched': getRandomBoolean(),
    'watching_date': `${getRandomInteger(WHATCHING_DATE_MIN, WHATCHING_DATE_MAX)}-${getRandomInteger(1,31)}-12T16:12:32.554Z`,
    'favorite': getRandomBoolean(),
  }
});
