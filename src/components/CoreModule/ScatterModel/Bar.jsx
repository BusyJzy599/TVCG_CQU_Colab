/*
 * @Date: 2022-07-21 11:08:42
 * @LastEditors: JZY
 * @LastEditTime: 2022-10-03 21:44:17
 * @FilePath: /visual/src/components/CoreModule/ScatterModel/Bar.jsx
 */
import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react';
import { message } from 'antd';
import * as d3 from "d3";



export default class Bar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            index: [],
            O2u: [],
            Fine: [],
            Grades: [],
            option: {},
            choosePatches: props.choosePatches
        }
    }
    componentDidMount = () => {
        this.props.onChildEvent(this);
        this.drawChart(0, -1);
    }

    changeDeletePatches = (p) => {
        this.setState({
            choosePatches: p
        });
    }

    changeBarRange = (id) => {

        this.drawChart(id, id);
    }
    selectBar = {
        'click': async (e) => {
            const newTags = this.state.choosePatches.filter((tag) => tag !== e.dataIndex);
            if (newTags.length < 6) {
                await newTags.push(e.dataIndex)
                await this.setState({
                    choosePatches: newTags
                })
            } else {
                await message.error('The selected image has reached the limitation!');
            }
            this.props.changeChoosePatches(newTags);
        }
    }
    drawChart = (start, end) => {

        var index = [];
        var patchNum = [];
        var O2u = [];
        var Fine = [];
        var Grades0 = [];
        var Grades1 = []
        var Grades2 = [];

        d3.csv(process.env.REACT_APP_WSI_DATA).then(data => {
            data.forEach((item) => {
                index.push(parseInt(item['img_id']))
                patchNum.push(item['patch_num'])
                Grades0.push(item['grades0'])
                Grades1.push(item['grades1'])
                Grades2.push(item['grades2'])
                O2u.push(item['o2us'])
                Fine.push(item['fines'])
            })
            if (end == -1)
                end = index.length - 1
            this.setState({
                option: {
                    title: {
                        text: 'Noise Metric for Images:',
                    },
                    legend: {
                        top: 20,
                        textStyle: {
                            fontSize: 0
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        top: 45,
                        bottom: 40,
                        left: 60,
                        right: 0
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                        },
                        {
                            type: 'slider',
                            yAxisIndex: 0,
                            left: 0,
                            startValue: start,
                            endValue: end
                        },
                    ],
                    yAxis: {
                        data: index,
                        silent: false,
                        splitLine: {
                            show: false
                        },
                        splitArea: {
                            show: false
                        }
                    },
                    xAxis: [{
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
                            name: 'Mean O2U Score',
                            type: 'bar',
                            data: O2u,
                            large: true
                        },
                        {
                            name: 'Mean Fine Score',
                            type: 'bar',
                            data: Fine,
                            large: true
                        },
                        {
                            name: 'clear rate',
                            type: 'bar',
                            stack: 'CC',
                            emphasis: {
                                focus: 'series'
                            },
                            data: Grades0
                        },
                        {
                            name: 'noise rate',
                            type: 'bar',
                            stack: 'CC',
                            emphasis: {
                                focus: 'series'
                            },
                            data: Grades1
                        },
                        {
                            name: 'high noise rate',
                            type: 'bar',
                            stack: 'CC',
                            emphasis: {
                                focus: 'series'
                            },
                            data: Grades2
                        },

                    ]
                },
            })

        })

    }


    render() {
        return (
            <>
                <ReactECharts
                    style={{ height: "70vh" }}
                    option={this.state.option}
                    onEvents={this.selectBar}
                />

            </>
        )
    }

}
