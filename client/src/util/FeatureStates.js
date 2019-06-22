export const Student = (
  id,
  batch_no,
  name,
  username,
  email,
  password,
  createdBy,
  createdAt
) => ({
  id: {
    value: id,
    validateStatus: id ? "success" : ""
  },
  batch_no: {
    value: batch_no,
    validateStatus: id ? "success" : ""
  },
  name: {
    value: name,
    validateStatus: id ? "success" : ""
  },
  username: {
    value: username,
    validateStatus: id ? "success" : ""
  },
  email: {
    value: email,
    validateStatus: id ? "success" : ""
  },
  password: {
    value: password
  },
  createdBy: createdBy,
  createdAt: createdAt
});

export const Course = (
  id,
  courseCode,
  name,
  description,
  createdBy,
  createdAt
) => ({
  id: {
    value: id,
    validateStatus: id ? "success" : ""
  },
  courseCode: {
    value: courseCode,
    validateStatus: id ? "success" : ""
  },
  name: {
    value: name,
    validateStatus: id ? "success" : ""
  },
  description: {
    value: description,
    validateStatus: id ? "success" : ""
  },
  createdBy: createdBy,
  createdAt: createdAt
});

export const Section = (
  id,
  name,
  year,
  noOfStudents,
  students,
  course,
  status,
  createdBy,
  createdAt
) => ({
  id: {
    value: id,
    validateStatus: id ? "success" : ""
  },
  name: {
    value: name,
    validateStatus: id ? "success" : ""
  },
  year: {
    value: year,
    validateStatus: id ? "success" : ""
  },
  noOfStudents: {
    value: noOfStudents,
    validateStatus: id ? "success" : ""
  },
  students: {
    value: students,
    validateStatus: id ? "success" : ""
  },
  course: {
    value: course,
    validateStatus: id ? "success" : ""
  },
  status: {
    value: status,
    validateStatus: id ? "success" : ""
  },
  createdBy: createdBy,
  createdAt: createdAt
});
