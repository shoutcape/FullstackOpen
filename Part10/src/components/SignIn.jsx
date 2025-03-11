import { useFormik } from 'formik';
import { Pressable, TextInput, View } from 'react-native';
import Text from './Text';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';
import { formStyles } from '../styles.js'


const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const initialValues = {
  username: 'matti',
  password: 'password',
};

export const SignInForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const inValidUsername = formik.touched.username && formik.errors.username;
  const inValidPassword = formik.touched.password && formik.errors.password;

  return (
    <View style={formStyles.container}>
      <TextInput
        style={
          inValidUsername
            ? [formStyles.inputError, formStyles.textInput]
            : formStyles.textInput
        }
        placeholder='Username'
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={formStyles.notification} color='warning'>
          {formik.errors.username}
        </Text>
      )}
      <TextInput
        style={
          inValidPassword
            ? [formStyles.inputError, formStyles.textInput]
            : formStyles.textInput
        }
        placeholder='Password'
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        secureTextEntry
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={formStyles.notification} color='warning'>
          {formik.errors.password}
        </Text>
      )}
      <Pressable style={formStyles.button} onPress={formik.handleSubmit}>
        <Text color='white' fontWeight='bold' fontSize='subheading'>
          Sign in
        </Text>
      </Pressable>
    </View>
  );
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { authenticate } = await signIn({ username, password });
      if (authenticate.accessToken) {
        navigate('/');
      }
    } catch (e) {
      console.log(e);
    }
  };
  return <SignInForm onSubmit={onSubmit} />;
};

export default SignIn;
