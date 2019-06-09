import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {Radio, Input, Typography, Slider,Icon} from 'antd';

class QuestionnairesStudent extends Component {
    state = {
        filteredInfo: null,
        sortedInfo: null,
        value: 0,
    };

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    handleChange = value => {
        this.setState({ value });
    };

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',

        };

        const min = 0, max = 5;
        const { value } = this.state;
        const mid = ((max - min) / 2).toFixed(5);
        const preColor = value >= mid ? '' : 'rgba(0, 0, 0, .45)';
        const nextColor = value >= mid ? 'rgba(0, 0, 0, .45)' : '';

        return (
            <div>
                <p>What is your GPA?</p>
            <Radio.Group onChange={this.onChange} value={this.state.value}>
                <Radio style={radioStyle} value={1}>
                    4.0 - 3.0
                </Radio>
                <Radio style={radioStyle} value={2}>
                    2.99 - 2.5
                </Radio>
                <Radio style={radioStyle} value={3}>
                    2.49 - 2.0
                </Radio>
                <Radio style={radioStyle} value={4}>
                    Below 2.0
                </Radio>
                <Radio style={radioStyle} value={5}>
                    More...
                    {this.state.value === 4 ? <Input style={{width: 100, marginLeft: 10}}/> : null}
                </Radio>
            </Radio.Group>

                <p>What is your Gender?</p>
                <Radio.Group onChange={this.onChange} value={this.state.value}>
                    <Radio style={radioStyle} value={1}>
                        Male
                    </Radio>
                    <Radio style={radioStyle} value={2}>
                        Female
                    </Radio>
                    <Radio style={radioStyle} value={3}>
                        Neither
                    </Radio>
                    <Radio style={radioStyle} value={4}>
                        More...
                        {this.state.value === 4 ? <Input style={{width: 100, marginLeft: 10}}/> : null}
                    </Radio>
                </Radio.Group>


                <div className="icon-wrapper">
                    <p>How much do you love to be in a team? Slide left to liking it to the most.</p>
                    <Icon style={{ color: preColor }} type="frown-o" />
                    <Slider {...this.props} onChange={this.handleChange} value={value} />
                    <Icon style={{ color: nextColor }} type="smile-o" />
                </div>
            </div>




        );
    }
}



export default withRouter(QuestionnairesStudent);