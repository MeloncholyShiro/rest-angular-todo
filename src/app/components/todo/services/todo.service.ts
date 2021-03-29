import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, pluck } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../../../services/http-error-handler.service';
import { Todo } from '../todo.component';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

export interface RawTodoList {
  list: Todo[];
}

@Injectable()
export class TodoService {
  todoUrl = 'http://192.168.31.252:1337/todo'; // URL to web api
  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('TodoService');
  }

  getTodo(): Observable<Todo[]> {
    return this.http
      .get(this.todoUrl)
      .pipe(
        pluck('list'),
        catchError(this.handleError('getTodo', [])))  as Observable<Todo[]>;
  }

  addTodo(note: Todo): Observable<Todo[]> {
    return this.http
      .post(this.todoUrl, note, httpOptions)
      .pipe(catchError(this.handleError('addTodo', note))) as Observable<Todo[]>;
  }

  editTodo(todo: Todo): Observable<Todo> {
    return this.http
      .post(`${this.todoUrl}/${todo.id}`, todo)
      .pipe(catchError(this.handleError('editTodo', todo))) as Observable<Todo>;
  }

  deleteTodo(todoID: string): Observable<Todo[] | string> {
    return this.http
      .delete<Todo[]>(`${this.todoUrl}/${todoID}`)
      .pipe(catchError(this.handleError<string>('editTodo', todoID)));
  }

  clearTodoList(): Observable<Todo[]> {
    // Тоже хз
    return this.http
      .delete(this.todoUrl)
      .pipe(catchError(this.handleError('clearTodoList'))) as Observable<Todo[]>;
  }

  updateIndexes(updatedTodoList: RawTodoList): Observable<Todo[]> {
    return this.http
      .post(`${this.todoUrl}/update`, updatedTodoList)
      .pipe(
        pluck('list'),
        catchError(this.handleError('updateIndexes', updatedTodoList)))  as Observable<Todo[]>;
  }
}
