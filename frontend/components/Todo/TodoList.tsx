import { VStack } from '@chakra-ui/react';
import { Todo } from '../../graphql/generated/generated-types';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
};

export const TodoList = ({ todos }: TodoListProps) => {
  return (
    <VStack w="full" paddingX={8}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </VStack>
  );
};
