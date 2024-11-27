import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogContent, MatDialogTitle],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.css'
})
export class ConfirmDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) { }

  onYesClick() {
    this.dialogRef.close(true);
  }
  onNoClick() {
    this.dialogRef.close(false);
  }

}
