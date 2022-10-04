/*
 * @Date: 2022-07-21 11:22:01
 * @LastEditors: JZY
 * @LastEditTime: 2022-10-04 11:36:00
 * @FilePath: /visual/src/components/CoreModule/SankeyModel/index.jsx
 */
import React, { Component } from 'react'
import * as d3 from "d3";
import ReactECharts from 'echarts-for-react';
import { Typography, Slider, Col, Row } from 'antd';
const { Title, Text } = Typography;

const classes = ['LUSC', 'LUAD'];


export default class SankeyModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sankeyOption: {},
            confuseMatrixOption: {},
            epochData: [],
            matrixData: [],
            marks: {},
        }
    }
    componentDidMount = async () => {
        var epochData = []
        var matrixData = []
        var marks = {};
        await d3.csv(process.env.REACT_APP_EPOCH_DATA).then(async data => {
            data.forEach((e) => {
                epochData.push([
                    parseInt(e.labeled),
                    parseInt(e.unlabeled),
                    parseInt(e.noise_in_labeled),
                    parseInt(e.infor_in_unlabled)])
                matrixData.push([
                    parseFloat(e.TP),
                    parseFloat(e.FP),
                    parseFloat(e.TN),
                    parseFloat(e.FN)])
            })
            for (var i = 0; i < process.env.REACT_APP_EPOCH_NUMBER; i++) {
                marks[i] = i + "th"
            }
            this.setState({
                epochData: epochData,
                matrixData: matrixData,
                marks: marks,
            });
        })
        setTimeout(() => {
            this.drawMatric(-1);
            this.drawSankey(-1);
        }, 0);

    }

    drawSankey = (epoch) => {
        if (epoch == -1)
            epoch = this.state.epochData.length - 1
        var nameData = [];
        var linkData = [];
        for (var i = 0; i <= epoch; i++) {
            nameData.push({ name: "Labeled_" + i });
            nameData.push({ name: "Unlabeled_" + i });
            nameData.push({ name: "Noise_" + i });
            nameData.push({ name: "Info_" + i });
        }
        for (var i = 0; i < epoch; i++) {
            linkData.push(
                { source: nameData[4 * i].name, target: nameData[4 * (i + 1)].name, value: this.state.epochData[i][0] - (this.state.epochData[i + 1][2] - this.state.epochData[i][2]) },
                { source: nameData[4 * i + 1].name, target: nameData[4 * (i + 1) + 1].name, value: this.state.epochData[i + 1][1] },
                { source: nameData[4 * i + 2].name, target: nameData[4 * (i + 1) + 2].name, value: this.state.epochData[i][2] },
                { source: nameData[4 * i + 3].name, target: nameData[4 * (i + 1) + 3].name, value: this.state.epochData[i][3] },

                { source: nameData[4 * i + 1].name, target: nameData[4 * (i + 1)].name, value: this.state.epochData[i][1] - this.state.epochData[i + 1][1] - (this.state.epochData[i + 1][3] - this.state.epochData[i][3]) },
                { source: nameData[4 * i + 1].name, target: nameData[4 * (i + 1) + 3].name, value: this.state.epochData[i + 1][3] - this.state.epochData[i][3] },

                { source: nameData[4 * i].name, target: nameData[4 * (i + 1) + 2].name, value: this.state.epochData[i + 1][2] - this.state.epochData[i][2] },
            )
        }
        this.setState({
            sankeyOption: {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                animation: false,

                series: [
                    {
                        type: 'sankey',
                        right: 0,
                        nodeGap: 10,
                        left: "1%",
                        emphasis: {
                            focus: 'adjacency'
                        },
                        data: nameData,
                        links: linkData,
                        // orient: 'vertical',
                        label: {
                            show: false,
                            position: 'left'
                        },
                        lineStyle: {
                            color: 'source',
                            curveness: 0.5
                        },
                    }
                ]
            },
        })

    }
    drawMatric = (epoch) => {
        if (epoch == -1)
            epoch = this.state.matrixData.length - 1
        this.setState({
            confuseMatrixOption: {
                grid: {
                    // height: '40%',
                    left: '32%',
                    top: '25%',
                    bottom: 10
                },
                tooltip: {},
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
                        name: 'Confusion Matrix',
                        type: 'heatmap',
                        data: [
                            [0, 0, this.state.matrixData[epoch][0].toFixed(2)],
                            [0, 1, this.state.matrixData[epoch][1].toFixed(2)],
                            [1, 1, this.state.matrixData[epoch][2].toFixed(2)],
                            [1, 0, this.state.matrixData[epoch][3].toFixed(2)]
                        ],
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
        })
    }
    seletctMatrixEpoch = (value) => {
        this.drawMatric(value);
    }
    seletctSankeyEpoch = async (value) => {
        this.drawSankey(value);
    }

    render() {
        return (
            <>
                <Row gutter={5}>
                    <Col span={19} >
                        {/* <Title level={5}>SanKey for Epoches:</Title> */}
                        <Slider
                            className='slider-sankey'
                            marks={this.state.marks}
                            min={0}
                            max={process.env.REACT_APP_EPOCH_NUMBER - 1}
                            defaultValue={process.env.REACT_APP_EPOCH_NUMBER - 1}
                            step={null}
                            onChange={this.seletctSankeyEpoch}
                        />
                        <ReactECharts
                            option={this.state.sankeyOption}
                            style={{ height: "16vh", width: "58vw" }} />
                    </Col>
                    <Col span={5} id="ConfusionChart" >
                        {
                            this.props.mapValid ? null : <>
                                <ReactECharts
                                    option={this.state.confuseMatrixOption}
                                    style={{ height: "18vh", width: "14vw" }} />
                                <Row>
                                    <Col span={1} />
                                    <Col span={6}>
                                        <Text type='secondary'>Epoch:</Text>
                                    </Col>
                                    <Col span={17}>
                                        <Slider
                                            included={false}
                                            defaultValue={process.env.REACT_APP_EPOCH_NUMBER - 1}
                                            min={0} max={process.env.REACT_APP_EPOCH_NUMBER - 1}
                                            onChange={this.seletctMatrixEpoch}
                                        /></Col>
                                </Row></>
                        }

                    </Col>
                </Row>

            </>
        )
    }
}

