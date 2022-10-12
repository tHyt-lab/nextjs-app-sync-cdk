import { useCallback, useState } from 'react';
import { HStack, Text, Checkbox, Spinner } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Todo, useDeleteTodoMutation, useToggleTodoMutation } from '../../graphql/generated/generated-types';

type TodoItemProps = {
  todo: Todo;
};

export const TodoItem = ({ todo }: TodoItemProps) => {
  const [todoItem, setTodoItem] = useState<Todo | null>(todo);

  const [toggleTodo, toggleTodoStatus] = useToggleTodoMutation();
  const [deleteTodo, deleteTodoStatus] = useDeleteTodoMutation();

  const handlerToggleTodo = useCallback(() => {
    if (!todoItem || toggleTodoStatus.loading) return;
    toggleTodo({
      variables: {
        toggleTodoInput: { id: todoItem.id, completed: !todoItem.completed },
      },
      onCompleted: () => {
        setTodoItem({ ...todoItem, completed: !todoItem.completed });
      },
    });
  }, [toggleTodoStatus.loading, todoItem, toggleTodo]);

  const handlerDeleteTodo = useCallback(() => {
    if (!todoItem || deleteTodoStatus.loading) return;
    deleteTodo({
      variables: { id: todoItem.id },
      onCompleted: () => setTodoItem(null),
    });
  }, [deleteTodoStatus, todoItem, deleteTodo]);

  if (!todoItem) return null;

  return (
    <HStack borderColor="blue.300" borderWidth={1} p={8} w="full" height="16" justify="space-between" spacing={8}>
      <HStack spacing={8}>
        {toggleTodoStatus.loading ? (
          <Spinner size="md" thickness="4px" emptyColor="gray.200" color="blue.500" />
        ) : (
          <Checkbox size="lg" isChecked={todoItem.completed} onChange={handlerToggleTodo} />
        )}
        <Text
          textDecoration={todoItem.completed ? 'line-through' : undefined}
          color={todoItem.completed ? 'gray.500' : 'black'}
        >
          {todoItem.title}
        </Text>
      </HStack>

      {deleteTodoStatus.loading ? (
        <Spinner size="md" thickness="4px" emptyColor="gray.200" color="blue.500" />
      ) : (
        <DeleteIcon color="blue.500" boxSize={5} _hover={{ boxSize: 6 }} onClick={handlerDeleteTodo} />
      )}
    </HStack>
  );
};
