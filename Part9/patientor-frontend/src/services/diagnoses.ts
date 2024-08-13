import axios from 'axios';
import { Diagnosis } from '../types';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return data;
};

//const getById = async (id: string) => {
//  console.log('Tässä id:',id);
//  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
//  return data;
//};

//const create = async (object: PatientFormValues) => {
//  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);
//
//  return data;
//};

export default {
  getAll,
  //create,
  //getById
};
