import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {path:'matches',
   loadChildren: () => import('./pages/matches/matches.module').then((m) => m.MatchesModule),
  },
  {path:'teams',
    loadChildren: () => import('./pages/teams/teams.module').then((m) => m.TeamsModule),
  },
  {path:'players',
    loadChildren: () => import('./pages/players/players.module').then((m) => m.PlayersModule),

  },
  {path:'users',
    loadChildren: () => import('./pages/users/users.module').then((m) => m.UsersModule),

  },
  {path:'**',
    redirectTo:'matches'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
