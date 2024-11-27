import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EmployeeUpdateMapper } from '../../employee.mapper';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    NgIf,
    NgFor
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() employeeData: any = null;
  @Output() formCloseEvent = new EventEmitter<void>();
  @Output() successfulAddUpdateEmployeeEvent = new EventEmitter<void>();

  employeeForm!: FormGroup;

  departments = ['HR', 'IT', 'Finance'];
  roles = ['Manager', 'Developer', 'Analyst'];

  constructor(private employeeService: EmployeeService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.mode === 'edit' && this.employeeData) {
      this.populateForm();
    }
  }

  initializeForm(): void {
    this.employeeForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      department: new FormControl(''),
      role: new FormControl(''),
    });
  }

  populateForm(): void {
    this.employeeForm.patchValue({
      id: this.employeeData.id,
      name: this.employeeData.name,
      email: this.employeeData.email,
      phone: this.employeeData.phoneNumber,
      address: this.employeeData.address,
      date: this.employeeData.birthDate
    });

    var x = this.employeeForm.get('id')?.value;
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      if (this.mode === 'edit') {
        var x = this.employeeForm.value.id;
        let employeeUpdateDto = EmployeeUpdateMapper(this.employeeForm.value);
        this.employeeService.updateEmployee(this.employeeForm.get('id')?.value, employeeUpdateDto).subscribe({
          next: () => {
            this.snackBar.open('Employee updated successfully', 'Close', { duration: 2000 });
            this.successfulAddUpdateEmployeeEvent.emit();
          },
          error: (err) => {
            console.error('Error updating employee', err);
            this.snackBar.open('Failed to update employee', 'Close', { duration: 2000 });
          }
        });
      }
      console.log('Form submitted:', this.employeeForm.value);
    }
  }

  onClose() {
    this.employeeForm.reset();
    this.formCloseEvent.emit();
  }
}
