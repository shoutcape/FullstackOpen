import { CoursePart } from '../types';

interface PartProps {
  courseParts: CoursePart[];
}

const Part = (props: PartProps) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };

  return (
    <div>
      {props.courseParts.map((part, index) => {
        switch (part.kind) {
          case 'basic':
            return (
              <div key={index}>
                <b>{`${part.name} ${part.exerciseCount}`}</b>
                <div>{part.description}</div>
                <br/>
              </div>
            );
          case 'group':
            return (
              <div key={index}>
                <b>{`${part.name} ${part.exerciseCount}`}</b>
                <div>{`Project exercises: ${part.groupProjectCount}`}</div>
                <br/>
              </div>
            );
          case 'background':
            return (
              <div key={index}>
                <b>{`${part.name} ${part.exerciseCount}`}</b>
                  <div>{part.description}</div>
                  <div>{`Submit to ${part.backgroundMaterial}`}</div>
                <br/>
              </div>
            );
          case 'special':
            return (
              <div key={index}>
                <b>{`${part.name} ${part.exerciseCount}`}</b>
                <div>{part.description}</div>
                <div>{`Required skills: ${part.requirements}`}</div>
                <br/>
              </div>
            );
          default:
            return assertNever(part);
        }
      })}
    </div>
  );
};

export default Part;
