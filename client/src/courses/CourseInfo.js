import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {Typography, Divider} from "antd";
import {Card} from 'antd';

const {Title, Paragraph, Text} = Typography;

class CourseInfo extends Component {
    state = {
        filteredInfo: null,
        sortedInfo: null
    };

    render() {
        return (
            <Typography>
                <Title>ICT1001 </Title>
                <Paragraph>Introduction to ICT</Paragraph>
                <Paragraph>
                    After massive project practice and summaries, Ant Design, a design
                    language for background applications, is refined by Ant UED Team,
                    which aims to{" "}
                    <Text strong>
                        uniform the user interface specs for internal background projects,
                        lower the unnecessary cost of design differences and implementation
                        and liberate the resources of design and front-end development
                    </Text>
                    .
                </Paragraph>

                <Paragraph>
                    <ul>
                        <li>
                            <Link to="/course/questionnaires">Attempt questionnaire</Link>
                        </li>
                        <li>
                            <a href="/docs/resource/download">Resource Download</a>
                        </li>
                    </ul>
                </Paragraph>

                <Divider/>

                <Title>ICT1002 </Title>
                <Paragraph>Introduction to Programming</Paragraph>
                <Paragraph>
                    After massive project practice and summaries, Ant Design, a design
                    language for background applications, is refined by Ant UED Team,
                    which aims to{" "}
                    <Text strong>
                        uniform the user interface specs for internal background projects,
                        lower the unnecessary cost of design differences and implementation
                        and liberate the resources of design and front-end development
                    </Text>
                    .
                </Paragraph>

                <Paragraph>
                    <ul>
                        <Link to="/courses/questionnaires_student">
                            <li>Attempt questionnaire</li>
                        </Link>
                        <li>
                            <a href="../courses/questionnaires_student">
                                Resource Download
                            </a>
                        </li>
                    </ul>
                </Paragraph>

                <Divider/>

                <div>
                    <Card title="ICT1003" extra={<a href="#">Attempt questionnaire</a>} style={{width: 600}}>
                        <p>After massive project practice and summaries, Ant Design, a design language for background
                            applications, is refined by Ant UED Team, which aims to uniform the user interface specs for
                            internal background projects, lower the unnecessary cost of design differences and
                            implementation and liberate the resources of design and front-end development.</p>
                        <p>More content</p>
                    </Card>

                </div>

            </Typography>


        );
    }
}

export default withRouter(CourseInfo);
