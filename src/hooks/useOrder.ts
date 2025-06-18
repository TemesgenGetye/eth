import { useMutation } from '@tanstack/react-query';
import supabase from '../services/supabase';

export const useOrder = () =>
  useMutation({
    mutationFn: async ({
      customer_order,
      detail,
    }: {
      customer_order: string;
      detail: [
        {
          product: number;
          quantity: number;
        },
      ];
    }) => {
      const { data, error } = await supabase.from('orders').insert({
        customer_order,
        detail,
      }).select();

      console.log(data);
      console.log(error);

      if (error) {
        throw error;
      }
      return data;
    },
  });
