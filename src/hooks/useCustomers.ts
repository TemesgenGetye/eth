import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, updateCustomer } from '../services/customers';

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

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { mutate: updateCustomerMutate, isPending: isPendingCustomer } =
    useMutation({
      mutationFn: updateCustomer,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      },
    });

  return { updateCustomerMutate, isPendingCustomer };
}
