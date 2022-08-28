/*
 * @Date: 2022-07-21 11:08:42
 * @LastEditors: JZY
 * @LastEditTime: 2022-08-28 18:07:59
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

    changeDeletePatches = (p) => {
        this.setState({
            choosePatches: p
        });
    }
    componentDidMount = () => {
        this.props.onChildEvent(this);
        this.drawChart(0, 100);
    }

    drawChart = (start, end) => {

        var index = [];
        var O2u = [];
        var Fine = [];
        var Grades = [];
        d3.csv("./data/data_heatmap.csv").then(data => {
            for (let i = 1; i <= 100; i++)
                index.push(i)

            for (let i = 0; i < 100; i++) {
                var o2u = 0;
                var fine = 0;
                var grade = 0;
                for (let j = 0; j < 5000; j++) {
                    if (data[j]['img_id'] == i) {
                        o2u += parseFloat(data[j]["o2u"]);
                        fine += parseFloat(data[j]["fine"]);
                        grade += parseInt(data[j]["grade"]) + 1;
                    }

                }
                O2u.push(o2u / 100);
                Fine.push(fine / 100);
                Grades.push(grade / 300);
            }
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
                            start: start,
                            end: end
                        },
                        // {
                        //     type: 'slider',
                        //     xAxisIndex: 0,
                        //     bottom:5
                        // }
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
                            // Set `large` for large data amount
                            large: true
                        },
                        {
                            name: 'Mean Fine Score',
                            type: 'bar',
                            data: Fine,
                            // Set `large` for large data amount
                            large: true
                        },
                        {
                            name: 'Mean CC Grade',
                            type: 'bar',
                            data: Grades,
                            // Set `large` for large data amount
                            large: true
                        }

                    ]
                },
            })

        })

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

    // handleClose = (removedTag) => {
    //     const newTags = this.state.selectPatches.filter((tag) => tag !== removedTag);
    //     this.setState({
    //         selectPatches: newTags
    //     })
    //     setTimeout(() => {
    //         this.props.getSelectPatches(this.state.selectPatches);
    //     }, 0);
    // };
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
