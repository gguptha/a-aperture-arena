import { HateoasResource, Resource } from "@lagoshny/ngx-hateoas-client";

@HateoasResource('sections')
export class SectionResource extends Resource 
{
    public id: string;

    public name: string;
    public sectionType: string;
    
    public orderForDisplay: number;
    public maximumUploads: number;

    public submissionLastDate: Date;
}