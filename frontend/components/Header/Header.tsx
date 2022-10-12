import { Flex, Text } from '@chakra-ui/react';

type HeaderContainerProps = {
  children: React.ReactNode;
};

const HeaderContainer = ({ children }: HeaderContainerProps) => {
  return (
    <Flex align="center" justify="space-between" wrap="wrap" w="100%" p={8} bg="blue.400" color="white">
      {children}
    </Flex>
  );
};

export const Header = () => {
  return (
    <HeaderContainer>
      <Text fontSize={24} fontWeight="bold">
        Todo App
      </Text>
    </HeaderContainer>
  );
};
