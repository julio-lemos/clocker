import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  IconButton,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import { addDays, format, subDays } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { formatDate, Logo, TimeBlock, useAuth } from '../components';

interface HeaderProps {
  children: React.ReactNode;
}

const getSchedule = async (when: Date) =>
  axios({
    method: 'get',
    url: '/api/schedule',
    params: {
      username: window.location.pathname.replace('/', ''),
      date: format(when, 'yyyy-MM-dd'),
    },
  });

const Header = ({ children }: HeaderProps) => (
  <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Box>
);

const Schedule = () => {
  const [auth, { logout }] = useAuth();
  const router = useRouter();
  const [when, setWhen] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const addDay = () => {
    setWhen(prevState => addDays(prevState, 1));
  };
  const removeDay = () => {
    setWhen(prevState => subDays(prevState, 1));
  };

  useEffect(() => {
    getSchedule(when).then(res => {
      setLoading(false);
      setData(res.data);
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

      <SimpleGrid p={4} columns={2} spacing={4}>
        {loading && (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        )}
        {data.map(({ time, isBlocked }: any) => (
          <TimeBlock time={time} key={time} date={when} disabled={isBlocked} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Schedule;
