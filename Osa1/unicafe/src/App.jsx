import { useState } from "react"

const Statistics = (props) => {
  const {good, neutral, bad, average, total, positive} = props.data

  if (total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <tr>
          <td>good</td>
          <td>{good}</td>
        </tr>
        <tr>
          <td>neutral</td>
          <td>{neutral}</td>
        </tr>
        <tr>
          <td>bad</td>
          <td>{bad}</td>
        </tr>
        <tr>
          <td>all</td>
          <td>{total}</td>
        </tr>
        <tr>
          <td>average</td>
          <td>{average}</td>
        </tr>
        <tr>
          <td>positive</td>
          <td>{positive} %</td>
        </tr>
      </tbody>
    </table>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + bad + neutral
  const average = (good + bad*-1)/total
  const positive = good/total*100

  const handleGoodReview = () => {
    setGood(good + 1)
  }

  const handleBadReview = () => {
    setBad(bad + 1)
  }

  const handleNeutralReview = () => {
    setNeutral(neutral + 1)
  }

  const statisticsData = {
    good, neutral, bad, total, average, positive
  }

  return (
      <div>
        <h1>give feedback</h1>
        <Button handleClick={handleGoodReview} text='good' />
        <Button handleClick={handleNeutralReview} text='neutral' />
        <Button handleClick={handleBadReview} text='bad' />
        <h2>statistics</h2>
        <Statistics data={statisticsData} />
      </div>
  )
}

export default App