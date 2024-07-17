import React from "react";

const Header = ({ props }) => {
  return <h1>{props.name}</h1>;
};

const Content = ({ props }) => {
  const parts = props.parts;
  return (
    <>
      {parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
    </>
  );
};

const Total = ({ props }) => {
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <p>
      <strong>Total of {total} exercises</strong>
    </p>
  );
};

export const Course = (props) => {
  return (
    <>
      <Header props={props.course} />
      <Content props={props.course} />
      <Total props={props.course} />
    </>
  );
};
