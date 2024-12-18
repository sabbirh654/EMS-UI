import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AttendanceDetailsComponent } from '@attendances/components/attendance-details/attendance-details.component';
import { AttendanceFormComponent } from '@attendances/components/attendance-form/attendance-form.component';
import { AttendanceDetails } from '@attendances/models/attendance.model';
import { AttendanceService } from '@attendances/services/attendance.service';
import { EmployeeFormComponent } from '@employees/components/employee-form/employee-form.component';
import { EmployeeDetails } from '@employees/models/employee.model';
import { EmployeeService } from '@employees/services/employee.service';
import { LogDetailsComponent } from '@logs/components/log-details/log-details.component';
import { LogFilter, OperationLog } from '@logs/models/log.model';
import { OperationLogService } from '@logs/services/operation-log.service';
import { ConfirmDeleteDialogComponent } from '@shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    EmployeeFormComponent,
    AttendanceFormComponent,
    MatSelectModule,
  ],
  providers: [DatePipe],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'phone',
    'birthDate',
    'address',
    'department',
    'designation',
    'actions',
  ];

  employeeData: EmployeeDetails[] = [];
  isEmployeeFormVisible: boolean = false;
  isEditButtonClicked: boolean = false;
  isAttendanceFormVisible: boolean = false;
  selectedEmployeeData: EmployeeDetails | null = null;
  selectedEmployeeId: number | null = null;
  selectedEmployeeAttendance: AttendanceDetails[] | null = null;
  selectedEmployeeLogs: OperationLog[] | null = null;
  headers: string[] = [];

  constructor(
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private logService: OperationLogService,
    private datePipe: DatePipe
  ) {
    this.headers = [
      'id',
      'name',
      'email',
      'phoneNumber',
      'address',
      'birthDate',
      'department',
      'designation',
    ];
  }

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employeeData = data.result || [];
      },
      error: (err) => {
        console.error('Error fetching employee data', err);
      },
    });
  }

  onDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.snackBar.open('Employee deleted successfully', 'Close', {
              duration: 2000,
            });
            this.loadEmployeeData(); // Refresh data after deletion
          },
          error: (err) => {
            console.error('Error deleting employee', err);
            this.snackBar.open('Failed to delete employee', 'Close', {
              duration: 2000,
            });
          },
        });
      }
    });
  }

  onEdit(rowData: EmployeeDetails) {
    this.isEmployeeFormVisible = true;
    this.isEditButtonClicked = true;
    this.selectedEmployeeData = rowData;
  }

  onAdd() {
    this.isEmployeeFormVisible = true;
    this.isEditButtonClicked = false;
  }

  OnEmployeeFormClosed() {
    this.isEmployeeFormVisible = false;
  }

  OnEmployeeAddUpdateOperationSuccess() {
    this.isEmployeeFormVisible = false;
    this.loadEmployeeData();
  }

  onAddAttendance(id: number) {
    this.isAttendanceFormVisible = true;
    this.selectedEmployeeId = id;
  }

  OnAttendanceAddUpdateOperationSuccess() {
    this.isAttendanceFormVisible = false;
  }
  OnAttendanceFormClosed() {
    this.isAttendanceFormVisible = false;
  }

  onViewAttendance(id: number) {
    this.attendanceService.getEmployeeAttendance(id).subscribe({
      next: (d) => {
        this.selectedEmployeeAttendance = d.result || null;
        this.dialog.open(AttendanceDetailsComponent, {
          width: '600px',

          data: {
            attendance: this.selectedEmployeeAttendance,
            employeeId: id,
          },
        });
      },
      error: (err) => {
        console.error('Error fetching employee data', err);
      },
    });
  }

  onViewLogs(id: number) {
    var filter: LogFilter = {
      id: id,
      entityName: 'Employee',
    };
    this.logService.getLogs(filter).subscribe({
      next: (d) => {
        this.selectedEmployeeLogs = d.result || null;
        this.dialog.open(LogDetailsComponent, {
          width: '800px',
          maxWidth: 'none',
          data: this.selectedEmployeeLogs,
        });
      },
      error: (err) => {
        console.error('Error fetching employee log data', err);
        console.log(filter);
      },
    });
  }

  onDownloadAsCsv() {
    this.employeeService.downloadEmployeeListCsv().subscribe({
      next: (data) => {
        const url = window.URL.createObjectURL(data);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'EmployeeList.csv';
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error fetching employee log data', err);
      },
    });
  }

  onDownloadAsXls() {
    this.employeeService.downloadEmployeeListXlsx().subscribe({
      next: (data) => {
        const url = window.URL.createObjectURL(data);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'EmployeeList.xlsx';
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error fetching employee log data', err);
      },
    });
  }
}
