import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  IconButton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { addDays, format, subDays } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { formatDate, Logo, useAuth } from '../components';
import { getToken } from '../config/firebase/client';

interface HeaderProps {
  children: React.ReactNode;
}

interface AgendaBlocksProps {
  time: string;
  name: string;
  phone: string;
}

const getAgenda = async (when: Date) => {
  const token = await getToken();
  return axios({
    method: 'get',
    url: '/api/agenda',
    params: {
      date: format(when, 'yyyy-MM-dd'),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const Header = ({ children }: HeaderProps) => (
  <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Box>
);

const AgendaBlock = (AgendaProps: AgendaBlocksProps) => {
  const { name, phone, time } = AgendaProps;

  return (
    <Box
      display="flex"
      alignItems="center"
      bg="gray.100"
      borderRadius={8}
      p={4}
      mt={2}
    >
      <Box flex={1}>{time}</Box>
      <Box>
        <Box textAlign="right">
          <Text fontSize="xl">{name}</Text>
          <Text>{phone}</Text>
        </Box>
      </Box>
    </Box>
  );
};

const Agenda = () => {
  const [auth, { logout }] = useAuth();
  const router = useRouter();
  const [when, setWhen] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);

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
    getAgenda(when).then(res => {
      setData(res.data);
      setLoading(false);
    });
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

      {loading && (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}

      {data?.map((doc: any) => (
        <AgendaBlock
          key={doc.time}
          time={doc.time}
          name={doc.name}
          phone={doc.phone}
        />
      ))}
    </Container>
  );
};

export default Agenda;
