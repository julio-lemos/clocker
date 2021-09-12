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
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { ReactNode, useState } from 'react';
import * as yup from 'yup';

import { Input } from '../Input';

type ScheduleInterface = {
  time: string;
  date: Date;
  name: string;
  phone: string;
};

const setSchedule = async ({ time, date, name, phone }: ScheduleInterface) =>
  axios({
    method: 'post',
    url: '/api/schedule',
    data: {
      time,
      name,
      phone,
      date: format(date, 'yyyy-MM-dd'),
      username: window.location.pathname.replace('/', ''),
    },
  });

interface ModalTimeBlockInterface {
  isOpen: boolean;
  children: ReactNode;
  isSubmitting: any;
  onComplete: () => void;
  onClose: () => void;
}

const ModalTimeBlock = ({
  isOpen,
  onClose,
  onComplete,

  isSubmitting,
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
          {!isSubmitting && (
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          )}

          <Button
            colorScheme="blue"
            mr={3}
            onClick={onComplete}
            isLoading={isSubmitting}
          >
            Reservar horário
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface TimeBlockInterface {
  time: string;
  date: Date;
  disabled: boolean;
  onSuccess: () => void;
}

export const TimeBlock = ({
  time,
  date,
  disabled,
  onSuccess,
}: TimeBlockInterface) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => setIsOpen(prevState => !prevState);

  const {
    values,
    handleSubmit,
    handleChange,
    errors,
    touched,
    handleBlur,
    isSubmitting,
  } = useFormik({
    onSubmit: async values => {
      try {
        await setSchedule({ ...values, time, date });
        toggle();
        onSuccess();
      } catch (err) {
        console.log(err);
      }
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
    <Button
      p={8}
      bg="blue.500"
      color="white"
      onClick={toggle}
      disabled={disabled}
    >
      {time}

      {!disabled && (
        <ModalTimeBlock
          isOpen={isOpen}
          onClose={toggle}
          onComplete={handleSubmit}
          isSubmitting={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              mask="(99) 99999.9999"
              placeholder="(99) 99999-9999"
              size="lg"
              mt={4}
            />
          </>
        </ModalTimeBlock>
      )}
    </Button>
  );
};
