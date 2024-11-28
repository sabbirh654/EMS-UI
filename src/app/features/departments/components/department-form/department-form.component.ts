import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DepartmentAddUpdateMapper } from '../../department.mapper';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    NgIf
  ],
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.css'
})
export class DepartmentFormComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() departmentData: any = null;
  @Output() formCloseEvent = new EventEmitter<void>();
  @Output() successfulAddDepartmentEvent = new EventEmitter<void>();

  departmentForm!: FormGroup;

  constructor(private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.mode === 'edit' && this.departmentData) {
      this.populateForm();
    }
  }

  onClose() {
    this.departmentForm.reset();
    this.formCloseEvent.emit();
  }

  initializeForm(): void {
    this.departmentForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required])
    });
  }

  populateForm(): void {
    this.departmentForm.patchValue({
      id: this.departmentData.id,
      name: this.departmentData.name
    });

    this.departmentForm.get('id')?.disable();
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      if (this.mode === 'edit') {
        let departmentUpdateDto = DepartmentAddUpdateMapper(this.departmentForm.value);
        this.departmentService.updateDepartment(this.departmentForm.get('id')?.value, departmentUpdateDto).subscribe({
          next: () => {
            this.snackBar.open('Department updated successfully', 'Close', { duration: 2000 });
            this.successfulAddDepartmentEvent.emit();
          },
          error: (err) => {
            console.error('Error updating department', err);
            this.snackBar.open('Failed to update department', 'Close', { duration: 2000 });
          }
        });
      }
      else {
        let departmentAddDto = DepartmentAddUpdateMapper(this.departmentForm.value);
        this.departmentService.addDepartment(departmentAddDto).subscribe({
          next: () => {
            this.snackBar.open('Department added successfully', 'Close', { duration: 2000 });
            this.successfulAddDepartmentEvent.emit();
          },
          error: (err) => {
            console.error('Error adding department', err);
            this.snackBar.open('Failed to add department', 'Close', { duration: 2000 });
          }
        });
      }
      console.log('Form submitted:', this.departmentForm.value);
    }
  }
}
