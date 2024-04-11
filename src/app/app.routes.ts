import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { AuthGuard } from './services/authendicate';
import { MemberDashboardComponent } from './pages/member-dashboard/member-dashboard.component';
import { MemberDashboardCreateComponent } from './pages/member-dashboard-create/member-dashboard-create.component';
import { MemberDashboardEditComponent } from './pages/member-dashboard-edit/member-dashboard-edit.component';
import { ManageNominationComponent } from './pages/manage-nomination/manage-nomination.component';
import { ManageNominationCreateComponent } from './pages/manage-nomination/manage-nomination-create/manage-nomination-create.component';
import { ManageElectionComponent } from './pages/manage-election/manage-election.component';
import { ManageElectionCreateComponent } from './pages/manage-election/manage-election-create/manage-election-create.component';
import { ManageNominationPositionComponent } from './pages/manage-nomination/manage-nomination-position/manage-nomination-position.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'member-dashboard',
        component: MemberDashboardComponent
      },
      {
        path: 'member-create',
        component: MemberDashboardCreateComponent
      },
      {
        path: 'member-edit/:id',
        component: MemberDashboardEditComponent
      },
      {
        path: 'nomination',
        component: ManageNominationComponent
      },
      {
        path: 'nomination-create',
        component: ManageNominationCreateComponent
      },
      {
        path: 'nomination-position/:uuid',
        component: ManageNominationPositionComponent
      },
      {
        path: 'election',
        component: ManageElectionComponent
      },
      {
        path: 'election-create',
        component: ManageElectionCreateComponent
      },
    ]
  },
  {
    path: '**',
    component: LoginComponent
  }
];

function isAuthenticated() {
  return Boolean(localStorage.getItem('loginTOken'))
}

export default routes;

