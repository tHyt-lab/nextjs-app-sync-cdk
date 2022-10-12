import { VStack } from '@chakra-ui/react';
import { Header } from '../Header/Header';
import { TodoScreen } from '../Todo';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_APPSYNC_API_URL,
    headers: {
      'X-Api-Key': process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
    },
  }),
  cache: new InMemoryCache(),
});

export const Home = () => {
  return (
    <VStack>
      <ApolloProvider client={client}>
        <Header />
        <TodoScreen />
      </ApolloProvider>
    </VStack>
  );
};
