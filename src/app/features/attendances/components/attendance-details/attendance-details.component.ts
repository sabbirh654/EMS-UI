import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { TimeAmPmPipe } from '../../../../shared/pipes/date.pipe';
import { Attendance, AttendanceFilter } from '../../models/attendance.model';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TimeAmPmPipe],
  providers: [DatePipe, TimeAmPmPipe, MatCardModule],
  templateUrl: './attendance-details.component.html',
  styleUrl: './attendance-details.component.css',
})
export class AttendanceDetailsComponent {
  isAttendanceViewVisible: boolean = false;
  attendanceFilter: AttendanceFilter | null = null;
  selectedEmployeeCheckInOutList: Attendance[] | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { attendance: any; employeeId: number },
    private attendanceService: AttendanceService,
    private datePipe: DatePipe
  ) {}

  attendanceViewState: { [key: string]: boolean } = {};

  onViewAttendanceDetails(employeeId: number, date: any) {
    const filterDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    const key = `${employeeId}-${filterDate}`;

    this.attendanceViewState[key] = !this.attendanceViewState[key];

    if (this.attendanceViewState[key]) {
      this.attendanceFilter = {
        employeeId: employeeId,
        date: filterDate,
      };

      this.attendanceService.getAttendance(this.attendanceFilter).subscribe({
        next: (d) => {
          this.selectedEmployeeCheckInOutList = d.result || [];
        },
        error: (err) => {
          console.error('Error fetching employee data', err);
        },
      });
    }
  }
}
