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

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSnackBarModule, EmployeeFormComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'birthDate', 'address', 'department', 'designation', 'actions'];
  employeeData: EmployeeDetails[] = [];
  isEmployeeFormVisible: boolean = false;
  selectedEmployeeData: EmployeeDetails | null = null;

  constructor(private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
    this.selectedEmployeeData = rowData;
  }

  OnEmployeeFormClosed() {
    this.isEmployeeFormVisible = false;
  }

  OnEmployeeAddUpdateOperationSuccess() {
    this.isEmployeeFormVisible = false;
    this.loadEmployeeData();
  }
}
