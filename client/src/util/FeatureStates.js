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
  sectionId,
  name,
  year,
  noOfStudents,
  course,
  students,
  status,
  createdBy,
  createdAt
) => ({
  isLoading: true,
  sectionId: {
    value: sectionId,
    validateStatus: sectionId ? "success" : ""
  },
  name: {
    value: name,
    validateStatus: sectionId ? "success" : ""
  },
  year: {
    value: year,
    validateStatus: sectionId ? "success" : ""
  },
  noOfStudents: {
    value: noOfStudents,
    validateStatus: sectionId ? "success" : ""
  },
  course: {
    value: course,
    validateStatus: sectionId ? "success" : ""
  },
  students: {
    value: students,
    validateStatus: sectionId ? "success" : ""
  },
  status: {
    value: status,
    validateStatus: sectionId ? "success" : ""
  },
  createdBy: createdBy,
  createdAt: createdAt
});

export const SmartTeam = (
  id,
  name,
  questionnaireStart,
  questionnaireEnd,
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
  questionnaireStart: {
    days: 1,
    hours: 0
  },
  questionnaireEnd: {
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
