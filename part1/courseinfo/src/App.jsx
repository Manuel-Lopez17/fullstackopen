const Header = ({ course }) => {
  return <h1>{course}</h1>;
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Content = ({
  part1,
  exercises1,
  part2,
  exercises2,
  part3,
  exercises3,
}) => {
  return (
    <>
      <Part part={part1} exercises={exercises1} />
      <Part part={part2} exercises={exercises2} />
      <Part part={part3} exercises={exercises3} />
    </>
  );
};

const Total = ({ total }) => {
  return <p>Number of exercises {total}</p>;
};

const App = () => {
  const course = "Half Stack application development";

  const content = {
    part1: "Fundamentals of React",
    exercises1: 10,
    part2: "Using props to pass data",
    exercises2: 7,
    part3: "State of a component",
    exercises3: 14,
  };

  const totalExercises =
    content.exercises1 + content.exercises2 + content.exercises3;

  return (
    <div>
      <Header course={course} />
      <Content
        part1={content.part1}
        exercises1={content.exercises1}
        part2={content.part2}
        exercises2={content.exercises2}
        part3={content.part3}
        exercises3={content.exercises3}
      />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;
