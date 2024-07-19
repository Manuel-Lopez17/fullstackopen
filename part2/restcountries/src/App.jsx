import { useEffect, useState } from "react";
import countriesService from "./services/countries";

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
      find country <input value={filter} onChange={handleFilter} />{" "}
    </div>
  );
};

const Country = ({ props }) => {
  const languages = Object.values(props.languages);
  const flag = Object.values(props.flags).find((e) => e.includes(".svg"));
  return (
    <div>
      <h2>{props.name.common}</h2>
      <h4>Capital/s</h4>
      <ul>
        {props.capital.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p>Area: {props.area}</p>
      <h4>Languages</h4>
      <ul>
        {languages.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <img style={{ height: "100px", width: "100px" }} src={flag} alt="flag" />
    </div>
  );
};

const Countries = ({ countries }) => {
  const [showIndex, setShowIndex] = useState(false);
  if (countries.length == 1) {
    return <Country props={countries[0]} />;
  }

  if (countries.length <= 10) {
    const handleShow = (index) => {
      setShowIndex(index === showIndex ? null : index);
    };
    return countries.map((country, index) => (
      <div key={index}>
        <li>
          {country.name.common}{" "}
          <button onClick={() => handleShow(index)}>
            {showIndex === index ? "Hide" : "Show"}
          </button>
        </li>
        {showIndex === index && <Country props={country} />}
      </div>
    ));
  }

  return <div>Too many matches, specify another filter</div>;
};

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const eventHandler = (response) => {
      setCountries(response);
    };
    const promise = countriesService.getAll();
    promise.then(eventHandler);
  }, []);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <div>
        <Filter filter={filter} handleFilter={handleFilter} />
        <Countries countries={filteredCountries} />
      </div>
    </>
  );
}

export default App;
