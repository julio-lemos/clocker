import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import axios from 'axios';
import { useFormik } from 'formik';
import { ReactNode, useState } from 'react';
import * as yup from 'yup';

import { Input } from '../Input';

type ScheduleType = {
  when: Date;
  name: string;
  phone: string;
};

const setSchedule = async (dataSchedule: ScheduleType) =>
  axios({
    method: 'post',
    url: '/api/schedule',
    data: {
      ...dataSchedule,
      username: window.location.pathname.replace('/', ''),
    },
  });

interface ModalTimeBlockInterface {
  isOpen: boolean;
  children: ReactNode;
  onComplete: () => void;
  onClose: () => void;
}

const ModalTimeBlock = ({
  isOpen,
  onClose,
  onComplete,
  children,
}: ModalTimeBlockInterface) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Faça sua reserva</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" mr={3} onClick={onComplete}>
            Reservar horário
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const TimeBlock = ({ time }: any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => setIsOpen(prevState => !prevState);

  const { values, handleSubmit, handleChange, errors, touched, handleBlur } =
    useFormik({
      onSubmit: values => {
        setSchedule({ ...values, when: time });
      },
      initialValues: {
        name: '',
        phone: '',
      },
      validationSchema: yup.object().shape({
        name: yup.string().required('Preenchimento obrigatório'),
        phone: yup.string().required('Preenchimento obrigatório'),
      }),
    });

  return (
    <Button p={8} bg="blue.500" color="white" onClick={toggle}>
      {time}

      <ModalTimeBlock
        isOpen={isOpen}
        onClose={toggle}
        onComplete={handleSubmit}
      >
        <>
          <Input
            label="Nome"
            name="name"
            touched={touched.name}
            error={errors.name}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Digite seu nome"
            size="lg"
          />
          <Input
            label="Telefone"
            name="phone"
            touched={touched.phone}
            error={errors.phone}
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(99) 9 9999-9999"
            size="lg"
            mt={4}
          />
        </>
      </ModalTimeBlock>
    </Button>
  );
};
