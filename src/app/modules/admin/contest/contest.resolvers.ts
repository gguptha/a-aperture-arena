import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ContestService } from './contest.service';

export const contestDataResolver = () =>
{
    const contestService = inject(ContestService);

    return forkJoin([
        contestService.getContests()
    ]);
};
