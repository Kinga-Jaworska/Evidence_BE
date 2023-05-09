// import {
//     ValidatorConstraint,
//     ValidatorConstraintInterface,
//     validate,
//     registerDecorator,
//     ValidationOptions,
//   } from 'class-validator';
//   import { plainToClass } from 'class-transformer';

//   export const IsValidCredentials = (validationOptions?: ValidationOptions) => {
//     return (object: object, propertyName: string) => {
//       registerDecorator({
//         target: object.constructor,
//         propertyName,
//         options: validationOptions,
//         constraints: [],
//         validator: IsCredentialValid,
//       });
//     };
//   };

//   @ValidatorConstraint()
//   export class IsCredentialValid implements ValidatorConstraintInterface {
//     public async validate(value: any) {
//       const validations = [];

//       Object.entries(value).forEach((entry) => {
//         validations.push(validate(plainToClass(CredentialDTO, entry[1])));
//       });

//       const process = await Promise.all(validations);
//       return process.every((result) => result.length <= 0);
//     }

//     public defaultMessage() {
//       return 'Invalid format of credentials';
//     }
//   }
