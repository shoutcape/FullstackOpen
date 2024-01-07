import { useState } from 'react'

const Person = ({ person }) => (
    <div>{person.name} {person.number}</div>
  )


const Persons = ({ personsToShow }) => (
    <div>
      {personsToShow.map(person =>
        <Person key={person.name} person={person}/>
        )}
    </div>
  )

const Filter = ({ personFilter, handlePersonFilter }) => (
    <div>filter shown with <input value={personFilter} onChange={handlePersonFilter} /></div>
  )

const PersonForm = ({ newName, newNumber, handleNewName, handleNewNumber, addPerson}) => (
    <div>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNewName}/></div>
        <div>number: <input value={newNumber} onChange={handleNewNumber}/></div>
      <button type='submit'>add</button>
      </form>
    </div>
  )

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personFilter, setPersonFilter] = useState('')

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handlePersonFilter = (event) => {
    setPersonFilter(event.target.value)
  }

  const personsToShow = personFilter
  ? persons.filter(person => person.name.toLowerCase().includes(personFilter.toLowerCase()))
  : persons


  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    
    if (persons.some(person => person.name === newName)){
      alert(`${newName} is already added to phonebook`)
    } else {
    setPersons(persons.concat(personObject))
    }
    setNewName('')
    setNewNumber('')
  } 
  
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter personFilter={personFilter} handlePersonFilter={handlePersonFilter}/>
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow}/>
    </div>
  )
}

export default App
