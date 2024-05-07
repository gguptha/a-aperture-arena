import { Injectable } from "@angular/core";
import { HateoasResourceOperation } from "@lagoshny/ngx-hateoas-client";
import { SectionResource } from "./section.resource";

@Injectable({
    providedIn: 'root'
})
export class SectionService extends HateoasResourceOperation<SectionResource> 
{
    /**
     * constructor()
     */
    constructor() 
    { 
        super(SectionResource);
    }
}
