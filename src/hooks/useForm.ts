// the question becomes: How do you write ONE hook that works with THREE different shapes?
// THE ANSWER: GENERICS----->A generic is a placeholder for "some type we don't know yet."
// it is just a symbol that will be replaced when we USE the function.

import React, { useState } from "react";
import { z } from 'zod';

// Function Declaration
// Box<T>. --->useForm<LoginFormData> or useForm<SignupFormData> or useForm<ResetPasswordFormData>
export function useForm<T extends Record<string, any>>(
    // T= "this hook accepts any form shape, call it T"
    // extends ----> T should be object.
    // Record<string,any> ----> object

    schema: z.ZodType<T, any, any>,
    // = "pass me a Zod schema that validates exactly T" 
    // You can't pass the default values of a different shape.
    // T = LoginFormData-----> {email:"",pass:"",remember:true}--->schema = loginSchema

    initialValues: T
    // "pass me the starting values, and they must match T's shape"

) {

    const [values, setValues] = useState<T>(initialValues);

    const [touched, setTouched] =
        useState<Partial<Record<keyof T, boolean>>>({});
    // Record<keyof T, boolean> ----> { email: boolean; password: boolean; rememberMe: boolean;}
    // partial---> to make {} valid bcz at inital when the component mounts ---> the values are {} and {} is not a valid object ----> so partial makes it valid.   


    const [errors, setErrors] =
        useState<Partial<Record<keyof T, string>>>({});

    // Give me only the errors I’m allowed to show right now.
    // this function show error only for the fields that are touched.
    const getFieldErrors = (
        allValues: T,
        //  allValues: T,----> entire form
        onlyFields: Partial<Record<keyof T, boolean>>
        // onlyFields: Partial<Record<keyof T, boolean>> ---> it will tell me which field is touched. 
        // we use partial here becuase at the inital the touched is {} and {} is not a valid object ---> so partial makes it valid.  

    ): Partial<Record<keyof T, string>> => {
        const result = schema.safeParse(allValues);
        // askin zod to tell entire form is valid or not.
        //  safeParse(): it returns an object with a success boolean and either the parsed data (if valid) or an error object (if invalid).

        const fieldErrors: Partial<Record<keyof T, string>> = {};
        // creating an empty bucket of errors
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                //                 [
                //     {
                //         path: ["email"],
                //         message: "Email is required"
                //     },

                //     {
                //         path: ["password"],
                //         message: "Password must be at least 6 characters"
                //     }
                // ]
                const field = issue.path[0] as keyof T;
                // How do I know that string exists inside T?
                // answer----> we dont know for sure.
                //             -----------------------
                //            | but zod says  it is there |
                //             -----------------------

                // as keyof T ---->assertion ----> telling ts This value is definitely one of the keys of T.

                if (onlyFields[field] && !fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            });
        }

        return fieldErrors;
    };

    const handleChange = (field: keyof T) => (value: any) => {
        const nextValues = {
            ...values,
            [field]: value,
        };

        setValues(nextValues);

        if (touched[field]) {
            const fieldErrors = getFieldErrors(nextValues, touched);

            setErrors((prev) => ({
                ...prev,
                [field]: fieldErrors[field] ?? '',
            }));
        }
    };

    const handleBlur = (field: keyof T) => () => {
        const nextTouched = {
            ...touched,
            [field]: true,
        };
        setTouched(nextTouched);

        const fieldErrors = getFieldErrors(values, nextTouched);

        setErrors((prev) => ({
            ...prev,
            [field]: fieldErrors[field] ?? '',
        }));
    };

    const validateAll = (): boolean => {
        const allTouched: Partial<Record<keyof T, boolean>> = {};

        (Object.keys(values) as Array<keyof T>).forEach((key) => {
            allTouched[key] = true;
        });

        setTouched(allTouched);

        const result = schema.safeParse(values);

        if (result.success) {
            setErrors({});
            return true;
        }

        const allErrors: Partial<Record<keyof T, string>> = {};

        result.error.errors.forEach((issue) => {
            const field = issue.path[0] as keyof T;

            if (!allErrors[field]) {
                allErrors[field] = issue.message;
            }
        });

        setErrors(allErrors);

        return false;
    };

    return {
        values,
        touched,
        errors,
        setValues,
        handleChange,
        handleBlur,
        validateAll,
    };

}