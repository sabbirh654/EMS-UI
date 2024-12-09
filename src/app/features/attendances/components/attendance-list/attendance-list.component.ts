import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { ConfirmDeleteDialogComponent } from '../../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TimeAmPmPipe } from '../../../../shared/pipes/date.pipe';
import { EmployeeDetailsComponent } from '../../../employees/components/employee-details/employee-details.component';
import { EmployeeDetails } from '../../../employees/models/employee.model';
import { EmployeeService } from '../../../employees/services/employee.service';
import { Attendance, AttendanceFilter } from '../../models/attendance.model';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceFormComponent } from '../attendance-form/attendance-form.component';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    AttendanceFormComponent,
    TimeAmPmPipe,
  ],
  providers: [provideNativeDateAdapter(), DatePipe, TimeAmPmPipe],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.css',
})
export class AttendanceListComponent implements OnInit {
  attendances: Attendance[] = [];
  isAttendanceFormVisible: boolean = false;
  selectedAttendanceData: Attendance | null = null;
  selectedEmployeeData: EmployeeDetails | null = null;
  displayedColumns: string[] = [
    'id',
    'employee-id',
    'date',
    'check-in-time',
    'check-out-time',
    'actions',
  ];
  filterForm!: FormGroup;
  filterDate: string | null = null;
  employeeId: number | null = null;
  selectedEmployeeId: number | null = null;

  attendanceFilter: AttendanceFilter = {
    employeeId: this.employeeId,
    date: this.filterDate,
  };

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.attendanceService.getAttendance(this.attendanceFilter).subscribe({
      next: (d) => {
        this.attendances = d.result || [];
      },
      error: (err) => {
        console.error('Error fetching employee data', err);
      },
    });
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.attendanceService.deleteAttendance(id).subscribe({
          next: () => {
            this.snackBar.open('Attendance deleted successfully', 'Close', {
              duration: 2000,
            });
            this.loadData(); // Refresh data after deletion
          },
          error: (err) => {
            console.error('Error deleting attendance', err);
            this.snackBar.open('Failed to delete attendance', 'Close', {
              duration: 2000,
            });
          },
        });
      }
    });
  }

  onEdit(rowData: Attendance) {
    this.isAttendanceFormVisible = true;
    this.selectedAttendanceData = rowData;
    this.selectedEmployeeId = rowData.employeeId;
  }

  onSearch() {
    this.attendanceFilter = {
      employeeId: this.employeeId,
      date: this.filterDate,
    };

    this.loadData();
  }

  onDateChange($event: any) {
    this.filterDate = this.datePipe.transform($event.value, 'yyyy-MM-dd');
  }

  onDateInputChange($event: any) {
    this.filterDate = $event.value;
  }

  onEmployeeIdChange($event: any) {
    const inputElement = $event.target as HTMLInputElement;
    this.employeeId = +inputElement.value;
  }

  OnAttendanceAddUpdateOperationSuccess() {
    this.isAttendanceFormVisible = false;
    this.loadData();
  }
  OnAttendanceFormClosed() {
    this.isAttendanceFormVisible = false;
  }

  openEmployeeDetails(id: number) {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (d) => {
        this.selectedEmployeeData = d.result || null;
        this.dialog.open(EmployeeDetailsComponent, {
          width: '500px',
          // Adjust the width as needed
          data: this.selectedEmployeeData, // Pass the employee object to the dialog
        });
      },
      error: (err) => {
        console.error('Error fetching employee data', err);
      },
    });
  }
}
