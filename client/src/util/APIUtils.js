import {
  API_BASE_URL,
  POLL_LIST_SIZE,
  COURSE_LIST_SIZE,
  SECTION_LIST_SIZE,
  ACCESS_TOKEN
} from "../constants";

const request = options => {
  const headers = new Headers({
    "Content-Type": "application/json"
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function getAllPolls(page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
    method: "GET"
  });
}

export function createPoll(pollData) {
  return request({
    url: API_BASE_URL + "/polls",
    method: "POST",
    body: JSON.stringify(pollData)
  });
}

export function getAllCourses(page, size) {
  page = page || 0;
  size = size || COURSE_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/courses?page=" + page + "&size=" + size,
    method: "GET"
  });
}

export function getCourseById(id) {
  return request({
    url: API_BASE_URL + "/courses/" + id,
    method: "GET"
  });
}

export function createCourse(courseData) {
  return request({
    url: API_BASE_URL + "/courses",
    method: "POST",
    body: JSON.stringify(courseData)
  });
}

export function updateCourse(courseId, courseData) {
  return request({
    url: API_BASE_URL + "/courses/" + courseId,
    method: "PUT",
    body: JSON.stringify(courseData)
  });
}

export function deleteCourse(courseId) {
  return request({
    url: API_BASE_URL + "/courses/" + courseId,
    method: "DELETE"
  });
}

export function getAllSections(page, size) {
  page = page || 0;
  size = size || SECTION_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/courses?page=" + page + "&size=" + size,
    method: "GET"
  });
}

export function getSectionById(id) {
  return request({
    url: API_BASE_URL + "/sections/" + id,
    method: "GET"
  });
}

export function createSection(sectionData) {
  return request({
    url: API_BASE_URL + "/sections",
    method: "POST",
    body: JSON.stringify(sectionData)
  });
}

export function updateSection(sectionId, sectionData) {
  return request({
    url: API_BASE_URL + "/sections/" + sectionId,
    method: "PUT",
    body: JSON.stringify(sectionData)
  });
}

export function deleteSection(sectionId) {
  return request({
    url: API_BASE_URL + "/sections/" + sectionId,
    method: "DELETE"
  });
}

export function castVote(voteData) {
  return request({
    url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
    method: "POST",
    body: JSON.stringify(voteData)
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/signin",
    method: "POST",
    body: JSON.stringify(loginRequest)
  });
}

export function signup(signupRequest, role) {
  return request({
    url: API_BASE_URL + "/auth/signup/" + role,
    method: "POST",
    body: JSON.stringify(signupRequest)
  });
}

// Function to retrieve all students of a teacher
export function getStudentsByTeacher(userid) {
  return request({
    url: API_BASE_URL + "/users/" + userid + "/students",
    method: "GET"
  });
}

// Function to retrieve student information by ID
export function getStudentById(studentId) {
  return request({
    url: API_BASE_URL + "/users/id/" + studentId,
    method: "GET"
  });
}

// Function to update student by ID
export function updateStudent(studentId, studentData) {
  return request({
    url: API_BASE_URL + "/student/" + studentId,
    method: "PUT",
    body: JSON.stringify(studentData)
  });
}

// Function to delete student by ID
export function deleteStudent(studentId) {
  return request({
    url: API_BASE_URL + "/users/" + studentId,
    method: "DELETE"
  });
}

/**
 * End of Student APIs
 **/
export function checkUsernameAvailability(username) {
  return request({
    url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
    method: "GET"
  });
}

export function checkEmailAvailability(email) {
  return request({
    url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
    method: "GET"
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/user/me",
    method: "GET"
  });
}

export function getUserProfile(username) {
  return request({
    url: API_BASE_URL + "/users/" + username,
    method: "GET"
  });
}

