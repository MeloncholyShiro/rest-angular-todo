import { EventEmitter, Input, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Todo } from '../todo.component';

@Component({
  selector: 'todo-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {
  @Input() todo: Todo;
  @Input() onEdit: (editedTask: Todo) => void;
  @Input() onDelete: (taskID: string) => void;
  
  @Output() checkedTodo = new EventEmitter<Todo>();

  done: boolean;
  isOnEdit: boolean;
  onEditInputValue: string;

  ngOnInit() {
    this.done = this.todo.done;
  }

  setTaskToEdit() {
    this.isOnEdit = true;
    this.onEditInputValue = this.todo.note;
  }

  removeTaskFromEdit() {
    this.isOnEdit = false;
    this.onEditInputValue = '';
  }

  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key !== 'Escape' && event.key !== 'Enter') return;
    if (event.key === 'Enter') {
      this.editHandler(this.onEditInputValue);
    }
    (event.target as HTMLInputElement).blur();
    this.removeTaskFromEdit();
  }

  onClickHandler() {
    this.editHandler(this.onEditInputValue);
  }

  editHandler(newNote: string) {
    this.onEdit({ ...this.todo, note: newNote });
    this.removeTaskFromEdit();
  }

  checkHandler() {
    this.checkedTodo.emit({ ...this.todo, done: this.done });
  }
}
