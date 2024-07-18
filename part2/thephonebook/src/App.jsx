import { useState, useEffect } from "react";
import personsService from "./services/persons";

const Filter = (props) => {
  return (
    <div>
      filter shown by:{" "}
      <input
        type="text"
        value={props.search}
        onChange={props.handleSearch}
        placeholder="Search by name"
      />
    </div>
  );
};

const Form = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name:{" "}
        <input value={props.newName} onChange={props.handlePersonChange} />
      </div>
      <div>
        number:{" "}
        <input
          type="tel"
          value={props.newPhone}
          onChange={props.handlePhoneChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = (props) => {
  return props.filteredPeople.map((person) => (
    <div key={person.id}>
      {person.name} {person.number}{" "}
      <button data-person={JSON.stringify(person)} onClick={props.handleDelete}>
        Delete
      </button>
    </div>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const eventHandler = (response) => {
      setPersons(response);
    };

    const promise = personsService.getAll();
    promise.then(eventHandler);
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  const addPerson = (event) => {
    event.preventDefault();

    if (!persons.some((person) => person.name == newName)) {
      const maxId = persons.reduce(
        (max, person) => (person.id > max ? person.id : max),
        0
      );
      const newId = parseInt(maxId) + 1;
      const newPerson = {
        name: newName,
        number: newNumber,
        id: newId.toString(),
      };
      const promise = personsService.create(newPerson).then((response) => {
        setPersons(persons.concat(response));
      });
    } else {
      if (window.confirm(`Update ${newName} number?`)) {
        const person = persons.find((person) => person.name == newName);
        const promise = personsService.update(person.id, {
          ...person,
          number: newNumber,
        });
        promise.then((response) => {
          setPersons(
            persons.map((person) =>
              person.id != response.id ? person : response
            )
          );
        });
      }
    }
  };

  const handlePersonChange = (event) => {
    event.preventDefault();
    setNewName(event.target.value);
  };
  const handlePhoneChange = (event) => {
    event.preventDefault();
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredPeople = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (event) => {
    const person = JSON.parse(event.target.getAttribute("data-person"));
    if (window.confirm(`Delete ${person.name}?`)) {
      const promise = personsService.deleteUser(person.id);
      promise.then((data) =>
        setPersons(persons.filter((person) => person.id != data.id))
      );
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch} />
      <h3>Add a new</h3>
      <Form
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newPhone={newNumber}
        handlePhoneChange={handlePhoneChange}
      />
      <h3>Numbers</h3>
      <Persons
        filteredPeople={filteredPeople}
        handleDelete={handleDelete}
      ></Persons>
    </div>
  );
};

export default App;
