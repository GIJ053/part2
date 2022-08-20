import React from "react";

const Header = ({ name }) => <h1>{name}</h1>;

const Content = ({ parts }) =>
    parts.map((part) => <Part key={part.id} part={part} />);

const Total = ({ parts }) => {
    console.log(parts);

    const total = parts.reduce(
        (prevValue, currValue) => prevValue + currValue.exercises,
        0
    );

    return <h3>total of {total} exercises</h3>;
};

const Part = ({ part }) => (
    <p>
        {part.name} {part.exercises}
    </p>
);

const Course = ({ course }) => {
    return (
        <div>
            <Header name={course.name} />

            <Content parts={course.parts} />

            <Total parts={course.parts} />
        </div>
    );
};

export default Course