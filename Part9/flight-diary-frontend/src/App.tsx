import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { addDiary, getAllDiaries } from './services/diaryService';
import {
  DiaryEntry,
  NonSensitiveDiaryEntry,
  Visibility,
  Weather,
} from './types';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState<string>('');
  const [visibility, setVisibility] = useState<Visibility | ''>('');
  const [weather, setWeather] = useState<Weather | ''>('');
  const [comment, setComment] = useState<string>('');
  const [myError, setError] = useState<string>('');

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const errorTimeout = (errorMsg: string) => {
    setError(errorMsg);
    setTimeout(() => {
      setError('');
    }, 2000);
  };

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiary = {
      date: date,
      weather: weather as Weather,
      visibility: visibility as Visibility,
      comment: comment,
      id: diaries.length + 1,
    };
    addDiary(newDiary)
      .then((data) => {
        setDiaries([...diaries, data]);
      })
      .catch((error) => {
        errorTimeout(error.response.data);
      });
  };

  const weatherTypes = Object.values(Weather);
  const visibilityTypes = Object.values(Visibility)

  const danger = {
    color: 'red',
    marginBottom: '10px',
  };

  return (
    <div>
      <h1>Add new entry</h1>
      {myError && <div style={danger}>{myError}</div>}
      <form onSubmit={diaryCreation}>
        <div>
          date
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            type='date'
          />
        </div>
        <div>
          {`visibility `}
          {visibilityTypes.map((visibilityType) => (
            <span key={visibilityType}>
              <label htmlFor={visibilityType}>{visibilityType}</label>
              <input
                onChange={(event: BaseSyntheticEvent) => {
                    setVisibility(event.target.name)
                  }
                }
                checked={(visibility === visibilityType)}
                type='radio'
                id={visibilityType}
                name={visibilityType}
                value={visibility}
              />
            </span>
          ))}
        </div>
        <div>
          {`weather `}
          {weatherTypes.map((weatherType) => (
            <span key={weatherType}>
              <label htmlFor={weatherType}>{weatherType}</label>
              <input
                onChange={(event: BaseSyntheticEvent) => {
                    setWeather(event.target.name)
                  }
                }
                checked={(weather === weatherType)}
                type='radio'
                id={weatherType}
                name={weatherType}
                value={weather}
              />
            </span>
          ))}
        </div>
        <div>
          comment
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type='submit'>add</button>
      </form>
      <h2>Diary entries</h2>
      <div>
        {diaries &&
          diaries.map((diary: NonSensitiveDiaryEntry) => {
            return (
              <div key={diary.id}>
                <b>{diary.date}</b>
                <div>
                  <br />
                  <div>{`visibility: ${diary.visibility}`}</div>
                  <div>{`weather: ${diary.weather}`}</div>
                  <br />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default App;
