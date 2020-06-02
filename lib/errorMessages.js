export const ERROR_MESSAGES = {
    DIVISION_BY_ZERO: "Error. Division by zero.",
    NUMBER_TOO_BIG: "Error. Number too big.",
    NUMBER_TOO_SMALL: "Error. Number too small"
}

export const isAnErrorMessage = (errorMessage) => {
   return Object.values(ERROR_MESSAGES).includes(errorMessage);
}

