import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { ConfirmDeleteDialogComponent } from '../../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { Designation } from '../../models/designation.model';
import { DesignationService } from '../../services/designation.service';
import { DesignationFormComponent } from '../designation-form/designation-form.component';

@Component({
  selector: 'app-designation-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    DesignationFormComponent,
    MatSnackBarModule,
  ],
  templateUrl: './designation-list.component.html',
  styleUrl: './designation-list.component.css',
})
export class DesignationListComponent {
  constructor(
    private designationService: DesignationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  designations: Designation[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];
  isDesignationFormVisible: boolean = false;
  isEditButtonClicked: boolean = false;
  selectedDesignationData: Designation | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  onAdd() {
    this.isDesignationFormVisible = true;
    this.isEditButtonClicked = false;
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.designationService.deleteDesignation(id).subscribe({
          next: () => {
            this.snackBar.open('Designation deleted successfully', 'Close', {
              duration: 2000,
            });
            this.loadData(); // Refresh data after deletion
          },
          error: (err) => {
            console.error('Error deleting designation', err);
            this.snackBar.open('Failed to delete designation', 'Close', {
              duration: 2000,
            });
          },
        });
      }
    });
  }

  onEdit(rowData: Designation) {
    this.isDesignationFormVisible = true;
    this.isEditButtonClicked = true;
    this.selectedDesignationData = rowData;
  }

  OnDepartmentFormClosed() {
    this.isDesignationFormVisible = false;
  }

  OnDesignationAddUpdateOperationSuccess() {
    this.isDesignationFormVisible = false;
    this.loadData();
  }

  loadData() {
    this.designationService.getDesignations().subscribe({
      next: (data) => {
        this.designations = data.result || [];
      },
      error: (err) => {
        console.error('Error fetching designation data', err);
      },
    });
  }
}
