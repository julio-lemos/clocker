import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input as InputBase,
} from '@chakra-ui/react';
import InputMask from 'react-input-mask';

export const Input = ({ error, touched, label, mask, ...props }: any) => {
  return (
    <Box>
      <FormControl id={props.name} p={4} isRequired>
        <FormLabel>{label}</FormLabel>
        <InputBase
          as={InputMask}
          mask={mask}
          maskPlaceholder={null}
          size="lg"
          minLength="5"
          {...props}
        />
        {touched && (
          <FormHelperText textColor="#e74c3c">{error}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};
