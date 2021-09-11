import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Button, Container, IconButton } from '@chakra-ui/react';
import axios from 'axios';
import { addDays, subDays } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { formatDate, Logo, useAuth } from '../components';

interface getAgendaProps {
  token?: string;
  when: Date;
}

interface HeaderProps {
  children: React.ReactNode;
}

const getAgenda = ({ token, when }: getAgendaProps) =>
  axios({
    method: 'get',
    url: '/api/agenda',
    params: {
      when,
    },
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

const Header = ({ children }: HeaderProps) => (
  <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Box>
);

const Agenda = () => {
  const [auth, { logout }] = useAuth();
  const router = useRouter();
  const [when, setWhen] = useState(() => new Date());

  const addDay = () => {
    setWhen(prevState => addDays(prevState, 1));
  };
  const removeDay = () => {
    setWhen(prevState => subDays(prevState, 1));
  };

  useEffect(() => {
    !auth.user && router.push('/');
  }, [auth.user, router]);

  useEffect(() => {
    getAgenda({ when });
  }, [when]);

  return (
    <Container>
      <Header>
        <Logo size={150} />
        <Button onClick={logout}>Sair</Button>
      </Header>

      <Box
        mt={8}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          aria-label="left"
          icon={<ChevronLeftIcon />}
          bg="transparent"
          onClick={removeDay}
        />

        <Box>{formatDate(when, 'PPPP')}</Box>

        <IconButton
          aria-label="left"
          icon={<ChevronRightIcon />}
          bg="transparent"
          onClick={addDay}
        />
      </Box>
    </Container>
  );
};

export default Agenda;
