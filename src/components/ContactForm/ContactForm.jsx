import { nanoid } from 'nanoid';
import {
  Container,
  Text,
  Input,
  Button,
  ErrorText,
} from './ContactForm.styled';
import { Formik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getContacts } from '../../redux/selectors';
import { addContact } from '../../redux/operations';

const initialValues = {
  name: '',
  number: '',
};

let userSchema = yup.object({
  name: yup
    .string()
    .matches(
      /^[a-zA-Zа-яА-ЯґєіїҐЄІЇ]+(([' -][a-zA-Zа-яА-ЯґєіїҐЄІЇ ])?[a-zA-Zа-яА-ЯґєіїҐЄІЇ]*)*$/
    )
    .required(),
  number: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/
    )
    .required(),
});

export function ContactForm() {
  const dispatch = useDispatch();
  const contacts = useSelector(getContacts);

  const handleOnSubmit = (values, actions) => {
    if (
      contacts.find(
        contact => contact.name.toLowerCase() === values.name.toLowerCase()
      ) === undefined
    ) {
      const item = { id: nanoid(), name: values.name, number: values.number };
      dispatch(addContact(item));
      actions.resetForm();
    } else {
      alert(`${values.name} is already in contacts.`);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      validationSchema={userSchema}
    >
      <Container>
        <Text>Name</Text>
        <Input
          type="text"
          name="name"
          title="Name may contain only letters, apostrophe, dash and spaces."
        />
        <ErrorMessage name="name">
          {() => (
            <ErrorText>
              Wrong name: Name may contain only letters, apostrophe, dash and
              spaces.
            </ErrorText>
          )}
        </ErrorMessage>
        <Text>Number</Text>
        <Input
          type="tel"
          name="number"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
        />
        <ErrorMessage name="number">
          {() => (
            <ErrorText>
              Phone number must be digits and can contain spaces, dashes,
              parentheses and can start with +
            </ErrorText>
          )}
        </ErrorMessage>
        <Button type="Submit">Add contact</Button>
      </Container>
    </Formik>
  );
}