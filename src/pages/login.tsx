import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as yup from 'yup';

import { Logo, useAuth } from '../components';

import type { NextPage } from 'next';
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('E-mail inválido')
    .required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
});

const Login = () => {
  const [auth, { login }] = useAuth();
  const router = useRouter();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    onSubmit: login,
    validationSchema,
    initialValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(): void {
    handleSubmit();
  }

  useEffect(() => {
    auth.user && router.push('/agenda');
  }, [auth.user, router]);

  return (
    <Box height="100vh" display="flex" alignItems="center" bg="gray.50">
      <Container p={4} centerContent>
        <Logo size={300} />
        <Box p={4} mt={8}>
          <Text>Crie sua agenda compartilhada</Text>
        </Box>

        <Box width="350px" as="form">
          <FormControl id="email" p={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              size="lg"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && (
              <FormHelperText textColor="#e74c3c">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl id="password" p={4} isRequired>
            <FormLabel>Senha</FormLabel>
            <Input
              size="lg"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && (
              <FormHelperText textColor="#e74c3c">
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>

          <Box p={4}>
            <Button
              colorScheme="blue"
              width="100%"
              onClick={onSubmit}
              isLoading={isSubmitting}
            >
              Entrar
            </Button>
          </Box>
        </Box>

        <Text color="gray.500">
          <Link href="/signup">Ainda não tem uma conta? Cadastre-se</Link>
        </Text>
      </Container>
    </Box>
  );
};

export default Login;
