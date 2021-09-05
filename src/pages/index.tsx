import { useEffect, useState } from 'react';
import firebase from './../config/firebase';
import { Login, Agenda } from './../components';
import { Spinner } from '@chakra-ui/spinner';
import { Container } from '@chakra-ui/layout';

interface Auth {
  loading: boolean;
  user: any;
}

export default function Home() {
  const [auth, setAuth] = useState<Auth>({
    loading: true,
    user: null,
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setAuth({
        loading: false,
        user,
      });
    });
  }, []);

  if (auth.loading) {
    return (
      <Container p={8} centerContent>
        <Spinner />
      </Container>
    );
  }

  // const authenticatedUser = firebase.auth().currentUser;
  return auth.user ? <Agenda /> : <Login />;
}
