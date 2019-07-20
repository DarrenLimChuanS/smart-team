import React, { Component } from "react";
import "./Question.css";
import { Icon } from "antd";
import { Radio } from "antd";
const RadioGroup = Radio.Group;

class Question extends Component {
  calculatePercentage = choice => {
    if (this.props.poll.totalVotes === 0) {
      return 0;
    }
    return (choice.voteCount * 100) / this.props.poll.totalVotes;
  };

  isSelected = choice => {
    return this.props.poll.selectedChoice === choice.id;
  };

  getWinningChoice = () => {
    return this.props.poll.choices.reduce(
      (prevChoice, currentChoice) =>
        currentChoice.voteCount > prevChoice.voteCount
          ? currentChoice
          : prevChoice,
      { voteCount: -Infinity }
    );
  };

  getTimeRemaining = poll => {
    const expirationTime = new Date(poll.expirationDateTime).getTime();
    const currentTime = new Date().getTime();

    var difference_ms = expirationTime - currentTime;
    var seconds = Math.floor((difference_ms / 1000) % 60);
    var minutes = Math.floor((difference_ms / 1000 / 60) % 60);
    var hours = Math.floor((difference_ms / (1000 * 60 * 60)) % 24);
    var days = Math.floor(difference_ms / (1000 * 60 * 60 * 24));

    let timeRemaining;

    if (days > 0) {
      timeRemaining = days + " days left";
    } else if (hours > 0) {
      timeRemaining = hours + " hours left";
    } else if (minutes > 0) {
      timeRemaining = minutes + " minutes left";
    } else if (seconds > 0) {
      timeRemaining = seconds + " seconds left";
    } else {
      timeRemaining = "less than a second left";
    }

    return timeRemaining;
  };

  render() {
    const questionChoices = [];
    if (this.props.poll.selectedChoice || this.props.poll.expired) {
      const winningChoice = this.props.poll.expired
        ? this.getWinningChoice()
        : null;

      this.props.poll.choices.forEach(choice => {
        questionChoices.push(
          <CompletedOrVotedPollChoice
            key={choice.id}
            choice={choice}
            isWinner={winningChoice && choice.id === winningChoice.id}
            isSelected={this.isSelected(choice)}
            percentVote={this.calculatePercentage(choice)}
          />
        );
      });
    } else {
      this.props.poll.choices.forEach(choice => {
        questionChoices.push(
          <Radio
            className="poll-choice-radio"
            key={choice.id}
            value={choice.id}
          >
            {choice.text}
          </Radio>
        );
      });
    }
    return (
      <div className="poll-content">
        <div className="poll-header">
          <div className="poll-question">
            Question {this.props.pollIndex}: {this.props.poll.question}
          </div>
        </div>
        <div className="poll-choices">
          <RadioGroup
            className="poll-choice-radio-group"
            onChange={this.props.handleChoiceChange}
            value={this.props.currentVote}
          >
            {questionChoices}
          </RadioGroup>
        </div>
      </div>
    );
  }
}

function CompletedOrVotedPollChoice(props) {
  return (
    <div className="cv-poll-choice">
      <span className="cv-poll-choice-details">
        {/* <span className="cv-choice-percentage">
          {Math.round(props.percentVote * 100) / 100}%
        </span> */}
        <span className="cv-choice-text">{props.choice.text}</span>
        {props.isSelected ? (
          <Icon className="selected-choice-icon" type="check-circle-o" />
        ) : null}
      </span>
      {props.isSelected && (
        <span
          className={
            props.isWinner
              ? "cv-choice-percent-chart winner"
              : "cv-choice-percent-chart"
          }
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
}

export default Question;
