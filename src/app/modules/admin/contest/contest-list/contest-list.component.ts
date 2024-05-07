import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { ContestResource } from '../contest.resource';
import { ContestService } from '../contest.service';
import { DatePipe } from '@angular/common';

@Component({
    selector     : 'contest-list',
    standalone   : true,
    templateUrl  : './contest-list.component.html',
    styles         : [
        `
            fuse-card {
                margin: 12px !important;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    imports      : [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, FuseCardComponent, DatePipe]
})
export class ContestListCompoment
{
    _contests: ContestResource[];

    /**
     * constructor()
     */
    constructor(private _activatedRoute: ActivatedRoute, public _router: Router, private _contestService: ContestService) 
    {
        this._activatedRoute.data.subscribe(data => {
            this._contests = data.initialData[0].resources;
        });
    }

    /**
     * updateContest()
     */
    updateContest(contestResource: ContestResource): void
    {
        this._contestService._selectedContest.next(contestResource);
        this._router.navigate(['contest-update']);
    }

    /**
     * listSections()
     */
    listSections(contestResource: ContestResource): void
    {
        this._contestService._selectedContest.next(contestResource);
        this._router.navigate(['section-list']);
    }

    /**
     * createContest()
     */
    createContest(): void
    {
        this._contestService._selectedContest.next(null);
        this._router.navigate(['contest-create'])
    }

    /**
     * getStatusDescription()
     */
    getStatusDescription(status: string): string {
        if (status === 'ReviewInProgress')
            return 'Review In Progress';
        else    
            return status;
    }
}
