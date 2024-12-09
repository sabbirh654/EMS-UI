import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Department } from '../../../departments/models/department.model';
import { DepartmentService } from '../../../departments/services/department.service';
import { Designation } from '../../../designations/models/designation.model';
import { DesignationService } from '../../../designations/services/designation.service';
import { EmployeeAddMapper, EmployeeUpdateMapper } from '../../employee.mapper';
import { EmployeeService } from '../../services/employee.service';

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
    NgFor,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() employeeData: any = null;
  @Output() formCloseEvent = new EventEmitter<void>();
  @Output() successfulAddUpdateEmployeeEvent = new EventEmitter<void>();

  employeeForm!: FormGroup;

  departments: Department[] | null = null;
  designations: Designation[] | null = null;

  constructor(
    private employeeService: EmployeeService,
    private designationService: DesignationService,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //Get designations from db
    this.GetDesignations();
    this.GetDepartments();
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
      designation: new FormControl(''),
    });
  }

  populateForm(): void {
    this.employeeForm.patchValue({
      id: this.employeeData.id,
      name: this.employeeData.name,
      email: this.employeeData.email,
      phone: this.employeeData.phoneNumber,
      address: this.employeeData.address,
      date: this.employeeData.birthDate,
    });

    this.employeeForm.get('id')?.disable();
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      if (this.mode === 'edit') {
        let employeeUpdateDto = EmployeeUpdateMapper(this.employeeForm.value);
        this.employeeService
          .updateEmployee(this.employeeForm.get('id')?.value, employeeUpdateDto)
          .subscribe({
            next: () => {
              this.snackBar.open('Employee updated successfully', 'Close', {
                duration: 2000,
              });
              this.successfulAddUpdateEmployeeEvent.emit();
            },
            error: (err) => {
              console.error('Error updating employee', err);
              this.snackBar.open('Failed to update employee', 'Close', {
                duration: 2000,
              });
            },
          });
      } else {
        let employeeAddDto = EmployeeAddMapper(this.employeeForm.value);
        this.employeeService.addEmployee(employeeAddDto).subscribe({
          next: () => {
            this.snackBar.open('Employee added successfully', 'Close', {
              duration: 2000,
            });
            this.successfulAddUpdateEmployeeEvent.emit();
          },
          error: (err) => {
            console.error('Error adding employee', err);
            this.snackBar.open('Failed to add employee', 'Close', {
              duration: 2000,
            });
          },
        });
      }
      console.log('Form submitted:', this.employeeForm.value);
    }
  }

  onClose() {
    this.employeeForm.reset();
    this.formCloseEvent.emit();
  }

  private GetDesignations() {
    this.designationService.getDesignations().subscribe({
      next: (data) => {
        this.designations = data.result || [];
      },
      error: (err) => {
        console.error('Error fetching designation data', err);
      },
    });
  }

  private GetDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data.result || [];
      },
      error: (err) => {
        console.error('Error fetching department data', err);
      },
    });
  }
}
