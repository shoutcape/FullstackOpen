interface calculateValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): calculateValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (height: number, weight: number): string | void => {
  try {

    const heightInMSqr = ((height / 100) * height) / 100;
    const bmi = weight / heightInMSqr;

    switch (true) {
      case bmi < 18.5:
        return `Underweight ${bmi.toFixed(2)}`;
      case bmi >= 18.5 && bmi < 24.9:
        return `Normal ${bmi.toFixed(2)}`;
      case bmi >= 25 && bmi < 29.9:
        return `Overweight ${bmi.toFixed(2)}`;
      case bmi >= 30:
        return `Obesity ${bmi.toFixed(2)}`;
      default:
        return 'Error calculating BMI';
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
      return;
    }
  }
};

if (process.argv[2] && process.argv[3]) {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
}
