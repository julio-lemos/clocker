import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

export const formatDate = (date: Date, pattern: string) =>
  format(date, pattern, { locale: ptBR });
