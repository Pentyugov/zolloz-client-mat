import { Routes } from '@angular/router';
import {ProfileComponent} from "./profile/profile.component";

export const ProfileRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'my',
        pathMatch: 'full'
      },
      {
        path: 'my',
        component: ProfileComponent,
        data: {
          title: 'My profile',
          urls: [{ title: 'Profile', url: '/profile' }, { title: 'My' }],
        }
      }
    ]
  }
]

