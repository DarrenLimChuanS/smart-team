import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {Radio, Input, Typography, Slider, Icon, Divider, Rate} from 'antd';


const desc = ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very likely'];


class QuestionnairesStudent extends Component {
    state = {
        filteredInfo: null,
        sortedInfo: null,
        value: 0,
        slider_value: 0,
        rating_value: 3,
    };

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    handleChange = slider_value => {
        this.setState({slider_value});
    };

    handleChange = rating_value => {
        this.setState({rating_value});
    };

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',

        };

        const {max ,min } = this.props;
        const {slider_value} = this.state;
        const mid = ((max - min) / 2).toFixed(5);
        const preColor = slider_value >= mid ? '' : 'rgba(0, 0, 0, .45)';
        const nextColor = slider_value >= mid ? 'rgba(0, 0, 0, .45)' : '';

        const {rating_value} = this.state;

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

                <Divider/>
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


                <Divider/>
                <div className="icon-wrapper">
                    <p>How much would you like to be in a team? Sliding to the right indicates more likes.</p>
                    <Icon style={{color: preColor}} type="frown-o"/>
                    <Slider max={20}{...this.props} onChange={this.handleChange} slider_value={slider_value }/>
                    <Icon style={{color: nextColor}} type="smile-o"/>
                </div>

                <Divider/>
                <div>
                <span>
                    <p>How much would you like to be in a team? </p>
                     <Rate tooltips={desc} onChange={this.handleChange} rating_value={rating_value}/>
                    {rating_value ? <span className="ant-rate-text">{desc[rating_value - 1]}</span> : ''}
                  </span>
                </div>

            </div>


        );
    }
}


export default withRouter(QuestionnairesStudent);