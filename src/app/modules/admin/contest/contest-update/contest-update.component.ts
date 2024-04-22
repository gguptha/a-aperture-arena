import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { ContestResource } from '../contest.resource';
import { ContestService } from '../contest.service';
import { Subscription } from 'rxjs';

@Component({
    selector     : 'contest-update',
    standalone   : true,
    templateUrl  : './contest-update.component.html',
    encapsulation: ViewEncapsulation.None,
    imports      : [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, FuseCardComponent, MatStepperModule, ReactiveFormsModule, 
            MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatDatepickerModule]
})
export class ContestUpdateCompoment implements OnInit, OnDestroy
{
    _contestFormGroup: FormGroup;
    _judgingFormGroup: FormGroup;

    _selectedContest: ContestResource = null;

    _subscription: Subscription;

    _title: string;

    /**
     * Constructor
     */
    constructor(private _router: Router, private _formBuilder: FormBuilder, private _contestService: ContestService, 
        private _matSnackBar: MatSnackBar) 
    {
        this._subscription = _contestService._selectedContest.subscribe(data => {
            if (data != null)
                this._selectedContest = data;
        });

        _router.url === '/contest-update'? this._title = 'Update': this._title='Create';
    }

    /**
     * ngOnInit()
     */
    ngOnInit(): void 
    {
        this._contestFormGroup = this._formBuilder.group({
            name: [this._selectedContest?.name || '', Validators.required],
            internationalContest: [this._selectedContest?.internationalContest ||false],
            pastAcceptedImagesAllowed: [this._selectedContest?.pastAcceptedImagesAllowed || false],
            status: [this._selectedContest?.status || 'Open'],
            maxImageWidthAccepted: [this._selectedContest?.maxImageWidthAccepted],
            maxImageHeightAccepted: [this._selectedContest?.maxImageHeightAccepted],
            maxFileSize: [this._selectedContest?.maxFileSize],
            registrationStartDate: [this._selectedContest?.registrationStartDate],
            registrationEndDate: [this._selectedContest?.registrationEndDate]
        });

        this._judgingFormGroup = this._formBuilder.group({
            judgingStartDate: [this._selectedContest?.judging.judgingStartDate ],
            judgingEndDate: [this._selectedContest?.judging.judgingEndDate],
            resultsDate: [this._selectedContest?.judging.resultsDate]
        });
    }

    /**
     * ngOnDestroy()
     */
    ngOnDestroy(): void 
    {
        this._subscription.unsubscribe();
    }

    /**
     * submit()
     */
    submit(stepper: MatStepper): void 
    {
        if (this._contestFormGroup.valid && this._judgingFormGroup.valid)
        {
            var contestFormValue = this._contestFormGroup.value;
            var judgingFormValue = this._judgingFormGroup.value;

            if (contestFormValue.registrationStartDate)
                contestFormValue.registrationStartDate = fixDate(contestFormValue.registrationStartDate);
            if (contestFormValue.registrationEndDate)
                contestFormValue.registrationEndDate = fixDate(contestFormValue.registrationEndDate);

            if (judgingFormValue.judgingStartDate)
                judgingFormValue.judgingStartDate = fixDate(judgingFormValue.judgingStartDate);
            if (judgingFormValue.judgingStartDate)
                judgingFormValue.judgingStartDate = fixDate(judgingFormValue.judgingStartDate);
            if (judgingFormValue.judgingEndDate)
                judgingFormValue.judgingEndDate = fixDate(judgingFormValue.judgingEndDate);
            if (judgingFormValue.resultsDate)
                judgingFormValue.resultsDate = fixDate(judgingFormValue.resultsDate);
    
            if (this._router.url === '/contest-create')
            {
                var contestResource = new ContestResource();
                contestResource.name = contestFormValue.name;
                contestResource.internationalContest = contestFormValue.internationalContest;
                contestResource.pastAcceptedImagesAllowed = contestFormValue.pastAcceptedImagesAllowed;
                contestResource.status = contestFormValue.status;
                contestResource.maxImageWidthAccepted = contestFormValue.maxImageWidthAccepted;
                contestResource.maxImageHeightAccepted = contestFormValue.maxImageHeightAccepted;
                contestResource.maxFileSize = contestFormValue.maxFileSize;
                contestResource.registrationStartDate = contestFormValue.registrationStartDate;
                contestResource.registrationEndDate = contestFormValue.registrationEndDate;
                contestResource.judging.judgingStartDate = judgingFormValue.judgingStartDate;
                contestResource.judging.judgingEndDate = judgingFormValue.judgingEndDate;
                contestResource.judging.resultsDate = judgingFormValue.resultsDate;

                this._contestService.createContest(contestResource).subscribe(response => {
                    this._matSnackBar.open('Contest created successfully.', 'OK', { duration: 7000 });
                    stepper.reset();
                });
            }
            else if (this._router.url === '/contest-update')
            {
                this._selectedContest.name = contestFormValue.name;
                this._selectedContest.internationalContest = contestFormValue.internationalContest;
                this._selectedContest.pastAcceptedImagesAllowed = contestFormValue.pastAcceptedImagesAllowed;
                this._selectedContest.status = contestFormValue.status;
                this._selectedContest.maxImageWidthAccepted = contestFormValue.maxImageWidthAccepted;
                this._selectedContest.maxImageHeightAccepted = contestFormValue.maxImageHeightAccepted;
                this._selectedContest.maxFileSize = contestFormValue.maxFileSize;
                this._selectedContest.registrationStartDate = contestFormValue.registrationStartDate;
                this._selectedContest.registrationEndDate = contestFormValue.registrationEndDate;
                this._selectedContest.judging.judgingStartDate = judgingFormValue.judgingStartDate;
                this._selectedContest.judging.judgingEndDate = judgingFormValue.judgingEndDate;
                this._selectedContest.judging.resultsDate = judgingFormValue.resultsDate;

                this._contestService.updateContest(this._selectedContest).subscribe(response => {
                    this._matSnackBar.open('Contest updated successfully.', 'OK', { duration: 7000 });
                    stepper.reset();
                });                
            }
        }
    }

    /**
     * backToContests()
     */
    backToContests(): void
    {
        if (this._contestFormGroup.dirty || this._judgingFormGroup.dirty)
        {
            
        }
        else
            this._router.navigate(['contest-list']);
    }
}

/**
 * fixDate()
 */
function fixDate(cDate: Date): Date
{
    var dt = new Date(cDate);
    dt = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()));
    return dt;
}