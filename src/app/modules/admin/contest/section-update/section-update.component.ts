import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SectionResource } from '../section.resource';
import { ContestService } from '../contest.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SectionService } from '../section.service';

@Component({
    selector       : 'section-update',
    templateUrl    : './section-update.component.html',
    encapsulation  : ViewEncapsulation.None,
    standalone     : true,
    imports        : [MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TextFieldModule, 
                            NgClass, NgIf, MatDatepickerModule, NgFor, MatCheckboxModule, DatePipe, NgIf, TitleCasePipe, MatSelectModule],
    providers      : [DatePipe]
})
export class SectionUpdateComponent implements OnInit
{
    title = '';

    _sectionFormGroup: FormGroup;
    _selectedSection: SectionResource;

    /**
     * Constructor
     */
    constructor(
        public _dialogRef: MatDialogRef<SectionUpdateComponent>,
        private _formBuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA) private _dialogData: any,
        private _contestService: ContestService,
        private _matSnackBar: MatSnackBar,
        private _sectionService: SectionService
    )
    {
        if (!_dialogData.selectedSection)
            this.title = "Create new section";
        else
        {
            this._selectedSection = _dialogData.selectedSection;
            this.title = "Update section";
        }
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._sectionFormGroup = this._formBuilder.group({
            name: [this._selectedSection?.name || '', Validators.required],
            sectionType: [this._selectedSection?.sectionType || "Digital", Validators.required],
            orderForDisplay: [this._selectedSection?.orderForDisplay || '', Validators.required],
            maximumUploads: [this._selectedSection?.maximumUploads || '', Validators.required],
            submissionLastDate: [this._selectedSection?.submissionLastDate || '', Validators.required]
        });
    }

    /**
     * submit()
     */
    submit(): void {
        if (this._sectionFormGroup.valid)
        {
            var sectionFormValue = this._sectionFormGroup.value;

            if (sectionFormValue.submissionLastDate)
                sectionFormValue.submissionLastDate = fixDate(sectionFormValue.submissionLastDate);
            
            let contestResource = this._contestService._selectedContest.value;
            let array = contestResource.getSelfLinkHref().split('/');

            if (!this._dialogData.selectedSection)
            {
                let sectionResource = new SectionResource();
                sectionResource.name = sectionFormValue.name;
                sectionResource.sectionType = sectionFormValue.sectionType;
                sectionResource.orderForDisplay = sectionFormValue.orderForDisplay;
                sectionResource.maximumUploads = sectionFormValue.maximumUploads;
                sectionResource.submissionLastDate = sectionFormValue.submissionLastDate;

                // Create a new section
                this._sectionService.createResource({body: sectionResource}).subscribe(section => {
                    // Add the newly create section to the contest
                    contestResource.addCollectionRelation('sections', [section]).subscribe(obj => {
                        // Refresh the selected contest via a new api call as the previous method returns an empty response
                        this._contestService.getResource(array[array.length - 1]).subscribe(contest => {
                            this._contestService._selectedContest.next(contest);
                            this._dialogRef.close();
                            this._matSnackBar.open('Section added successfully.', 'OK', { duration: 7000 });
                        });
                    });
                });
            }
            else
            {
                this._selectedSection.name = sectionFormValue.name;
                this._selectedSection.sectionType = sectionFormValue.sectionType;
                this._selectedSection.orderForDisplay = sectionFormValue.orderForDisplay;
                this._selectedSection.maximumUploads = sectionFormValue.maximumUploads;
                this._selectedSection.submissionLastDate = sectionFormValue.submissionLastDate;
                this._sectionService.updateResource(this._selectedSection).subscribe(section => {
                    this._contestService.getResource(array[array.length - 1]).subscribe(contest => {
                        this._contestService._selectedContest.next(contest);
                        this._dialogRef.close();
                        this._matSnackBar.open('Section updated successfully.', 'OK', { duration: 7000 });
                    });
                });
            }
        }
    }
}

/**
 * fixDate()
 */
function fixDate(cDate: Date): Date
{
    console.log(cDate);
    
    var dt = new Date(cDate);
    dt = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()));
    return dt;
}
