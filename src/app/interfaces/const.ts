import { Select } from './charge.interface';

export const cardsList = [
  {
    fk_idCard: 1,
    label: 'BBVA',
    value: 'bbva',
    // fk_fk_idCard: 2,
  },
  {
    fk_idCard: 5,
    label: 'Hey Banco',
    value: 'hey',
    // fk_fk_idCard: 3,
  },
  {
    fk_idCard: 3,
    label: 'Efectivo',
    value: 'efectivo',
    // fk_fk_idCard: 4,
  },
  {
    fk_idCard: 4,
    label: 'Banamex',
    value: 'banamex',
    // fk_idCard: 5,
  },
  {
    fk_idCard: 6,
    label: 'Invex',
    value: 'invex',
  },
  {
    fk_idCard: 7,
    label: 'Banorte',
    value: 'banorte',
  },
  {
    fk_idCard: 8,
    label: 'Santander',
    value: 'santander',
  },
];

export const categories: Select[] = [
  { value: 'currency_exchange', label: 'Inversiones' },
  { value: 'shopping_bag', label: 'Shopping' },
  { value: 'home', label: 'Casa' },
  { value: 'local_bar', label: 'Fiesta' },
  { value: 'lunch_dining', label: 'Comida' },
  { value: 'flight', label: 'Viajes' },
  { value: 'sentiment_satisfied_alt', label: 'Gustitos' },
];

// export const endpoint = 'https://api.bonmarketit.com/';
export const endpoint = "http://localhost:4000/";
// export const endpoint = "https://api.bonmarketit.com/";
export const localendpoint = 'http://localhost:8080/';
