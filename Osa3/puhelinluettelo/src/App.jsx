import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'

const Persons = ({ personsToShow, setPersons, persons, showMessage}) =>  {
  const removePerson = (id, name) => {
  const newPersons = persons.filter(person => person.id !== id)
    if (window.confirm(`Delete ${name} ?`)){
      personService
        .remove(id)
        .then(() => {
          setPersons(newPersons)
          showMessage(`Deleted ${name}`)

        })
      }
  }
  return (
    <div>
      {personsToShow.map(person =>
        <Person 
        key={person.name}
        person={person}
        remove={() => removePerson(person.id, person.name)}
        />
        )}
    </div>
  )
}


const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personFilter, setPersonFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)
      })
  }, [])


  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handlePersonFilter = (event) => {
    setPersonFilter(event.target.value)
  }

  const showMessage = (newMessage, error = false) => {
    setMessage(newMessage)
    setIsError(error)
    setTimeout(() => {
      setMessage(null)
      setIsError(false)
    }, 5000)
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
    const personExists = persons.find(person => person.name === newName)

    if (personExists){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
      personService
        .update(personExists.id, personObject).then(returnedPerson => {
          setPersons(persons.map(person => person.id !== personExists.id ? person : returnedPerson))
          showMessage(`The number of user '${newName}' was updated`)
        })
        .catch(error => {
          showMessage(error.response.data.error, true)
        })
    }
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          showMessage(`Added ${newName}`)
        })
        .catch(error => {
          showMessage(error.response.data.error, true)
          })
      }
      setNewName('')
      setNewNumber('')
    }
  
  const className = isError ? 'error' : 'message'

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} className={className}/>
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
      <Persons 
        personsToShow={personsToShow} 
        setPersons={setPersons} 
        persons={persons}
        showMessage={showMessage}
        />
    </div>
  )
}

export default App
