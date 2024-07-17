import { useState } from "react";

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>;
};

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>
        {props.value} {props.sign ? props.sign : ""}
      </td>
    </tr>
  );
};

const Statics = (props) => {
  if (props.good || props.neutral || props.bad) {
    return (
      <div>
        <h1>statics</h1>
        <table>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={props.all} />
          <StatisticLine
            text="positives"
            value={(props.good / props.all) * 100}
            sign="%"
          />
        </table>
      </div>
    );
  } else {
    return (
      <div>
        <h1>no statics</h1>
        <table>
          <tr>
            <td>no feedback given</td>
          </tr>
        </table>
      </div>
    );
  }
};

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [average, setAverage] = useState(0);

  const handleGood = () => {
    setGood(good + 1);
    calculateAverage(1);
  };
  const handleNeutral = () => {
    setNeutral(neutral + 1);
    calculateAverage(0);
  };
  const handleBad = () => {
    setBad(bad + 1);
    calculateAverage(-1);
  };

  const calculateAverage = (value) => {
    setAverage(average + value);
  };

  const all = good + neutral + bad;

  return (
    <>
      <div>
        <h1>give feedback</h1>
        <div>
          <Button handleClick={handleGood} text="good" />
          <Button handleClick={handleNeutral} text="neutral" />
          <Button handleClick={handleBad} text="bad" />
        </div>
      </div>
      <Statics good={good} neutral={neutral} bad={bad} all={all} />
    </>
  );
};

export default App;
