import { HateoasResource, Resource } from "@lagoshny/ngx-hateoas-client";

@HateoasResource('judgings')
export class JudgingResource extends Resource 
{
    public judgingStartDate: Date;
    public judgingEndDate: Date;
    public resultsDate: Date;

    public isThereAJudgingEvent: boolean;
}