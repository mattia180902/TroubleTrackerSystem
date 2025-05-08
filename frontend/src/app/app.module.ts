import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { initializeKeycloak } from './core/auth/keycloak-init.factory';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { AppRoutingModule } from './app-routing.module';

// Layout Components
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { HeaderComponent } from './layouts/header/header.component';

// Features
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TicketsComponent } from './features/tickets/tickets.component';
import { TicketDetailComponent } from './features/tickets/ticket-detail/ticket-detail.component';
import { TicketFormComponent } from './features/tickets/ticket-form/ticket-form.component';
import { UsersComponent } from './features/users/users.component';
import { UserFormComponent } from './features/users/user-form/user-form.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { CategoryFormComponent } from './features/categories/category-form/category-form.component';
import { ReportsComponent } from './features/reports/reports.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LoginComponent } from './features/auth/login/login.component';

// Shared Components
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from './shared/components/notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    SidenavComponent,
    HeaderComponent,
    DashboardComponent,
    TicketsComponent,
    TicketDetailComponent,
    TicketFormComponent,
    UsersComponent,
    UserFormComponent,
    CategoriesComponent,
    CategoryFormComponent,
    ReportsComponent,
    NotFoundComponent,
    LoginComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    AuthGuard,
    RoleGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }