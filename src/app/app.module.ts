import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TodoComponent } from './components/todo/todo.component';
import { CardComponent } from './components/todo/card/card.component';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/Message/message.service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [AppComponent, TodoComponent, CardComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, DragDropModule],
  providers: [HttpErrorHandler, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
