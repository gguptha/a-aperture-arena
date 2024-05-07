import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { DatePipe } from '@angular/common';
import { SectionResource } from '../section.resource';
import { Subscription } from 'rxjs';
import { ContestResource } from '../contest.resource';
import { ContestService } from '../contest.service';
import { MatDialog } from '@angular/material/dialog';
import { SectionUpdateComponent } from '../section-update/section-update.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SectionService } from '../section.service';
import { ResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector     : 'section-list',
    standalone   : true,
    templateUrl  : './section-list.component.html',
    imports      : [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, FuseCardComponent, DatePipe, MatTableModule]
})
export class SectionListCompoment implements OnDestroy
{

    _dataSource: MatTableDataSource<SectionResource>;
    _displayedColumns = ['name', 'sectionType', 'submissionLastDate', 'orderForDisplay', 'maximumUploads', 'actions'];

    _selectedContest: ContestResource;
    _selectedSection: SectionResource;
    _subscription: Subscription;

    /**
     * constructor()
     */
    constructor(public _router: Router, 
                private _contestService: ContestService, 
                private _dialogRef: MatDialog, 
                private _fuseConfirmationService: FuseConfirmationService, 
                private _sectionService: SectionService, 
                private _matSnackBar: MatSnackBar) 
    {
        this._subscription = _contestService._selectedContest.subscribe(data => 
        {
            if (data != null)
            {
                this._selectedContest = data;
                data.getRelatedCollection<ResourceCollection<SectionResource>>('sections').subscribe(response => {
                    this._dataSource = new MatTableDataSource(response.resources);
                });
            }
        });
    }

    /**
     * ngOnDestroy()
     */
    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    /**
     * backToContests()
     */
    backToContests(): void
    {
        this._router.navigate(['contest-list']);
    }

    /**
     * addSection()
     */
    addSection(): void 
    {
        let data = {
            'selectedContest': this._selectedContest
        };
        const dialog = this._dialogRef.open(SectionUpdateComponent, {
            'data': data
        });
    }

    /**
     * deleteSection()
     */
    deleteSection(row: SectionResource): void
    {
        // Open the confirmation and save the reference
        const dialogRef = this._fuseConfirmationService.open({'title': 'Delete Section?', 
                'message': 'Are you sure you want to delete the selected section?'});            
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed')
            {
                this._selectedContest.deleteRelation('sections', row).subscribe(() => {
                    this._sectionService.deleteResource(row).subscribe(() => {
                        let contestResource = this._contestService._selectedContest.value;
                        let array = contestResource.getSelfLinkHref().split('/');
                        this._contestService.getResource(array[array.length - 1]).subscribe(contest => {
                            this._contestService._selectedContest.next(contest);
                            this._matSnackBar.open('Section updated successfully.', 'OK', { duration: 7000 });
                        });
                    });
                });
            }
        });
    }

    /**
     * updateSection()
     */
    updateSection(row: SectionResource): void
    {
        let data = {
            'selectedContest': this._selectedContest,
            'selectedSection': row
        };
        const dialog = this._dialogRef.open(SectionUpdateComponent, {
            'data': data
        });
    }

    /**
     * selectSection()
     */
    selectSection(row: SectionResource): void
    {
        this._selectedSection = row;
    }
}
