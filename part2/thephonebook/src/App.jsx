import { useState, useEffect } from "react";
import axios from "axios";

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
      {person.name} {person.number}
    </div>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([
    // { name: "Arto Hellas", number: "040-123456", id: 1 },
    // { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    // { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    // { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

  useEffect(() => {
    const eventHandler = (response) => {
      setPersons(response.data);
    };

    const promise = axios.get("http://localhost:3001/persons");
    promise.then(eventHandler);
  }, []);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [search, setSearch] = useState("");

  const addPerson = (event) => {
    event.preventDefault();
    if (!persons.some((person) => person.name == newName)) {
      const maxId = persons.reduce(
        (max, person) => (person.id > max ? person.id : max),
        0
      );
      const newId = maxId + 1;
      setPersons([...persons, { name: newName, number: newPhone, id: newId }]);
    } else {
      alert(`${newName} is already added to phonebook`);
    }
  };

  const handlePersonChange = (event) => {
    event.preventDefault();
    setNewName(event.target.value);
  };
  const handlePhoneChange = (event) => {
    event.preventDefault();
    setNewPhone(event.target.value);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredPeople = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch} />
      <h3>Add a new</h3>
      <Form
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />
      <h3>Numbers</h3>
      <Persons filteredPeople={filteredPeople}></Persons>
    </div>
  );
};

export default App;
