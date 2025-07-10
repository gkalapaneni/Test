import { Router } from 'express';
import { TodoController } from '../controllers/todoController';
import { TodoService } from '../services/todoService';
import { TodoRepository } from '../repositories/todoRepository';
import { Database } from '../config/database';

// Initialize dependencies - this will be called after database connection
export const createTodoRoutes = (): Router => {
  const router = Router();
  
  const database = Database.getInstance();
  const todoRepository = new TodoRepository(database.getDb());
  const todoService = new TodoService(todoRepository);
  const todoController = new TodoController(todoService);

  // GET /api/todos - Get all todos
  router.get('/', todoController.getAllTodos);

  // GET /api/todos/completed - Get completed todos
  router.get('/completed', todoController.getCompletedTodos);

  // GET /api/todos/pending - Get pending todos
  router.get('/pending', todoController.getPendingTodos);

  // GET /api/todos/:id - Get todo by ID
  router.get('/:id', todoController.getTodoById);

  // POST /api/todos - Create new todo
  router.post('/', todoController.createTodo);

  // PUT /api/todos/:id - Update todo
  router.put('/:id', todoController.updateTodo);

  // DELETE /api/todos/:id - Delete todo
  router.delete('/:id', todoController.deleteTodo);

  return router;
};
