/*
 * @Date: 2022-06-30 16:24:20
 * @LastEditors: JZY
 * @LastEditTime: 2022-06-30 22:05:24
 * @FilePath: /visual/src/components/CoreModule/Map/BarVision.jsx
 */
import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react';
import { Tag, Row, Col, Empty, List, Typography } from 'antd';

function generateData(count) {
    const index = [];
    const data1 = [];
    const data2 = [];
    const data3 = [];
    for (let i = 0; i < count; i++) {
        index.push(i);
        data1.push(Math.random());
        data2.push(Math.random());
        data3.push(((parseInt(Math.random() * 10)) % 3 + 1) * 0.25)
    }
    return {
        index: index,
        data1: data1,
        data2: data2,
        data3: data3
    };
}
//
const dataCount = 100;
const data = generateData(dataCount);

export default class BarVision extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {
                title: {
                    text: 'Noise Metric for Patches:',
                    left: 10
                },
                legend: {},
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    bottom: 90
                },
                dataZoom: [
                    {
                        type: 'inside',
                    },
                    {
                        type: 'slider',
                        yAxisIndex: 0,
                        left: 20
                    },
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                    }
                ],
                xAxis: {
                    data: data.index,
                    silent: false,
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    }
                },
                yAxis: [{
                    position: 'left',
                    type: 'value',
                    min: 0,
                    max: 1,
                    splitArea: {
                        show: false
                    },
                },
                ]
                ,
                series: [
                    {
                        name: 'O2U Score',
                        type: 'bar',
                        data: data.data1,
                        // Set `large` for large data amount
                        large: true
                    },
                    {
                        name: 'Fine Score',
                        type: 'bar',
                        data: data.data2,
                        // Set `large` for large data amount
                        large: true
                    },
                    {
                        name: 'CC Grade',
                        type: 'bar',
                        data: data.data3,
                        // Set `large` for large data amount
                        large: true
                    }

                ]
            },
            selectPatches: props.patches
        }
    }
    selectBar = {
        'click': (e) => {
            const newTags = this.state.selectPatches.filter((tag) => tag !== e.dataIndex);
            if (newTags.length < 9) {
                newTags.push(e.dataIndex)
                this.setState({
                    selectPatches: newTags
                })
            }
            setTimeout(() => {
                this.props.getSelectPatches(this.state.selectPatches);
            }, 0);
        }
    }
    handleClose = (removedTag) => {
        const newTags = this.state.selectPatches.filter((tag) => tag !== removedTag);
        this.setState({
            selectPatches: newTags
        })
        setTimeout(() => {
            this.props.getSelectPatches(this.state.selectPatches);
        }, 0);
    };
    render() {
        return (
            <>
                <Row gutter={[5, 10]}>
                    <ReactECharts option={this.state.option} onEvents={this.selectBar} style={{ height: "50vh", width: "65vw" }} />
                    <List
                        bordered
                        dataSource={[0]}
                        renderItem={(item) => (
                            <List.Item>
                                <Row style={{ width: "58vw" }}>
                                    <Col span={4}>
                                        <Typography.Text>
                                            Choose Patches:
                                        </Typography.Text>
                                    </Col>
                                    <Col span={20}>
                                        {
                                            this.state.selectPatches.length == 0 ? <Typography.Text type="secondary">Please Choose 9 Patches...</Typography.Text> :
                                                this.state.selectPatches.map((item, index) => {
                                                    return <>
                                                        <Tag closable key={item}
                                                            onClose={() => this.handleClose(item)}
                                                        >
                                                            {item}
                                                        </Tag>
                                                    </>
                                                })
                                        }

                                    </Col>
                                </Row>


                            </List.Item>
                        )}
                    />
                </Row>

            </>
        )
    }
}

