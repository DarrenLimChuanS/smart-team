import { Layout, notification } from "antd";
import React, { Component } from "react";
import { Route, withRouter, Switch } from "react-router-dom";

import AppHeader from "../common/AppHeader";
import LoadingIndicator from "../common/LoadingIndicator";
import NotFound from "../common/NotFound";
import PrivateRoute from "../common/PrivateRoute";

import Sidebar from "../common/Sidebar";
import { ACCESS_TOKEN } from "../constants";

import Courses from "../courses/Course";
import GroupStudent from "../courses/GroupStudent";
import StudentQuestionnaire from "../courses/StudentQuestionnaire";
import Home from "../home/Home";
import NewPoll from "../poll/NewPoll";
import CourseList from "../teacher/course/CourseList";
import EditCourse from "../teacher/course/EditCourse";
import CriteriaList from "../teacher/criteria/CriteriaList";
import NewCriteria from "../teacher/criteria/NewCriteria";
import QuestionnaireList from "../teacher/questionnaire/QuestionnaireList";
import EditSection from "../teacher/section/EditSection";
import SectionList from "../teacher/section/SectionList";
import SectionTeam from "../teacher/section/Team";
import NewSmartTeam from "../teacher/smartteam/NewSmartTeam";
import ViewResults from "../teacher/smartteam/ViewResults";
import EditStudent from "../teacher/student/EditStudent";
import StudentList from "../teacher/student/StudentList";
import Login from "../user/login/Login";
import Profile from "../user/profile/Profile";

import Signup from "../user/signup/Signup";
import { getCurrentUser } from "../util/APIUtils";
import "./App.css";
import PollList from "../poll/PollList";
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: "topRight",
      top: 70,
      duration: 3
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(
    redirectTo = "/",
    notificationType = "success",
    description = "You're successfully logged out."
  ) {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: "Smart Team",
      description: description
    });
  }

  handleLogin() {
    notification.success({
      message: "Smart Team",
      description: "You're successfully logged in."
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <Layout className="app-container">
        <AppHeader
          isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          onLogout={this.handleLogout}
        />
        {this.state.currentUser ? (
          <Sidebar currentUser={this.state.currentUser}>
            <Content className="app-content">
              <div className="container">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={props => (
                      <PollList
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        handleLogout={this.handleLogout}
                        {...props}
                      />
                    )}
                  />
                  <Route exact path="/" render={""} />
                  <Route
                    path="/login"
                    render={props => (
                      <Login onLogin={this.handleLogin} {...props} />
                    )}
                  />
                  <Route path="/signup" component={Signup} />
                  <Route
                    path="/users/:username"
                    render={props => (
                      <Profile
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        {...props}
                      />
                    )}
                  />
                  <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/student/:id"
                    component={EditStudent}
                    handleLogout={this.handleLogout}
                  />
                  <Route
                    authenticated={this.state.isAuthenticated}
                    path="/student"
                    render={props => (
                      <StudentList
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        {...props}
                      />
                    )}
                    handleLogout={this.handleLogout}
                  />
                  <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/student"
                    component={StudentList}
                    handleLogout={this.handleLogout}
                  />
                  <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/poll/new"
                    component={NewPoll}
                    handleLogout={this.handleLogout}
                  />
                  <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/course/:id"
                    component={EditCourse}
                    handleLogout={this.handleLogout}
                  />
                  <Route
                    authenticated={this.state.isAuthenticated}
                    path="/course"
                    render={props => (
                      <CourseList
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        {...props}
                      />
                    )}
                    handleLogout={this.handleLogout}
                  />
                  <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/courses/group_student"
                    component={GroupStudent}
                    handleLogout={this.handleLogout}
                  />
                  <Route
                    authenticated={this.state.isAuthenticated}
                    path="/courses"
                    render={props => (
                      <Courses
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        {...props}
                      />
                    )}
                  />
                  <Route
                    authenticated={this.state.isAuthenticated}
                    path="/allocation/:smartTeamId/questionnaire/:id"
                    render={props => (
                      <StudentQuestionnaire
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        {...props}
                      />
                    )}
                    handleLogout={this.handleLogout}
                  />
                  <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/courses"
                    component={Courses}
                    handleLogout={this.handleLogout}
                  />
                  <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/section/:id/newsmartteam"
                    component={NewSmartTeam}
                    handleLogout={this.handleLogout}
                  />
                  <Route
                    authenticated={this.state.isAuthenticated}
                    path="/smartteam/:id/:team"
                    render={props => (
                      <SectionTeam
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        {...props}
                      />
                    )}
                    handleLogout={this.handleLogout}
                  />
                  <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/section/:sectionId/smartteam/:smartteamId/results"
                    component={ViewResults}
                    handleLogout={this.handleLogout}
                  />
                  <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/section/:id"
                    component={EditSection}
                    handleLogout={this.handleLogout}
                  />
                  <Route
                    authenticated={this.state.isAuthenticated}
                    path="/section"
                    render={props => (
                      <SectionList
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        {...props}
                      />
                    )}
                    handleLogout={this.handleLogout}
                  />
                  <Route
                    authenticated={this.state.isAuthenticated}
                    path="/questionnaire"
                    render={props => (
                      <QuestionnaireList
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        {...props}
                      />
                    )}
                    handleLogout={this.handleLogout}
                  />
                  <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/criteria/new"
                    component={NewCriteria}
                    handleLogout={this.handleLogout}
                  />
                  <Route
                    authenticated={this.state.isAuthenticated}
                    path="/criteria"
                    render={props => (
                      <CriteriaList
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        {...props}
                      />
                    )}
                    handleLogout={this.handleLogout}
                  />
                  <Route
                    authenticated={this.state.isAuthenticated}
                    path="/grouping"
                    render={props => (
                      <SectionTeam
                        isAuthenticated={this.state.isAuthenticated}
                        currentUser={this.state.currentUser}
                        {...props}
                      />
                    )}
                    handleLogout={this.handleLogout}
                  />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </Content>
          </Sidebar>
        ) : (
          <Switch>
            <Route exact path="/" render={props => <Home />} />
          </Switch>
        )}
      </Layout>
    );
  }
}

export default withRouter(App);