export function getUserCreatedPolls(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/polls?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function getUserCreatedCourses(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/courses?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function getUserCreatedSections(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/sections?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function getUserCreatedStudents(username, page, size) {
  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/students?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function getStudentCourses(username) {
  return request({
    url: API_BASE_URL + "/users/" + username + "/courses/in",
    method: "GET"
  });
}

export function getUserVotedPolls(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/votes?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

/**
 * Start of SmartTeam APIs
 **/
export function createSmartTeam(smartTeamData) {
  return request({
    url: API_BASE_URL + "/smartteams",
    method: "POST",
    body: JSON.stringify(smartTeamData)
  });
}

export function getSmartteamById(smartTeamId) {
  return request({
    url: API_BASE_URL + "/smartteams/" + smartTeamId,
    method: "GET"
  });
}

export function getSmartteamOutcomeById(smartTeamId) {
  return request({
    url: API_BASE_URL + "/smartteams/" + smartTeamId + "/outcome",
    method: "GET"
  });
}

export function populateSmartTeam(smartTeamId) {
  return request({
    url: API_BASE_URL + "/smartteams/" + smartTeamId,
    method: "PUT"
  });
}

export function countByOutcomeGroupByCriteriaId(smartteamId) {
  return request({
    url: API_BASE_URL + "/smartteams/outcome/" + smartteamId,
    method: "GET"
  });
}
/**
 * End of SmartTeam APIs
 **/

/**
 * Criteria APIs
 **/

export function createCriteria(criteriaData) {
  return request({
    url: API_BASE_URL + "/criteria",
    method: "POST",
    body: JSON.stringify(criteriaData)
  });
}

export function getAllCriteria(page, size) {
  page = page || 0;
  size = size || COURSE_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/criteria?page=" + page + "&size=" + size,
    method: "GET"
  });
}

export function getUserCreatedCriteria(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/criteria?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function getCriteriaById(criteriaId, page, size) {
  page = page || 0;
  size = size || COURSE_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/criteria/" +
      criteriaId +
      "?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function deleteCriteria(criteriaId) {
  return request({
    url: API_BASE_URL + "/criteria/" + criteriaId,
    method: "DELETE"
  });
}

/**
 * Questionnaire APIs
 **/

export function createQuestionnaire(questionnaireData) {
  return request({
    url: API_BASE_URL + "/questionnaires",
    method: "POST",
    body: JSON.stringify(questionnaireData)
  });
}

export function getQuestionnaireById(questionnaireId) {
  return request({
    url: API_BASE_URL + "/questionnaires/" + questionnaireId,
    method: "GET"
  });
}

export function getAllQuestionnaires(page, size) {
  page = page || 0;
  size = size || COURSE_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/questionnaire?page=" + page + "&size=" + size,
    method: "GET"
  });
}

export function getUserCreatedQuestionnaires(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/questionnaires?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function addCriteriaToQuestionnaire(questionnaireId, criteriaId) {
  return request({
    url:
      API_BASE_URL +
      "/questionnaires/" +
      questionnaireId +
      "/criteria/" +
      criteriaId,
    method: "PUT"
  });
}

export function updateChoices(choiceData) {
  return request({
    url: API_BASE_URL + "/outcome/update",
    method: "PUT",
    body: JSON.stringify(choiceData)
  });
}

export function updateQuestionnaire(questionnaireId, questionnaireData) {
  return request({
    url: API_BASE_URL + "/questionnaires/" + questionnaireId,
    method: "PUT",
    body: JSON.stringify(questionnaireData)
  });
}

export function deleteQuestionnaire(questionnaireId) {
  return request({
    url: API_BASE_URL + "/questionnaires/" + questionnaireId,
    method: "DELETE"
  });
}

export function removeCriteriaFromQuestionnaire(questionnaireId, criteriaId) {
  return request({
    url:
      API_BASE_URL +
      "/questionnaires/" +
      questionnaireId +
      "/criteria/" +
      criteriaId,
    method: "DELETE"
  });
}
