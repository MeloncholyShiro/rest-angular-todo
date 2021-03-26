import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { Todo } from './todo.component';

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
  todoUrl = 'http://localhost:1337/todo'; // URL to web api
  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('TodoService');
  }

  getTodo(): Observable<Todo[]> {
    return this.http
      .get<Todo[]>(this.todoUrl)
      .pipe(catchError(this.handleError('getTodo', [])));
  }

  addTodo(note: Todo[]): Observable<Todo[]> {
    return this.http
      .post<Todo[]>(this.todoUrl, note, httpOptions)
      .pipe(catchError(this.handleError('addTodo', note)));
  }

  editTodo(todo: Todo): Observable<Todo> {
    return this.http
      .post<Todo>(`${this.todoUrl}/${todo.id}`, todo)
      .pipe(catchError(this.handleError('editTodo', todo)));
  }

  deleteTodo(todoID: string): Observable<unknown> {
    return this.http
      .delete<unknown>(`${this.todoUrl}/${todoID}`)
      .pipe(catchError(this.handleError('editTodo', todoID)));
  }

  clearTodoList(): Observable<unknown> {
    // Тоже хз
    return this.http
      .delete(this.todoUrl)
      .pipe(catchError(this.handleError('clearTodoList')));
  }

  updateIndexes(updatedTodoList: RawTodoList): Observable<RawTodoList> {
    return this.http
      .post<RawTodoList>(`${this.todoUrl}/update`, updatedTodoList)
      .pipe(catchError(this.handleError('updateIndexes', updatedTodoList)));
  }
}
