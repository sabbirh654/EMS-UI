import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { Attendance, AttendanceFilter } from '../../models/attendance.model';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeDetailsComponent } from '../../../employees/components/employee-details/employee-details.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../../employees/services/employee.service';
import { EmployeeDetails } from '../../../employees/models/employee.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDeleteDialogComponent } from '../../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceFormComponent } from '../attendance-form/attendance-form.component';
import { TimeAmPmPipe } from '../../../../shared/pipes/date.pipe';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, AttendanceFormComponent, TimeAmPmPipe],
  providers: [provideNativeDateAdapter(), DatePipe, TimeAmPmPipe],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.css'
})
export class AttendanceListComponent implements OnInit {
  attendances: Attendance[] = [];
  isAttendanceFormVisible: boolean = false;
  selectedAttendanceData: Attendance | null = null;
  selectedEmployeeData: EmployeeDetails | null = null;
  displayedColumns: string[] = ['id', 'employee-id', 'date', 'check-in-time', 'check-out-time', 'actions'];
  filterForm!: FormGroup;
  filterDate: string | null = null;
  employeeId: number | null = null;
  selectedEmployeeId: number | null = null;

  attendanceFilter: AttendanceFilter = {
    employeeId: this.employeeId,
    date: this.filterDate
  }

  constructor(private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) { }

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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attendanceService.deleteAttendance(id).subscribe({
          next: () => {
            this.snackBar.open('Attendance deleted successfully', 'Close', { duration: 2000 });
            this.loadData();  // Refresh data after deletion
          },
          error: (err) => {
            console.error('Error deleting attendance', err);
            this.snackBar.open('Failed to delete attendance', 'Close', { duration: 2000 });
          }
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
      date: this.filterDate
    }

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
