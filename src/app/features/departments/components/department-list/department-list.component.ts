import { Component, OnInit } from '@angular/core';
import { Department } from '../../models/department.model';
import { DepartmentService } from '../../services/department.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DepartmentFormComponent } from '../department-form/department-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, DepartmentFormComponent, MatSnackBarModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent implements OnInit {
  constructor(
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  departments: Department[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];
  isDepartmentFormVisible: boolean = false;
  isEditButtonClicked: boolean = false;
  selectedDepartmentData: Department | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  onAdd() {
    this.isDepartmentFormVisible = true;
    this.isEditButtonClicked = false;
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.departmentService.deleteDepartment(id).subscribe({
          next: () => {
            this.snackBar.open('Department deleted successfully', 'Close', { duration: 2000 });
            this.loadData();  // Refresh data after deletion
          },
          error: (err) => {
            console.error('Error deleting department', err);
            this.snackBar.open('Failed to delete department', 'Close', { duration: 2000 });
          }
        });
      }
    });
  }

  onEdit(rowData: Department) {
    this.isDepartmentFormVisible = true;
    this.isEditButtonClicked = true;
    this.selectedDepartmentData = rowData;
  }

  OnDepartmentFormClosed() {
    this.isDepartmentFormVisible = false;
  }

  OnDepartmentAddUpdateOperationSuccess() {
    this.isDepartmentFormVisible = false;
    this.loadData();
  }

  loadData() {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data.result || [];
      },
      error: (err) => {
        console.error('Error fetching departmens data', err);
      },
    });
  }
}
