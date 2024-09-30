import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';


@Injectable()
export class TodoService {

  private todos: Todo[] = [
    { id: 1, description: 'Piedra del Alma', done: false },
    { id: 2, description: 'Piedra del Tiempo', done: false },
    { id: 3, description: 'Piedra del Espacio', done: true },
  ];

  create({description}: CreateTodoDto): Todo {

    const todoService = new Todo();
    todoService.id = Math.max(...this.todos.map( todoItem => todoItem.id ), 0 ) + 1;
    todoService.description = description;

    this.todos.push( todoService );

    return todoService;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const foundTodo = this.todos.find(todoItem => todoItem.id === id);
    if ( !foundTodo ) throw new NotFoundException(`TODO with id #${ id } not found`);
    return foundTodo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    
    const { done, description } = updateTodoDto;
    const todoUpdate = this.findOne( id );

    if ( done !== undefined ) todoUpdate.done = done;
    if ( description ) todoUpdate.description = description;

    this.todos = this.todos.map( dbtodo => {
      if ( dbtodo.id === id ) 
        return todoUpdate;
      return dbtodo;
    })
    return todoUpdate;
  }

  remove(id: number) {
    
    this.findOne( id );

    this.todos = this.todos.filter( todoItem => todoItem.id !== id );

  }
}
