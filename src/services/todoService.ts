import { Result } from 'neverthrow';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';
import { ITodoRepository } from '../repositories/todoRepository';
import { AppError } from '../types/errors';

export class TodoService {
  constructor(private todoRepository: ITodoRepository) {}

  async getAllTodos(): Promise<Result<Todo[], AppError>> {
    return await this.todoRepository.findAll();
  }

  async getTodoById(id: string): Promise<Result<Todo, AppError>> {
    return await this.todoRepository.findById(id);
  }

  async createTodo(todoData: CreateTodoRequest): Promise<Result<Todo, AppError>> {
    return await this.todoRepository.create(todoData);
  }

  async updateTodo(id: string, updates: UpdateTodoRequest): Promise<Result<Todo, AppError>> {
    return await this.todoRepository.update(id, updates);
  }

  async deleteTodo(id: string): Promise<Result<boolean, AppError>> {
    return await this.todoRepository.delete(id);
  }

  async getCompletedTodos(): Promise<Result<Todo[], AppError>> {
    const allTodosResult = await this.todoRepository.findAll();
    return allTodosResult.map(todos => todos.filter(todo => todo.completed === true));
  }

  async getPendingTodos(): Promise<Result<Todo[], AppError>> {
    const allTodosResult = await this.todoRepository.findAll();
    return allTodosResult.map(todos => todos.filter(todo => todo.completed === false));
  }
}
