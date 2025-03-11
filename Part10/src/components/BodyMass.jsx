//This is a practice file

import { TextInput, Pressable, View } from 'react-native';
import * as yup from 'yup';
import { useFormik } from 'formik';
import theme from '../theme';
import Text from './Text';

const styles = {
  container: {
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  notification: {
    marginLeft: 10,
    marginTop: -5,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    margin: 10,
    padding: 15,
    alignItems: 'center',
  },
};

const initialValues = {
  mass: '',
  height: '',
};

const getBodyMassIndex = (mass, height) => {
  return Math.round(mass / Math.pow(height, 2));
};

const validationSchema = yup.object().shape({
  mass: yup
    .number()
    .min(1, 'Weight must be greater or eqal to 1')
    .required('Weight is required'),
  height: yup
    .number()
    .min(0.5, 'Height must be greater or equal to 0.5')
    .required('Height is required'),
});

const BodyMassIndexForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <View>
      <TextInput
        style={styles.textInput}
        placeholder='Weight (kg)'
        value={formik.values.mass}
        onChangeText={formik.handleChange('mass')}
      />
      {formik.touched.mass && formik.errors.mass && (
        <Text style={styles.notification} color='warning'>
          {formik.errors.mass}
        </Text>
      )}
      <TextInput
        style={styles.textInput}
        placeholder='Height (m)'
        value={formik.values.height}
        onChangeText={formik.handleChange('height')}
      />
      {formik.touched.height && formik.errors.height && (
        <Text style={styles.notification} color='warning'>
          {formik.errors.height}
        </Text>
      )}
      <Pressable style={styles.button} onPress={formik.handleSubmit}>
        <Text>Calculate</Text>
      </Pressable>
    </View>
  );
};

const BodyMassIndexCalculator = () => {
  const onSubmit = (values) => {
    const mass = parseFloat(values.mass);
    const height = parseFloat(values.height);

    if (!isNaN(mass) && !isNaN(height) && height !== 0) {
      console.log(`Your body mass index is: ${getBodyMassIndex(mass, height)}`);
    }
  };

  return <BodyMassIndexForm onSubmit={onSubmit} />;
};

export default BodyMassIndexCalculator;
