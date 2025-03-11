import { useFormik } from 'formik';
import { Pressable, TextInput, View } from 'react-native';
import Text from './Text';
import * as yup from 'yup';
import { formStyles } from '../styles';
import useCreateReview from '../hooks/useCreateReview';

const validationSchema = yup.object().shape({
  ownerName: yup.string().required('Repository owner name is required'),
  repositoryName: yup.string().required('Repository name is required'),
  rating: yup.number().min(0).max(100).required('Rating is required'),
});

const initialValues = {
  ownerName: 'rzwitserloot',
  repositoryName: 'lombok',
  rating: '10',
  text: 'Testi reviewi',
};

export const CreateReviewForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const inValidRepositoryOwnerName = formik.touched.ownerName && formik.errors.ownerName;
  const invalidRepositoryName = formik.touched.repositoryName && formik.errors.repositoryName;
  const invalidRating = formik.touched.rating && formik.errors.rating;

  return (
    <View style={formStyles.container}>
      <TextInput
        style={
          inValidRepositoryOwnerName
            ? [formStyles.inputError, formStyles.textInput]
            : formStyles.textInput
        }
        placeholder='Repository owner name'
        value={formik.values.ownerName}
        onChangeText={formik.handleChange('ownerName')}
      />
      {inValidRepositoryOwnerName && (
        <Text style={formStyles.notification} color='warning'>
          {formik.errors.ownerName}
        </Text>
      )}
      <TextInput
        style={
          invalidRepositoryName
            ? [formStyles.inputError, formStyles.textInput]
            : formStyles.textInput
        }
        placeholder='Repository name'
        value={formik.values.repositoryName}
        onChangeText={formik.handleChange('repositoryName')}
      />
      {invalidRepositoryName && (
        <Text style={formStyles.notification} color='warning'>
          {formik.errors.repositoryName}
        </Text>
      )}
      <TextInput
        style={
          invalidRating
            ? [formStyles.inputError, formStyles.textInput]
            : formStyles.textInput
        }
        placeholder='Rating between 0 and 100'
        value={formik.values.rating}
        onChangeText={formik.handleChange('rating')}
      />
      {invalidRating && (
        <Text style={formStyles.notification} color='warning'>
          {formik.errors.rating}
        </Text>
      )}
      <TextInput
        style={formStyles.textInput}
        placeholder='Review'
        value={formik.values.text}
        onChangeText={formik.handleChange('text')}
        multiline
      />
      <Pressable style={formStyles.button} onPress={formik.handleSubmit}>
        <Text color='white' fontWeight='bold' fontSize='subheading'>
          Create a Review
        </Text>
      </Pressable>
    </View>
  );
};

const ReviewForm = () => {
  const [createReview] = useCreateReview()
  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text} = values
    await createReview({ownerName, repositoryName, rating, text})
  };
  return <CreateReviewForm onSubmit={onSubmit} />;
};

export default ReviewForm;
