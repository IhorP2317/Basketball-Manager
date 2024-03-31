import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((l) => l.LoginModule),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./pages/signup/signup.module').then((s) => s.SignupModule),
  },
  {
    path: 'matches',
    loadChildren: () =>
      import('./pages/matches/matches.module').then((m) => m.MatchesModule),
  },
  {
    path: 'teams',
    loadChildren: () =>
      import('./pages/teams/teams.module').then((t) => t.TeamsModule),
  },
  {
    path: 'players',
    loadChildren: () =>
      import('./pages/players/players.module').then((p) => p.PlayersModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./pages/users/users.module').then((u) => u.UsersModule),
  },
  { path: '**', redirectTo: 'matches' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
