import {
  validateNotEmpty,
  validateNotRequired,
  validateName,
  validateNumber,
  validateGroup,
  validateEmail,
  validateUsername,
  validatePassword,
  validateYear
} from "./Validators";

describe("validateNotEmpty", () => {
  it("should return error with message if empty", () => {
    test = validateNotEmpty("", "testInput");
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe("testInput cannot be empty.");
  });

  it("should return success if not empty", () => {
    test = validateNotEmpty("something", "testInput");
    expect(test.validateStatus).toBe("success");
    expect(test.errorMsg).toBe(null);
  });
});

describe("validateNotRequired", () => {
  it("should return success without input", () => {
    test = validateNotRequired("", "testInput");
    expect(test.validateStatus).toBe("success");
    expect(test.errorMsg).toBe(null);
  });

  it("should return success with input", () => {
    test = validateNotRequired("something", "testInput");
    expect(test.validateStatus).toBe("success");
    expect(test.errorMsg).toBe(null);
  });
});

describe("valdiateName", () => {
  it("should return error with message if name is too short", () => {
    test = validateName("");
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe(
      "Name is too short (Minimum 4 characters needed.)"
    );
  });

  it("should return error with message if name is too long", () => {
    test = validateName(
      "thisIsSomeLongNameWithIsTooooooooooooooooLooooooooooooong"
    );
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe(
      "Name is too long (Maximum 40 characters allowed.)"
    );
  });

  it("should return success if name is correct", () => {
    test = validateName("Something Wong");
    expect(test.validateStatus).toBe("success");
    expect(test.errorMsg).toBe(null);
  });
});

describe("validateNumber", () => {
  it("should return error with message if number is too low", () => {
    test = validateNumber(0, 2, 8);
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe("Value too low (Minimum value of 2)");
  });

  it("should return error with message if number is too high", () => {
    test = validateNumber(12, 2, 8);
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe("Value too high (Maximum value of 8)");
  });

  it("should return success if number is correct", () => {
    test = validateNumber(4, 2, 8);
    expect(test.validateStatus).toBe("success");
    expect(test.errorMsg).toBe(null);
  });
});

describe("validateGroup", () => {
  it("should return error with message if number is too low", () => {
    test = validateGroup(1, 2, 4, 20, 4, 1);
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe("Value too low (Minimum value of 2)");
  });

  it("should return error with message if number is too high", () => {
    test = validateGroup(5, 2, 4, 20, 4, 1);
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe("Value too high (Maximum value of 4)");
  });

  it("should return error with message if the total number of students is lesser than calculated team", () => {
    test = validateGroup(4, 2, 4, 20, 6, 5);
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe("Invalid number of people in a team.");
  });

  it("should return success if number is correct", () => {
    test = validateGroup(5, 2, 5, 5, 5, 1);
    expect(test.validateStatus).toBe("success");
    expect(test.errorMsg).toBe(null);
  });
});

describe("validateEmail", () => {
  it("should return error with message if email is empty", () => {
    test = validateEmail("");
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe("Email may not be empty");
  });

  it("should return error with message if email is in wrong format", () => {
    test = validateEmail("www.testemail.com");
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe("Email not valid");
  });

  it("should return error with message if email is too long", () => {
    test = validateEmail(
      "thisIsSomeExtremellyyyyyyyLoooooooooooooooooonggggg@test.com"
    );
    expect(test.validateStatus).toBe("error");
    expect(test.errorMsg).toBe(
      "Email is too long (Maximum 40 characters allowed)"
    );
  });

  it("should return null if email is correct", () => {
    test = validateEmail("correct@email.com");
    expect(test.validateStatus).toBe(null);
    expect(test.errorMsg).toBe(null);
  });
});
