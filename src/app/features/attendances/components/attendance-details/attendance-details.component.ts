import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AttendanceDetails } from '../../models/attendance.model';
import { TimeAmPmPipe } from "../../../../shared/pipes/date.pipe";

@Component({
  selector: 'app-attendance-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TimeAmPmPipe],
  providers: [TimeAmPmPipe],
  templateUrl: './attendance-details.component.html',
  styleUrl: './attendance-details.component.css'
})
export class AttendanceDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: AttendanceDetails[]) { }
}
