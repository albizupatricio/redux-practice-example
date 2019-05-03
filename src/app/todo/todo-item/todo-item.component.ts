import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Todo } from '../model/todo.model';
import { FormControl, Validators } from '@angular/forms';
import { AppState } from 'src/app/app.reducers';
import { Store } from '@ngrx/store';
import * as fromTodo from '../todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styles: []
})
export class TodoItemComponent implements OnInit {
  @Input() todo: Todo;
  @ViewChild('txtInputFisico') txtInputFisico: ElementRef;

  editando: boolean;
  chkField: FormControl;
  txtInput: FormControl;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.chkField = new FormControl(this.todo.completado);
    this.txtInput = new FormControl(this.todo.texto, Validators.required);
    this.chkField.valueChanges.subscribe(() => {
      const accion = new  fromTodo.ToggleTodoAction(this.todo.id);
      this.store.dispatch(accion);
    });
  }

  editar() {
    this.editando = true;
    setTimeout(() => {
      this.txtInputFisico.nativeElement.select();
    }, 1);
  }

  terminarEdicion() {
    this.editando = false;
    if (this.txtInput.invalid || this.txtInput.value === this.todo.texto) {
      return;
    }
    const accion = new fromTodo.EditarTodoAction(this.todo.id, this.txtInput.value);
    this.store.dispatch(accion);
  }

  borrar() {
    const accion = new fromTodo.BorrarTodoAction(this.todo.id);
    this.store.dispatch(accion);
  }
}
