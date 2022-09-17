import { Video } from './video.types';

type ValidateFunc = (value: any) => boolean;

type ValidateDict = {
    [key in keyof Video]?: ValidateFunc;
};

const availableResolutionsValues = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];

const validateByField: ValidateDict = {
    title: (value: any) => typeof value === 'string' && value.length < 40,
    author: (value: any) => typeof value === 'string' && value.length < 20,
    availableResolutions: (value: any) =>
        Array.isArray(value) && value.every((item) => availableResolutionsValues.includes(item)),
    canBeDownloaded: (value: any) => typeof value === 'boolean' || value === undefined,
    minAgeRestriction: (value: any) =>
        (typeof value === 'number' && value > 1 && value < 18) || value === undefined || value === null,
    createdAt: (value: any) => typeof value === 'string' || value === undefined,
    publicationDate: (value: any) => typeof value === 'string' || value === undefined,
} as const;

const requiredFields = ['title', 'author', 'availableResolutions'];

const validateData = (data: any) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return [
            {
                message: 'Not valid data',
            },
        ];
    }

    const keys = Object.keys(data);

    const requiredErrors = requiredFields.filter((item) => !keys.includes(item));

    if (requiredErrors.length) {
        return requiredErrors.map((errorField) => ({
            message: 'Required field',
            field: errorField,
        }));
    }

    const errors: { message: string; field: string }[] = [];

    Object.entries(data).forEach(([key, value]) => {
        const validate = validateByField[key as keyof Video];

        if (!validate) {
            return;
        }

        const result = validate(value);

        if (!result) {
            errors.push({
                message: 'Not valid field',
                field: key,
            });
        }
    });

    return errors;
};

export const VideoValidator = {
    validateData,
};
