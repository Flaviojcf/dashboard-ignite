import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import Link from "next/link";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Sidebar } from "../../components/Siderbar";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../services/api";
import { queryClient } from "../../services/QueryClient";
import { useRouter } from "next/router";

type CreateUserFormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const createUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  email: yup.string().required("E-mail obrigatório.").email("E-mail inválido"),
  password: yup
    .string()
    .required("Senha obrigatória.")
    .min(6, "É necessário no mínimo 6 caracteres"),
  passwordConfirmation: yup
    .string()
    .oneOf([null, yup.ref("password")], "As senhas precisam ser iguais"),
});

export default function CreateUser() {
  const router = useRouter()
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });
  const { errors } = formState;

  const createUser = useMutation(async (user: CreateUserFormData) => {
    try {
      const response = await api.post("users", {
        user: {
          ...user,
          created_at: new Date(),
        },
      });
      return response.data.user;
    } catch (err) {
      console.log(err);
    }
  }, {
    onSuccess: () =>{
      queryClient.invalidateQueries('users')
    }
  });

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (
    values
  ) => {
    await createUser.mutateAsync(values);
    router.push('/users')
  };

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="4">
        <Sidebar />
        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Criar usuário
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="name"
                label="Nome Completo"
                type="text"
                {...register("name")}
                error={errors.name}
              />
              <Input
                name="email"
                label="E-mail"
                type="email"
                {...register("email")}
                error={errors.email}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="password"
                label="Senha"
                type="password"
                {...register("password")}
                error={errors.password}
              />
              <Input
                name="password"
                label="Confirmação de Senha"
                type="password"
                {...register("passwordConfirmation")}
                error={errors.passwordConfirmation}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button
                type="submit"
                colorScheme="pink"
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
