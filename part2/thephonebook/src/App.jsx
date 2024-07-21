import { useState, useEffect } from "react";
import personsService from "./services/persons";
import "./index.css";

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
  return props.filteredPersons.map((person) => (
    <div key={person.id}>
      {person.name} {person.number}{" "}
      <button data-person={JSON.stringify(person)} onClick={props.handleDelete}>
        Delete
      </button>
    </div>
  ));
};

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div
      className={`notification ${
        type === "success" ? "notification-success" : "notification-error"
      }`}
    >
      {message}
    </div>
  );
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
  const [notification, setNotification] = useState({
    message: null,
    type: "success",
  });

  const addPerson = (event) => {
    event.preventDefault();

    if (!persons.some((person) => person.name == newName)) {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      const promise = personsService
        .create(newPerson)
        .then((response) => {
          setNotification({
            message: "Added " + newPerson.name,
            type: "success",
          });
          setTimeout(() => {
            setNotification({
              message: null,
              type: "success",
            });
          }, 5000);
          setPersons(persons.concat(response));
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    } else {
      if (window.confirm(`Update ${newName} number?`)) {
        const person = persons.find((person) => person.name == newName);
        const promise = personsService.update(person.id, {
          ...person,
          number: newNumber,
        });
        promise
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== response.id ? person : response
              )
            );
            setNotification({
              message: `Updated ${response.name}`,
              type: "success",
            });
            setTimeout(() => {
              setNotification({
                message: null,
                type: "success",
              });
            }, 5000);
          })
          .catch((error) => {
            console.error("Error updating person:", error);
            setNotification({
              message: "Error updating person",
              type: "error",
            });
            setTimeout(() => {
              setNotification({
                message: null,
                type: "success",
              });
            }, 5000);
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

  const handleDelete = (event) => {
    const person = JSON.parse(event.target.getAttribute("data-person"));
    if (window.confirm(`Delete ${person.name}?`)) {
      const promise = personsService.deleteUser(person.id);
      promise
        .then((response) => {
          setPersons(persons.filter((p) => p.id !== person.id));
          setNotification({
            message: `Deleted ${person.name}`,
            type: "success",
          });
          setTimeout(() => {
            setNotification({
              message: null,
              type: "success",
            });
          }, 5000);
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
          setNotification({ message: "Error deleting person", type: "error" });
          setTimeout(() => {
            setNotification({
              message: null,
              type: "success",
            });
          }, 5000);
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
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
        filteredPersons={filteredPersons}
        handleDelete={handleDelete}
      ></Persons>
    </div>
  );
};

export default App;
