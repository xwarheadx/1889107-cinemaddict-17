import {getRandomInteger} from '../utils.js';

const EMOTIONS = [
  './images/emoji/smile.png',
  './images/emoji/sleeping.png',
  './images/emoji/puke.png',
  './images/emoji/angry.png'];
const COMMENTS = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
  'Amazing movie'];
const AUTHORS = [
  'Ivan',
  'John Doe',
  'Tim Macoveev'];

export const generateComment = () => (
  {
    'id': getRandomInteger(1, 30),
    'author': AUTHORS[getRandomInteger(0, AUTHORS.length-1)],
    'emotion': EMOTIONS[getRandomInteger(0, EMOTIONS.length-1)],
    'comment': COMMENTS[getRandomInteger(0, COMMENTS.length-1)],
    'date': `${getRandomInteger(2005,2022)}-05-12T16:12:32.554Z`,
  }
);
