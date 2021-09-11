import { Container, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuth } from './../components';

export default function Home() {
  const [auth] = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading) {
      auth.user ? router.push('/agenda') : router.push('/login');
    }
  }, [auth.loading, auth.user, router]);

  return (
    <Container p={8} centerContent>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Container>
  );
}
