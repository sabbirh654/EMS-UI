import { Routes } from '@angular/router';
import { EmployeeListComponent } from './features/employees/components/employee-list/employee-list.component';
import { DepartmentListComponent } from './features/departments/components/department-list/department-list.component';
import { DesignationListComponent } from './features/designations/components/designation-list/designation-list.component';
import { AttendanceListComponent } from './features/attendances/components/attendance-list/attendance-list.component';
import { LoginComponent } from './features/authentication/components/login/login.component';
import { AuthGuard } from './features/authentication/guards/auth.guard';
import { RegisterComponent } from './features/authentication/components/register/register.component';

export const routes: Routes = [
    {
        path: 'employees',
        component: EmployeeListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'departments',
        component: DepartmentListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'designations',
        component: DesignationListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'attendances',
        component: AttendanceListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];
