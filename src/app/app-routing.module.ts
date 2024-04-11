import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/matches/matches.module').then((m) => m.MatchesModule),
    data: { showNav: true, showUserContent: true },
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((l) => l.LoginModule),
    data: { showNav: true, showUserContent: true },
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./pages/signup/signup.module').then((s) => s.SignupModule),
    data: { showNav: true, showUserContent: true },
  },
  {
    path: 'email/confirmation',
    loadChildren: () =>
      import('./pages/email-confirmation/email-confirmation.module').then(
        (e) => e.EmailConfirmationModule,
      ),
    data: { showNav: false, showUserContent: false },
  },
  {
    path: 'password/forgot',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (f) => f.ForgotPasswordModule,
      ),
    data: { showNav: true, showUserContent: true },
  },
  {
    path: 'password/reset',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (r) => r.ResetPasswordModule,
      ),
    data: { showNav: false, showUserContent: false },
  },
  {
    path: 'matches',
    loadChildren: () =>
      import('./pages/matches/matches.module').then((m) => m.MatchesModule),
    data: { showNav: true, showUserContent: true },
  },
  {
    path: 'teams',
    loadChildren: () =>
      import('./pages/teams/teams.module').then((t) => t.TeamsModule),
    data: { showNav: true, showUserContent: true },
  },
  {
    path: 'teams/:id',
    loadChildren: () =>
      import('./pages/team/team.module').then((t) => t.TeamModule),
    data: { showNav: true, showUserContent: true },
  },
  {
    path: 'players',
    loadChildren: () =>
      import('./pages/players/players.module').then((p) => p.PlayersModule),
    data: { showNav: true, showUserContent: true },
  },
  {
    path: 'users',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./pages/users/users.module').then((u) => u.UsersModule),
    data: { showNav: true, showUserContent: true },
  },
  {
    path: 'access-forbidden',
    loadChildren: () =>
      import('./pages/access-forbidden/access-forbidden.module').then(
        (a) => a.AccessForbiddenModule,
      ),
    data: { showNav: false, showUserContent: false },
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./pages/not-found/not-found.module').then(
        (n) => n.NotFoundModule,
      ),
    data: { showNav: false, showUserContent: false },
  },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
