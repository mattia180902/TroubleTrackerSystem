import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TicketsComponent } from './features/tickets/tickets.component';
import { TicketDetailComponent } from './features/tickets/ticket-detail/ticket-detail.component';
import { TicketFormComponent } from './features/tickets/ticket-form/ticket-form.component';
import { UsersComponent } from './features/users/users.component';
import { UserFormComponent } from './features/users/user-form/user-form.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { CategoryFormComponent } from './features/categories/category-form/category-form.component';
import { ReportsComponent } from './features/reports/reports.component';
import { LoginComponent } from './features/auth/login/login.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'tickets', 
        children: [
          { path: '', component: TicketsComponent },
          { path: 'new', component: TicketFormComponent },
          { path: ':id', component: TicketDetailComponent },
          { path: ':id/edit', component: TicketFormComponent }
        ] 
      },
      { 
        path: 'users', 
        canActivate: [RoleGuard],
        data: { 
          roles: ['ADMIN'] 
        },
        children: [
          { path: '', component: UsersComponent },
          { path: 'new', component: UserFormComponent },
          { path: ':id/edit', component: UserFormComponent }
        ] 
      },
      { 
        path: 'categories', 
        canActivate: [RoleGuard],
        data: { 
          roles: ['ADMIN'] 
        },
        children: [
          { path: '', component: CategoriesComponent },
          { path: 'new', component: CategoryFormComponent },
          { path: ':id/edit', component: CategoryFormComponent }
        ] 
      },
      { 
        path: 'reports', 
        component: ReportsComponent,
        canActivate: [RoleGuard],
        data: { 
          roles: ['ADMIN', 'AGENT'] 
        } 
      }
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }