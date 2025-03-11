import { useFormik } from 'formik';
import { Pressable, TextInput, View } from 'react-native';
import Text from './Text';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';
import { formStyles } from '../styles.js';
import useSignUp from '../hooks/useSignUp.js';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  cpassword: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password'), null], 'Passwords don`t match'),
});

const initialValues = {
  username: 'ville',
  password: 'salasana',
  cpassword: 'salasana',
};

export const SignInForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const inValidUsername = formik.touched.username && formik.errors.username;
  const inValidPassword = formik.touched.password && formik.errors.password;
  const inValidCPassword = formik.touched.cpassword && formik.errors.cpassword;

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
      {inValidUsername && (
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
      {inValidPassword && (
        <Text style={formStyles.notification} color='warning'>
          {formik.errors.password}
        </Text>
      )}
      <TextInput
        style={
          inValidCPassword
            ? [formStyles.inputError, formStyles.textInput]
            : formStyles.textInput
        }
        placeholder='Confirm Password'
        value={formik.values.cpassword}
        onChangeText={formik.handleChange('cpassword')}
        secureTextEntry
      />
      {inValidCPassword && (
        <Text style={formStyles.notification} color='warning'>
          {formik.errors.cpassword}
        </Text>
      )}
      <Pressable style={formStyles.button} onPress={formik.handleSubmit}>
        <Text color='white' fontWeight='bold' fontSize='subheading'>
          Sign Up
        </Text>
      </Pressable>
    </View>
  );
};

const SignUp = () => {
  const [signUp] = useSignUp();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;
    try {
      const { id } = await signUp({ username, password });
      if (id) {
        navigate('/signIn');
      }
    } catch (e) {
      console.log(e);
    }
  };
  return <SignInForm onSubmit={onSubmit} />;
};

export default SignUp;
