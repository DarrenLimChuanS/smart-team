import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from "../constants";

export const validateNotEmpty = (input, inputName) => {
  if (input === "") {
    return {
      validateStatus: "error",
      errorMsg: `${inputName} cannot be empty.`
    };
  } else {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  }
};

export const validateNotRequired = () => {
  return {
    validateStatus: "success",
    errorMsg: null
  };
};

export const validateName = name => {
  if (name.length < NAME_MIN_LENGTH) {
    return {
      validateStatus: "error",
      errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
    };
  } else if (name.length > NAME_MAX_LENGTH) {
    return {
      validateStatus: "error",
      errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
    };
  } else {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  }
};

export const validateNumber = (number, min, max) => {
  if (number < min) {
    return {
      validateStatus: "error",
      errorMsg: `Value too low (Minimum value of ${min})`
    };
  } else if (number > max) {
    return {
      validateStatus: "error",
      errorMsg: `Value too high (Maximum value of ${max})`
    };
  } else {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  }
};

export const validateGroup = (
  number,
  min,
  max,
  noOfStudents,
  teamSize,
  noOfTeams
) => {
  if (number < min) {
    return {
      validateStatus: "error",
      errorMsg: `Value too low (Minimum value of ${min})`
    };
  } else if (number > max) {
    return {
      validateStatus: "error",
      errorMsg: `Value too high (Maximum value of ${max})`
    };
  } else if (
    noOfStudents - teamSize * noOfTeams < 0 ||
    noOfStudents - teamSize * noOfTeams > 0
  ) {
    return {
      validateStatus: "error",
      errorMsg: `Invalid number of people in a team.`
    };
  } else {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  }
};

export const validateEmail = email => {
  if (!email) {
    return {
      validateStatus: "error",
      errorMsg: "Email may not be empty"
    };
  }

  const EMAIL_REGEX = RegExp("[^@ ]+@[^@ ]+\\.[^@ ]+");
  if (!EMAIL_REGEX.test(email)) {
    return {
      validateStatus: "error",
      errorMsg: "Email not valid"
    };
  }

  if (email.length > EMAIL_MAX_LENGTH) {
    return {
      validateStatus: "error",
      errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
    };
  }

  return {
    validateStatus: null,
    errorMsg: null
  };
};

export const validateUsername = username => {
  if (username.length < USERNAME_MIN_LENGTH) {
    return {
      validateStatus: "error",
      errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
    };
  } else if (username.length > USERNAME_MAX_LENGTH) {
    return {
      validateStatus: "error",
      errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
    };
  } else {
    return {
      validateStatus: null,
      errorMsg: null
    };
  }
};

export const validatePassword = password => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      validateStatus: "error",
      errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
    };
  } else if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      validateStatus: "error",
      errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
    };
  } else {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  }
};

export const validateYear = year => {
  if (year === "") {
    return {
      validateStatus: "error",
      errorMsg: `Year cannot be empty.`
    };
  } else if (year < 0) {
    return {
      validateStatus: "error",
      errorMsg: `Year cannot be less than 0.`
    };
  } else {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  }
};
