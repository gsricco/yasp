import React, { useState, useEffect } from "react";
import axios from "axios";
import BarChart from "./components/BarChart/BarChart";
import "./App.css";

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [test, setTest] = useState('Primer 1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =  await axios.get(
          test==='Primer 1'
          ? "https://rcslabs.ru/ttrp1.json" 
          : test==='Primer 2'
          ? "https://rcslabs.ru/ttrp2.json" 
          : test==='Primer 3'
          ? "https://rcslabs.ru/ttrp3.json"
          : test==='Primer 4'
          ? "https://rcslabs.ru/ttrp4.json"
          : "https://rcslabs.ru/ttrp5.json"
        );

        setData(response.data);
      } catch (err) {
        setError("Ошибка загрузки данных");
      }
    };

    fetchData();
  }, [test]);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Загрузка...</div>;

  return (
    <div>
      <div className="buttons">
        <button onClick={() => setTest('Primer 1')}>Primer 1</button>
        <button onClick={() => setTest('Primer 2')}>Primer 2</button>
        <button onClick={() => setTest('Primer 3')}>Primer 3</button>
        <button onClick={() => setTest('Primer 4')}>Primer 4</button>
        <button onClick={() => setTest('Primer 5')}>Primer 5</button>
      </div>

      <h1 className="title">{test}: {data.title}</h1>
      <BarChart data={data} />
    </div>
  );
};

export default App;
