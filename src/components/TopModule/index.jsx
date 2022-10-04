/*
 * @Date: 2022-05-14 20:45:48
 * @LastEditors: JZY
 * @LastEditTime: 2022-10-03 22:06:06
 * @FilePath: /visual/src/components/TopModule/index.jsx
 */
import React, { Component } from 'react'
import { Typography, Row, Col, Select, Collapse ,Progress} from 'antd'
import './index.css'

const { Option } = Select;
const { Text, Title } = Typography;
const classes = ['LUSC', 'LUAD'];
const info = [['Dataset:', 'NSCLC', 0], ['Noise Ratio:', '40%', 0], ['Model:', 'ResNet50', 0], ['Epoch:', 20, 1]]

export default class TopModule extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <Row gutter={5}>
                    <Col span={2}>
                        <Title>XXX</Title>
                    </Col>

                    {
                        info.map((item, index) => {
                            return <>
                                <Col span={1}></Col>
                                {item[2] === 0 ? <> <Col>
                                    <Text className='siderFont'>{item[0]}</Text>
                                </Col>
                                    <Col span={1}>
                                        <Select defaultValue={item[1]} disabled>
                                            <Option value={item[1]}>{item[1]}</Option>
                                        </Select>
                                    </Col></> : <><Col span={1} />
                                    <Col>
                                        <Text className='siderFont'>{item[0]}</Text>
                                    </Col>
                                    <Col >
                                        <Progress
                                            type="circle"
                                            width="5.5vh"
                                            strokeColor={{
                                                '0%': '#108ee9',
                                                '100%': '#87d068',
                                            }}
                                            percent={(100*process.env.REACT_APP_EPOCH_NUMBER)/20}/>
                                    </Col>
                                </>}
                            </>
                        })
                    }
                    <Col span={1} />

                </Row>
            </>

        )
    }
}

