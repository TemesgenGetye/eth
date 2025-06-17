import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from '../services/customers';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function useCustomers() {
  const {
    data: customers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  return { customers, isLoading, error };
}

export function useGetCustomer(id: string) {
  const {
    data: customer,
    isLoading: isLoadingCustomer,
    error,
  } = useQuery({
    queryKey: ['customers', id],
    queryFn: () => getCustomer(id),
  });

  return { customer, isLoadingCustomer, error };
}

export function useGetCustomerById(id: string) {
  const {
    data: customer,
    isLoading: isLoadingCustomer,
    error,
  } = useQuery({
    queryKey: ['customers', id],
    queryFn: () => getCustomerById(id),
  });

  return { customer, isLoadingCustomer, error };
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: updateCustomerMutate, isPending: isPendingCustomer } =
    useMutation({
      mutationFn: updateCustomer,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        toast.success('Profile updated successfully!');
        navigate('/');
      },
    });

  return { updateCustomerMutate, isPendingCustomer };
}
