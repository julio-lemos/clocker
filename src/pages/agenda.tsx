import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuth } from '../components';

const Agenda = () => {
  const [auth, { logout }] = useAuth();
  const router = useRouter();

  useEffect(() => {
    !auth.user && router.push('/');
  }, [auth.user, router]);

  return (
    <div>
      <Button onClick={logout}>Sair</Button>
    </div>
  );
};

export default Agenda;
