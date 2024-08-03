import axios from 'axios';
import { DiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllDiaries = () => {
  return axios
    .get<DiaryEntry[]>(baseUrl)
    .then(response => response.data)
};

export const addDiary = (object: Object) => {
  return axios
    .post<DiaryEntry>(baseUrl, object)
    .then(response => response.data)
}
