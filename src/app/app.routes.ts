import { Routes } from '@angular/router';
import { EmployeeListComponent } from './features/employees/components/employee-list/employee-list.component';
import { DepartmentListComponent } from './features/departments/components/department-list/department-list.component';
import { DesignationListComponent } from './features/designations/components/designation-list/designation-list.component';
import { AttendanceListComponent } from './features/attendances/components/attendance-list/attendance-list.component';

export const routes: Routes = [
    {
        path: 'employees',
        component: EmployeeListComponent
    },
    {
        path: 'departments',
        component: DepartmentListComponent
    },
    {
        path: 'designations',
        component: DesignationListComponent
    },
    {
        path: 'attendances',
        component: AttendanceListComponent
    },
    {
        path: '',
        redirectTo: '/employees',
        pathMatch: 'full'
    }
];
