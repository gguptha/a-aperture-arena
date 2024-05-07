import { Injectable } from "@angular/core";
import { HateoasResourceOperation } from "@lagoshny/ngx-hateoas-client";
import { BehaviorSubject } from "rxjs";
import { ContestResource } from "./contest.resource";

@Injectable({
    providedIn: 'root'
})
export class ContestService  extends HateoasResourceOperation<ContestResource> 
{
    _selectedContest = new BehaviorSubject<ContestResource>(null);

    /**
     * constructor()
     */
    constructor() 
    {
        super(ContestResource);
    }
}