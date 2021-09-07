import { useEffect } from 'react';
import { useAuth } from './../components';
import { Spinner, Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function Home() {
  const [auth] = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading) {
      auth.user ? router.push('/agenda') : router.push('/login');
    }
  }, [auth.loading]);

  return (
    <Container p={8} centerContent>
      <Spinner />
    </Container>
  );
}
