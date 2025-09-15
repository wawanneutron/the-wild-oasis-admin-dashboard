import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login as loginAPI } from '../../services/apiAuth'
import toast from 'react-hot-toast'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: ({ email, password }) =>
      loginAPI({
        email,
        password,
      }),

    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user)

      toast.success('Login successful')

      navigate('/dashboard')
    },

    onError: (error) => toast.error(`${error.message}: ${error.cause.message}`),
  })

  return { login, isLoading }
}
