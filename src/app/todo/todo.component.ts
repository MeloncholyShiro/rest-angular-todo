import { Component, OnInit } from '@angular/core';
import { TodoService } from './todo.service';
import {
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

export interface Todo {
  id: string;
  note: string;
  done: boolean;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  providers: [TodoService],
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  inputValue: string = '';
  taskOnEdit: string = '';
  todoList: Todo[] = [];

  constructor(private todoService: TodoService) {}

  drop(event: CdkDragDrop<Todo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.todoList, event.previousIndex, event.currentIndex);
      this.updateTodoList();
    }
  }

  ngOnInit() {
    this.getTodo();
  }

  getTodo(): void {
    this.todoService
      .getTodo()
      .subscribe((todoList: any) => (this.todoList = todoList.list));
  }

  addTask(note: string): void {
    this.todoService
      .addTodo(({ note } as unknown) as Todo[]) // Как это брехня работать должна?
      .subscribe((todoList: any) => (this.todoList = todoList.list)); // Сгорела жопа на этом моменте, я не понимаю как эта "Великолепная конструкция" принимает в себя типы, наугад что ли?
  }

  editTask(todoToEdit: Todo): void {
    this.todoService
      .editTodo(todoToEdit)
      .subscribe((todoList: any) => (this.todoList = todoList.list));
  }

  deleteTask(taskID: string): void {
    this.todoService
      .deleteTodo(taskID)
      .subscribe((todoList: any) => (this.todoList = todoList.list));
  }

  clearTodoList(): void {
    this.todoService
      .clearTodoList()
      .subscribe((emptyArray: any) => (this.todoList = emptyArray.list));
  }

  updateTodoList(): void {
    this.todoService
      .updateIndexes({ list: this.todoList })
      .subscribe((todoList: any) => (this.todoList = todoList.list));
  }

  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key !== 'Escape' && event.key !== 'Enter') return;
    if (event.key === 'Enter') {
      this.onSendHandler();
    }
    this.inputValue = '';
    (event.target as HTMLInputElement).blur();
  }

  onSendHandler() {
    this.addTask(this.inputValue);
    this.inputValue = '';
  }

  onEditTaskHandler(editedTask: Todo) {
    this.editTask(editedTask);
  }

  onDeleteHandler(id: string) {
    this.deleteTask(id);
  }
}
