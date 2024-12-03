import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OperationLog } from '../../models/log.model';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-log-details',
  imports: [MatTableModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './log-details.component.html',
  styleUrl: './log-details.component.css'
})
export class LogDetailsComponent {
  displayedColumns: string[] = ['operationType', 'date', 'time'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: OperationLog[]) {
    var x = data;
  }
}
