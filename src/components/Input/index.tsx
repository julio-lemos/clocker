import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input as InputBase,
} from '@chakra-ui/react';

export const Input = ({ error, touched, label, ...props }: any) => (
  <Box>
    <FormControl id={props.name} p={4} isRequired>
      <FormLabel>{label}</FormLabel>
      <InputBase size="lg" {...props} />
      {touched && <FormHelperText textColor="#e74c3c">{error}</FormHelperText>}
    </FormControl>
  </Box>
);
