import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTimepickerModule } from '@angular/material/timepicker';

import {
  AttendanceAddMapper,
  AttendanceUpdateMapper,
} from '../../attendance.mapper';
import { Attendance } from '../../models/attendance.model';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCardModule,
    MatButtonModule,
    MatTimepickerModule,
  ],
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './attendance-form.component.html',
  styleUrl: './attendance-form.component.css',
})
export class AttendanceFormComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() selectedEmployeeId: number | null = null;
  @Input() selectedAttendanceData: Attendance | null = null;
  @Output() formCloseEvent = new EventEmitter<void>();
  @Output() successfulAddUpdateAttendanceEvent = new EventEmitter<void>();

  attendanceForm!: FormGroup;

  constructor(
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    if (this.mode == 'edit' && this.selectedAttendanceData) {
      this.populateForm();
    }
  }

  initializeForm(): void {
    this.attendanceForm = new FormGroup({
      employeeId: new FormControl(this.selectedEmployeeId),
      date: new FormControl(new Date(), [Validators.required]),
      checkIn: new FormControl('', [Validators.required]),
      checkOut: new FormControl('', [
        Validators.required,
        this.checkOutAfterCheckInValidator,
      ]),
    });
  }

  populateForm(): void {
    this.attendanceForm.patchValue({
      employeeId: this.selectedAttendanceData?.employeeId,
      date: this.selectedAttendanceData?.date,
      checkIn: this.selectedAttendanceData?.checkInTime,
      checkOut: this.selectedAttendanceData?.checkOutTime,
    });
    console.log(this.selectedAttendanceData);
    this.attendanceForm.get('date')?.disable();
  }

  onSubmit() {
    if (this.attendanceForm.valid) {
      if (this.mode === 'edit') {
        let dto = AttendanceUpdateMapper(this.attendanceForm.value);
        this.attendanceService
          .updateAttendance(this.selectedAttendanceData?.id!, dto)
          .subscribe({
            next: (data) => {
              if (data.isSuccess == true) {
                this.snackBar.open('Attendance updated successfully', 'Close', {
                  duration: 2000,
                });
                this.successfulAddUpdateAttendanceEvent.emit();
              } else {
                this.snackBar.open(data.errorMessage ?? '', 'Close', {
                  duration: 4000,
                });
              }
            },
            error: (err) => {
              console.error('Error updating attendance', err);
              this.snackBar.open('Failed to update attendance', 'Close', {
                duration: 2000,
              });
            },
          });
      } else {
        let dto = AttendanceAddMapper(this.attendanceForm.value);
        this.attendanceService.addAttendance(dto).subscribe({
          next: (data) => {
            if (data.isSuccess == true) {
              this.snackBar.open('Attendance added successfully', 'Close', {
                duration: 2000,
              });
              this.successfulAddUpdateAttendanceEvent.emit();
            } else {
              this.snackBar.open(data.errorMessage ?? '', 'Close', {
                duration: 4000,
              });
            }
          },
          error: (err) => {
            console.error('Error adding adding', err);
            this.snackBar.open(err.error.errorMessage, 'Close', {
              duration: 2000,
            });
          },
        });
      }
      console.log('Form submitted:', this.attendanceForm.value);
    }
  }

  onClose() {
    this.attendanceForm.reset();
    this.formCloseEvent.emit();
  }

  checkOutAfterCheckInValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const checkInTime = control.root.get('checkIn')?.value;
    const checkOutTime = control.root.get('checkOut')?.value;

    if (checkInTime && checkOutTime) {
      if (checkOutTime < checkInTime) {
        return { checkOutBeforeCheckIn: true };
      }
    }
    return null;
  }
}
