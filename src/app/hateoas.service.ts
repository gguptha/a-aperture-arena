import { Injectable } from "@angular/core";
import { NgxHateoasClientConfigurationService } from "@lagoshny/ngx-hateoas-client";
import { environment } from "environments/environment";

@Injectable({providedIn: 'root'})
export class HateoasConfigurationService {

    constructor(config: NgxHateoasClientConfigurationService) {
        config.configure({
            http: {
                rootUrl: environment.hateoasApiHost
            },
            useTypes: {
                resources: [
                ]
            },
            cache: {
                enabled: false
            },
            isProduction: true
        })
    }
}