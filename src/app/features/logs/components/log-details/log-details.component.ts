import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

import { OperationLog } from '../../models/log.model';

@Component({
  selector: 'app-log-details',
  imports: [MatTableModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './log-details.component.html',
  styleUrl: './log-details.component.css',
})
export class LogDetailsComponent {
  displayedColumns: string[] = ['operationType', 'date', 'time', 'details'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: OperationLog[]) {}
}
