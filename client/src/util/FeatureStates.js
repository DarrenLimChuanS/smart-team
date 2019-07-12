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
    value: id,
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
  users,
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
  users: {
    value: users,
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

export const SmartTeam = (
  id,
  name,
  pollStart,
  pollEnd,
  smartteamStartdate,
  smartteamEnddate,
  questionnaire,
  user,
  section,
  initiatedBy,
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
  teamnumbertype: {
    value: 0,
    validateStatus: id ? "success" : ""
  },
  noOfTeams: {
    value: 0,
    validateStatus: id ? "success" : ""
  },
  pollStart: {
    days: 1,
    hours: 0
  },
  pollEnd: {
    days: 1,
    hours: 0
  },
  smartteamStartdate: {
    value: smartteamStartdate,
    validateStatus: id ? "success" : ""
  },
  smartteamEnddate: {
    value: smartteamEnddate,
    validateStatus: id ? "success" : ""
  },
  questionnaire: {
    value: questionnaire,
    validateStatus: id ? "success" : ""
  },
  user: {
    value: user,
    validateStatus: id ? "success" : ""
  },
  section: {
    value: section,
    validateStatus: id ? "success" : ""
  },
  initiatedBy: initiatedBy,
  createdAt: createdAt
});
