import { Request, Response } from 'express';
import { TodoService } from '../services/todoService';
import { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';
import { AppError } from '../types/errors';

export class TodoController {
  private todoService: TodoService;

  constructor(todoService: TodoService) {
    this.todoService = todoService;
  }

  private handleError(res: Response, error: AppError): void {
    console.error('Error in TodoController:', error);
    
    switch (error.type) {
      case 'NOT_FOUND':
        res.status(404).json({ 
          error: 'Resource not found',
          message: error.message,
          resource: error.resource,
          id: error.id
        });
        break;
      case 'VALIDATION_ERROR':
        res.status(400).json({
          error: 'Validation error',
          message: error.message,
          field: error.field
        });
        break;
      case 'DATABASE_ERROR':
      default:
        res.status(500).json({ 
          error: 'Internal server error',
          message: 'An unexpected error occurred'
        });
        break;
    }
  }

  getAllTodos = async (_req: Request, res: Response): Promise<void> => {
    const result = await this.todoService.getAllTodos();
    
    if (result.isOk()) {
      res.json(result.value);
    } else {
      this.handleError(res, result.error);
    }
  };

  getTodoById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await this.todoService.getTodoById(id!);
    
    if (result.isOk()) {
      res.json(result.value);
    } else {
      this.handleError(res, result.error);
    }
  };

  createTodo = async (req: Request, res: Response): Promise<void> => {
    const { title, description }: CreateTodoRequest = req.body;
    const createRequest: CreateTodoRequest = { title };
    if (description !== undefined) {
      createRequest.description = description;
    }
    const result = await this.todoService.createTodo(createRequest);
    
    if (result.isOk()) {
      res.status(201).json(result.value);
    } else {
      this.handleError(res, result.error);
    }
  };

  updateTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updates: UpdateTodoRequest = req.body;
    const result = await this.todoService.updateTodo(id!, updates);
    
    if (result.isOk()) {
      res.json(result.value);
    } else {
      this.handleError(res, result.error);
    }
  };

  deleteTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await this.todoService.deleteTodo(id!);
    
    if (result.isOk()) {
      res.status(204).send();
    } else {
      this.handleError(res, result.error);
    }
  };

  getCompletedTodos = async (_req: Request, res: Response): Promise<void> => {
    const result = await this.todoService.getCompletedTodos();
    
    if (result.isOk()) {
      res.json(result.value);
    } else {
      this.handleError(res, result.error);
    }
  };

  getPendingTodos = async (_req: Request, res: Response): Promise<void> => {
    const result = await this.todoService.getPendingTodos();
    
    if (result.isOk()) {
      res.json(result.value);
    } else {
      this.handleError(res, result.error);
    }
  };
}
