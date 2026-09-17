import { IsNotEmpty, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "hasContentField", async: false }) 
class HasContentFieldConstraint implements ValidatorConstraintInterface {
    validate(data: Record<string, any>, args: ValidationArguments) {
        return typeof data === "object" && data !== null && "Content" in data;
    }
    defaultMessage(args: ValidationArguments): string {
        return "data must have a 'Content' field";
    }
}

export class CreateResourceDto {
    @IsNotEmpty() 
    @Validate(HasContentFieldConstraint)
    data: Record<string, any>;
}