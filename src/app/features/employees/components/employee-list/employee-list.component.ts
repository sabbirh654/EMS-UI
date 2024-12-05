import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDetails } from '../../models/employee.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { AttendanceFormComponent } from '../../../attendances/components/attendance-form/attendance-form.component';
import { AttendanceListComponent } from '../../../attendances/components/attendance-list/attendance-list.component';
import { MatSelectModule } from '@angular/material/select';
import { AttendanceService } from '../../../attendances/services/attendance.service';
import { AttendanceDetailsComponent } from '../../../attendances/components/attendance-details/attendance-details.component';
import { AttendanceDetails } from '../../../attendances/models/attendance.model';
import { OperationLogService } from '../../../logs/services/operation-log.service';
import { LogFilter, OperationLog } from '../../../logs/models/log.model';
import { EntityName } from '../../../../shared/Enums/enums';
import { LogDetailsComponent } from '../../../logs/components/log-details/log-details.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSnackBarModule, EmployeeFormComponent, AttendanceFormComponent,
    MatSelectModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'birthDate', 'address', 'department', 'designation', 'actions'];
  employeeData: EmployeeDetails[] = [];
  isEmployeeFormVisible: boolean = false;
  isEditButtonClicked: boolean = false;
  isAttendanceFormVisible: boolean = false;
  selectedEmployeeData: EmployeeDetails | null = null;
  selectedEmployeeId: number | null = null;
  selectedEmployeeAttendance: AttendanceDetails[] | null = null;
  selectedEmployeeLogs: OperationLog[] | null = null;

  constructor(private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private logService: OperationLogService
  ) { }

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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.snackBar.open('Employee deleted successfully', 'Close', { duration: 2000 });
            this.loadEmployeeData();  // Refresh data after deletion
          },
          error: (err) => {
            console.error('Error deleting employee', err);
            this.snackBar.open('Failed to delete employee', 'Close', { duration: 2000 });
          }
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

          data: this.selectedEmployeeAttendance,
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
      entityName: "Employee"
    }
    this.logService.getLogs(filter).subscribe({
      next: (d) => {
        this.selectedEmployeeLogs = d.result || null;
        this.dialog.open(LogDetailsComponent, {
          width: '600px',
          data: this.selectedEmployeeLogs,
        });
      },
      error: (err) => {
        console.error('Error fetching employee log data', err);
        console.log(filter)
      },
    });
  }

  onDownloadAsCsv() {
    console.log(this.employeeData)
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'DOB', 'Department', 'Designation'];

    // Create the header row
    const headerRow = headers.join(',');
    const rows = this.employeeData.map(employee => `${employee.id},${employee.name},${employee.email},${employee.phoneNumber},${employee.address}, ${employee.birthDate}, ${employee.department},${employee.designation}`).join('\n');
    const csvContent = headers + '\n' + rows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'employees.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  onDownloadAsXls() {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'DOB', 'Department', 'Designation'];

    // Map the employee data into a 2D array
    const excelData = this.employeeData.map(employee => [
      employee.id,
      employee.name || '',  // Replace null/undefined with an empty string
      employee.email || '',
      employee.phoneNumber || '',
      employee.address || '',
      employee.birthDate || '',
      employee.department || '',
      employee.designation || ''
    ]);

    const sheetData = [headers, ...excelData];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const columnWidths = headers.map((header, columnIndex) => {
      const maxContentLength = Math.max(
        header.length,
        ...excelData.map(row => String(row[columnIndex]).length)
      );
      return { wch: maxContentLength + 2 }; // Add padding to the width
    });

    worksheet['!cols'] = columnWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    XLSX.writeFile(workbook, 'employees.xlsx');
  }
}
