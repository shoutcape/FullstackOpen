interface trainingData {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export interface trainingArgs {
  trainingTime: number[];
  target: number;
}

const isNumber = (args: string[]): boolean => {
  const requiredArgs = args.filter((_, i) => i > 1).map(Number);
  const argsOk = requiredArgs.every((arg) => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (isNaN(arg)) {
      throw new Error('All given arguments were not numbers');
    }
    return true;
  });
  return argsOk;
};

const parseExerciseArguments = (args: string[]): trainingArgs => {
  if (isNumber(args)) {
    const target = args[2];
    const trainingTime = args.filter((_, i) => i > 2).map(Number);
    return {
      target: Number(target),
      trainingTime: trainingTime,
    };
  } else {
    throw new Error('All given arguments were not numbers');
  }
};

export const calculateExercises = (target: number, trainingTime: number[]): trainingData | void => {
  try {
    const periodLength = trainingTime.length;
    const trainingDays = trainingTime.filter((day: number) => day > 0).length;
    const totalTrainingTime = trainingTime.reduce(
      (total: number, i: number) => total + i,
      0,
    );

    const average = totalTrainingTime / periodLength;
    const success = average >= target;
    const rating = average / target >= 1 ? 3 : average / target >= 0.5 ? 2 : 1;
    let ratingDescription: string;

    switch (rating) {
      case 1:
        ratingDescription = 'bad';
        break;
      case 2:
        ratingDescription = 'good';
        break;
      case 3:
        ratingDescription = 'excellent';
        break;
      default:
        throw new Error('Something went wrong with the rating');
    }

    return {
      periodLength,
      trainingDays,
      success,
      rating,
      ratingDescription,
      target,
      average,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
  }
};

if (process.argv[2] && process.argv[3]) {
  const { target, trainingTime } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(target, trainingTime));
}
