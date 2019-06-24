export const Student = (
  id,
  name,
  username,
  email,
  password,
  createdBy,
  createdAt
) => ({
  id: {
    value: id || ""
  },
  name: {
    value: name || ""
  },
  username: {
    value: username || ""
  },
  email: {
    value: email || ""
  },
  password: {
    value: password || ""
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
    value: id || ""
  },
  courseCode: {
    value: courseCode || ""
  },
  name: {
    value: name || ""
  },
  description: {
    value: description || ""
  },
  createdBy: createdBy,
  createdAt: createdAt
});
