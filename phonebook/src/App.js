import { useState, useEffect } from 'react';
import personService from './services/persons';

const Filter = ({ currentFilter, handleFilterChange }) => (
  <div>
    filter shown with <input value={currentFilter} onChange={handleFilterChange} />
  </div>
)

const Person = ({ person, deletePerson }) => (
  <div>
    <span>{person.name}: {person.number}</span>
    <button onClick={deletePerson} person={person}>delete</button>
  </div>
)

const Persons = ({ personsToShow, deletePersonOf }) => {
  return (
    personsToShow.map(person =>
      <div key={person.id}>
        <Person
          person={person}
          deletePerson={() => deletePersonOf(person)}
        />
      </div>
    )
  )
}

const PersonForm = ({ newName, newNumber, addPerson, handleNameChange, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>

    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>

    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [currentFilter, setCurrentFilter] = useState('');
  const [showAll, setShowAll] = useState(true);
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toUpperCase().indexOf(currentFilter.toUpperCase()) >= 0);

  const handleFilterChange = (event) => {
    setShowAll(event.target.value === '');
    setCurrentFilter(event.target.value);
  }

  const addPerson = event => {
    event.preventDefault();

    if (persons.some(e => e.name === newName)) {
      const oldPerson = persons.find(person => person.name === newName);

      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...oldPerson, number: newNumber };

        personService
          .update(oldPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== oldPerson.id ? person : returnedPerson))
          })
      }
    }

    else if (persons.some(e => e.number === newNumber)) {
      const oldPerson = persons.find(person => person.number === newNumber);

      if (window.confirm(`${newNumber} is already added to phonebook, replace the old owner with a new one?`)) {
        const updatedPerson = { ...oldPerson, name: newName };

        personService
          .update(oldPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== oldPerson.id ? person : returnedPerson))
          })
      }
    }

    else {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('');
          setNewNumber('');
        })
    };
  }

  const deletePersonOf = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      personService
        .removePerson(person.id)
        .then(
          setPersons(persons.filter(p => p.id !== person.id))
        )
    }
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter currentFilter={currentFilter} handleFilterChange={handleFilterChange} />

      <h2>Add a new</h2>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons personsToShow={personsToShow} deletePersonOf={deletePersonOf} />
    </div>
  )
}

export default App
