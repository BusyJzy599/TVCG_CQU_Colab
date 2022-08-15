/*
 * @Date: 2022-05-14 20:45:48
 * @LastEditors: JZY
 * @LastEditTime: 2022-07-28 18:57:58
 * @FilePath: /visual/src/components/Top/index.jsx
 */
import React, { Component } from 'react'
import { PageHeader, Typography, Row, Col, Select, Collapse, Button, Menu } from 'antd'
import './index.css'

const { Option } = Select;
const { Text, Title } = Typography;
const { Panel } = Collapse;
const classes = ['LUSC', 'LUAD'];
const info = [['Dataset:', 'NSCLC', 0], ['Noise Ratio:', '40%', 0], ['Model:', 'ResNet50', 0], ['Epoch:', 20, 1]]

export default class Top extends Component {
    constructor(props) {
        super(props);
        this.state = {
            epoch: 17,
            optionMatrix: {
                grid: {
                    // height: '40%',
                    left: '25%',
                    top: 50,
                    bottom: -20
                },
                xAxis: {
                    type: 'category',
                    data: classes,
                    position: 'top',
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'category',
                    data: classes,
                    splitArea: {
                        show: true
                    }
                },
                visualMap: {
                    min: 0,
                    max: 1,
                    calculable: true,
                    show: false,
                    inRange: {
                        color: ['#D9E9FF', "#0B69E3"]// 修改热力图的颜色 淡蓝色=>深蓝色的过度
                    },
                    orient: 'horizontal',

                },
                series: [
                    {
                        name: 'Punch Card',
                        type: 'heatmap',
                        data: [[0, 0, 0.6], [0, 1, 0.7], [1, 1, 0.16], [1, 0, 0.45]].map(function (item) {
                            return [item[1], item[0], item[2] || '-'];
                        }),
                        label: {
                            show: true
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            
        }

    }
    render() {
        return (
            <>
                <Row gutter={5}>
                    <Col span={2}>
                        <Title style={{ color: "azure" ,marginTop:5}}>TVCG</Title>
                    </Col>

                    {
                        info.map((item, index) => {
                            return <>
                                <Col span={1}></Col>
                                {item[2] == 0 ? <> <Col>
                                    <Text className='siderFont'>{item[0]}</Text>
                                </Col>
                                    <Col span={1}>
                                        <Select defaultValue={item[1]} disabled>
                                            <Option value={item[1]}>{item[1]}</Option>
                                        </Select>
                                    </Col></> : <><Col span={1}/>
                                    <Col>
                                        <Text className='siderFont'>{item[0]}</Text>
                                    </Col>
                                    <Col >
                                        <Title level={3} type="warning" style={{paddingTop:15}}>{this.state.epoch} / {item[1]}</Title>
                                    </Col>
                                </>}
                            </>
                        })
                    }
                    <Col span={1}/>

                </Row>
                {/* <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={["k"]} /> */}
                {/* <PageHeader
                    className="site-page-header"
                    title="TVCG"
                    subTitle="visual"
                />
                <Row gutter={[10, 10]}>
                    <Col span={4} />
                    <Col span={20}>
                        <Row gutter={[10, 10]}>

                            {
                                info.map((item, index) => {
                                    return item[2] == 0 ? <> <Col span={24}>
                                        <Text className='siderFont'>{item[0]}</Text>
                                    </Col>
                                        <Col span={24}>
                                            <Select defaultValue={item[1]} disabled>
                                                <Option value={item[1]}>{item[1]}</Option>
                                            </Select>
                                        </Col></> : <>
                                        <Col span={24}>
                                            <Text className='siderFont'>{item[0]}</Text>
                                        </Col>
                                        <Col span={24}>
                                            <Title level={3} type="warning">{this.state.epoch} / {item[1]}</Title>
                                        </Col>
                                    </>
                                })
                            }
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Collapse bordered={false} defaultActiveKey={[ '2']} ghost>

                            <Panel key="2" header="AUC & ACC" >
                                <ReactECharts style={{ height: 200 }} option={this.state.optionLine} />
                            </Panel>
                        </Collapse>
                    </Col>
                    <Col span={24}>
                        <Row><Col span={3} /><Col><Button type='primary'>Train Next Epoch</Button></Col></Row>
                        
                    </Col>
                </Row> */}

            </>

        )
    }
}

