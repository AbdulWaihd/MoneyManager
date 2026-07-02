// // src/hooks/useForm.ts
// // ============================================
// // RESPONSIBILITY: Form state management
// // - Validation logic
// // - Error tracking
// // - Field state management
// // ============================================

// import { useState, useCallback } from 'react';
// import { z } from 'zod';

// interface FieldConfig {
//     type: 'email' | 'password' | 'text';
//     label: string;
//     required: boolean;
//     rules?: Array<{ validate: (v: string) => boolean; message: string }>;
// }

// // create one reusable form engine that can work with different shapes of data.

// export function useForm(schema: Record<string, FieldConfig>) {
//     // Record<K,V>---------> key-value pair
//     // <KeyboardEvent,V> ---->An object whose keys are K and whose values are V.

//     const [values, setValues] = useState<Record<string, string>>(() => {
//         // using () => {} means lazy initialization--->Run ONCE.Only during first render.
//         const initial: Record<string, string> = {};
//         Object.keys(schema).forEach((key) => {
//             initial[key] = '';
//         });
//         return initial;
//     });

//     const [touched, setTouched] = useState<Record<string, boolean>>({});
//     const [errors, setErrors] = useState<Record<string, string>>({});

//     const validateField = useCallback(
//         (field: string, value: string): string | null => {
//             const config = schema[field];
//             if (!config) return null;

//             if (config.required && !value.trim()) {
//                 return `${config.label} is required`;
//             }

//             if (config.type === 'email' && value) {
//                 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                 if (!emailRegex.test(value)) {
//                     return 'Enter a valid email address';
//                 }
//             }

//             if (config.type === 'password' && value) {
//                 if (value.length < 6) {
//                     return 'Password must be at least 6 characters';
//                 }
//             }

//             if (config.rules) {
//                 for (const rule of config.rules) {
//                     if (!rule.validate(value)) {
//                         return rule.message;
//                     }
//                 }
//             }

//             return null;
//         },
//         [schema]
//     );

//     const handleChange = useCallback(
//         (field: string) => (text: string) => {
//             setValues((prev) => ({ ...prev, [field]: text }));

//             if (touched[field]) {
//                 const error = validateField(field, text);
//                 setErrors((prev) => ({
//                     ...prev,
//                     [field]: error || '',
//                 }));
//             }
//         },
//         [touched, validateField]
//     );

//     const handleBlur = useCallback(
//         (field: string) => () => {
//             setTouched((prev) => ({ ...prev, [field]: true }));
//             const error = validateField(field, values[field]);
//             setErrors((prev) => ({
//                 ...prev,
//                 [field]: error || '',
//             }));
//         },
//         [values, validateField]
//     );

//     const validateAll = useCallback((): boolean => {
//         const newErrors: Record<string, string> = {};
//         let isValid = true;

//         Object.keys(schema).forEach((field) => {
//             const error = validateField(field, values[field]);
//             if (error) {
//                 newErrors[field] = error;
//                 isValid = false;
//             }
//         });

//         setErrors(newErrors);
//         return isValid;
//     }, [schema, values, validateField]);

//     return {
//         values,
//         touched,
//         errors,
//         handleChange,
//         handleBlur,
//         validateAll,
//         setValues,
//     };
// }