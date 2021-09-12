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
      bg="#EDF2F7"
      borderRadius={6}
      p={4}
      mt={2}
    >
      <Box flex={1}>
        <Text color="#4E84D4" fontWeight="400">
          {time}
        </Text>
      </Box>

      <Box>
        <Box textAlign="right">
          <Text fontSize="xl" fontWeight="700">
            {name}
          </Text>
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
    setLoading(true);
    getAgenda(when).then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, [when]);

  return (
    <Box height="100vh" display="flex" alignItems="center">
      <Container
        height="100%"
        display="flex"
        flexDirection="column"
        mt={5}
        mb={5}
      >
        <Header>
          <Logo size={180} />
          <Button onClick={logout}>Sair</Button>
        </Header>

        <Box
          mt={8}
          mb={8}
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

        <Box>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Box>
          ) : (
            data?.map((doc: any) =>
              doc.information ? (
                <AgendaBlock
                  key={doc.information.time}
                  time={doc.information.time}
                  name={doc.information.name}
                  phone={doc.information.phone}
                />
              ) : (
                <Box
                  display="flex"
                  border="1px"
                  borderColor="#4E84D4"
                  borderRadius={6}
                  alignItems="center"
                  justifyContent="center"
                  p={4}
                  mt={2}
                >
                  <Text color="#4E84D4">{doc.time} - Livre</Text>
                </Box>
              ),
            )
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Agenda;
