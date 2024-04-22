import { Provider, ENVIRONMENT_INITIALIZER, inject } from "@angular/core";
import { HateoasConfigurationService } from "./hateoas.service";

export const provideHateoas = (): Provider =>
{
    return [
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(HateoasConfigurationService),
            multi   : true
        },
    ];
};