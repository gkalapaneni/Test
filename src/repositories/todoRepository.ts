import { Collection, Db, ObjectId, WithId } from 'mongodb';
import { Result, ok, err } from 'neverthrow';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';
import { AppError, createDatabaseError, createNotFoundError } from '../types/errors';

export interface TodoDocument {
  _id?: ObjectId;
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodoRepository {
  findAll(): Promise<Result<Todo[], AppError>>;
  findById(id: string): Promise<Result<Todo, AppError>>;
  create(todoData: CreateTodoRequest): Promise<Result<Todo, AppError>>;
  update(id: string, updates: UpdateTodoRequest): Promise<Result<Todo, AppError>>;
  delete(id: string): Promise<Result<boolean, AppError>>;
}

export class TodoRepository implements ITodoRepository {
  private collection: Collection<TodoDocument>;

  constructor(db: Db) {
    this.collection = db.collection<TodoDocument>('todos');
  }

  private documentToTodo(doc: WithId<TodoDocument>): Todo {
    const todo: Todo = {
      id: doc.id,
      title: doc.title,
      completed: doc.completed,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
    
    if (doc.description !== undefined) {
      todo.description = doc.description;
    }
    
    return todo;
  }

  async findAll(): Promise<Result<Todo[], AppError>> {
    try {
      const docs = await this.collection.find({}).sort({ createdAt: -1 }).toArray();
      return ok(docs.map(doc => this.documentToTodo(doc)));
    } catch (error) {
      return err(createDatabaseError('Failed to retrieve todos', error));
    }
  }

  async findById(id: string): Promise<Result<Todo, AppError>> {
    try {
      const doc = await this.collection.findOne({ id });
      if (!doc) {
        return err(createNotFoundError('Todo', id));
      }
      return ok(this.documentToTodo(doc));
    } catch (error) {
      return err(createDatabaseError('Failed to retrieve todo by id', error));
    }
  }

  async create(todoData: CreateTodoRequest): Promise<Result<Todo, AppError>> {
    try {
      const { v4: uuidv4 } = await import('uuid');
      const now = new Date();
      
      const todoDocument: TodoDocument = {
        id: uuidv4(),
        title: todoData.title,
        completed: false,
        createdAt: now,
        updatedAt: now
      };
      
      if (todoData.description !== undefined) {
        todoDocument.description = todoData.description;
      }

      await this.collection.insertOne(todoDocument);
      return ok(this.documentToTodo(todoDocument as WithId<TodoDocument>));
    } catch (error) {
      return err(createDatabaseError('Failed to create todo', error));
    }
  }

  async update(id: string, updates: UpdateTodoRequest): Promise<Result<Todo, AppError>> {
    try {
      const updateDoc: Partial<TodoDocument> = {
        updatedAt: new Date()
      };

      if (updates.title !== undefined) {
        updateDoc.title = updates.title;
      }
      if (updates.description !== undefined) {
        updateDoc.description = updates.description;
      }
      if (updates.completed !== undefined) {
        updateDoc.completed = updates.completed;
      }

      const result = await this.collection.findOneAndUpdate(
        { id },
        { $set: updateDoc },
        { returnDocument: 'after' }
      );

      if (!result) {
        return err(createNotFoundError('Todo', id));
      }
      
      return ok(this.documentToTodo(result));
    } catch (error) {
      return err(createDatabaseError('Failed to update todo', error));
    }
  }

  async delete(id: string): Promise<Result<boolean, AppError>> {
    try {
      const result = await this.collection.deleteOne({ id });
      if (result.deletedCount === 0) {
        return err(createNotFoundError('Todo', id));
      }
      return ok(true);
    } catch (error) {
      return err(createDatabaseError('Failed to delete todo', error));
    }
  }
}
