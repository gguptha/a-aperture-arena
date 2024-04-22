import { Injectable } from "@angular/core";
import { HateoasResourceService } from "@lagoshny/ngx-hateoas-client";
import { BehaviorSubject, Observable } from "rxjs";
import { ContestResource } from "./contest.resource";

@Injectable({
    providedIn: 'root'
})
export class ContestService {

    _selectedContest = new BehaviorSubject<ContestResource>(null);

    /**
     * constructor()
     */
    constructor(private _hateoasResourceService: HateoasResourceService) 
    { 
    }

    /**
     * getContests()
     */
    getContests(): Observable<any> 
    {
        return new Observable<any>(observer => {
            this._hateoasResourceService.getCollection(ContestResource)
            .subscribe(response => {
                observer.next(response);
                observer.complete();
            }, 
            (error) => {
                observer.next([]);
                observer.complete();
            });
        });
    }

    /**
     * createContest()
     */
    createContest(requestBody: any): Observable<ContestResource> 
    {
        return this._hateoasResourceService.createResource(ContestResource, { 
            body: requestBody
        });
    }

    /**
     * updateContest()
     */
    updateContest(contestResource: ContestResource): Observable<ContestResource> {
        return this._hateoasResourceService.updateResource(contestResource, { 
            body: contestResource
        });
    }
}
