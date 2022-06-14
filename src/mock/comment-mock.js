import {getRandomInteger} from '../utils.js';
import {EMOTIONS} from '../consts.js';
import {nanoid} from 'nanoid';

const COMMENT_YEAR_START = 2005;
const COMMENT_YEAR_END = 2022;

const COMMENTS_TEXT = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
  'Amazing movie'
];

const AUTHORS = [
  'Ivan',
  'John Doe',
  'Tim Macoveev'
];

const generateComment = () => (
  {
    id: nanoid(),
    author: AUTHORS[getRandomInteger(0, AUTHORS.length-1)],
    emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length-1)],
    comment: COMMENTS_TEXT[getRandomInteger(0, COMMENTS_TEXT.length-1)],
    date: `${getRandomInteger(COMMENT_YEAR_START, COMMENT_YEAR_END)}-05-12T16:12:32.554Z`,
  }
);
export const COMMENTS = Array.from({length: getRandomInteger(1,10)}, generateComment);
