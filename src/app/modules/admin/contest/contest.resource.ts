import { HateoasResource, Resource } from "@lagoshny/ngx-hateoas-client";
import { JudgingResource } from "./judging.resource";

@HateoasResource('contests')
export class ContestResource extends Resource 
{
    constructor()
    {
        super();
        this.judging = new JudgingResource();
    }

    public name: string;
    public registrationStartDate: Date;
    public registrationEndDate: Date;
    public status: string;
    public internationalContest: boolean;
    public pastAcceptedImagesAllowed: boolean;

    public maxImageWidthAccepted: number;
    public maxImageHeightAccepted: number;
    public maxFileSize: number;

    public judging: JudgingResource;
}