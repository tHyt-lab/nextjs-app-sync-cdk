import { Button, HStack, Input } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useAddTodoMutation, namedOperations } from '../../graphql/generated/generated-types';

export const TodoInput = () => {
  const [titleInput, setTitleInput] = useState('');
  const clearTitleInput = useCallback(() => setTitleInput(''), []);

  const [addTodo, { loading }] = useAddTodoMutation();

  const handleAddTodo = useCallback(() => {
    addTodo({
      variables: { addTodoInput: { title: titleInput } },
      refetchQueries: [namedOperations.Query.GetTodos],
      onCompleted: clearTitleInput,
    });
  }, [titleInput, addTodo, clearTitleInput]);

  return (
    <HStack spacing={6}>
      <Input
        borderColor="blue.500"
        borderWidth={2}
        height={12}
        width={400}
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
      />
      <Button paddingX={8} colorScheme="blue" disabled={!titleInput} isLoading={loading} onClick={handleAddTodo}>
        Add Todo
      </Button>
    </HStack>
  );
};
