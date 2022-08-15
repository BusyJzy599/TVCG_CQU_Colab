/*
 * @Date: 2022-07-21 11:22:01
 * @LastEditors: JZY
 * @LastEditTime: 2022-07-28 16:47:44
 * @FilePath: /visual/src/components/CoreModule/SankeyModel/index.jsx
 */
import React, { Component } from 'react'
import * as d3 from "d3";
import ReactECharts from 'echarts-for-react';
import { Typography, Slider, Col, Row } from 'antd';
const { Title, Text } = Typography;

const data = [
    { epoch: 0, TP: 0.1234, TN: 0.1234, FP: 0.1123, FN: 0.1123 },
    { epoch: 1, TP: 0.2345, TN: 0.2145, FP: 0.2231, FN: 0.2444 },
    { epoch: 2, TP: 0.2342, TN: 0.3666, FP: 0.2123, FN: 0.4222 },
    { epoch: 3, TP: 0.3341, TN: 0.4444, FP: 0.3556, FN: 0.3244 },
    { epoch: 4, TP: 0.4231, TN: 0.5123, FP: 0.4123, FN: 0.4124 },
    { epoch: 5, TP: 0.5519, TN: 0.5526, FP: 0.5124, FN: 0.6211 },
    { epoch: 6, TP: 0.6124, TN: 0.8123, FP: 0.5789, FN: 0.7111 },

]
const classes = ['LUSC', 'LUAD'];
export default class SankeyModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                animation: false,
                series: [
                    {
                        type: 'sankey',
                        bottom: 5,
                        top: 0,
                        right: 0,
                        nodeGap: 15,
                        emphasis: {
                            focus: 'adjacency'
                        },
                        data: [
                            { name: "All Samples" }, //4000
                            { name: 'LS_0' }, //1000
                            { name: 'ULS_0' }, //3000
                            { name: 'LS_1' },
                            { name: 'ULS_1' },
                            { name: 'NS_1' },
                            { name: 'LS_2' },
                            { name: 'ULS_2' },
                            { name: 'NS_2' },
                            { name: 'LS_3' },
                            { name: 'ULS_3' },
                            { name: 'NS_3' },
                            { name: 'LS_4' },
                            { name: 'ULS_4' },
                            { name: 'NS_4' },
                            { name: 'LS_5' },
                            { name: 'ULS_5' },
                            { name: 'NS_5' },

                        ],
                        links: [
                            { source: 'All Samples', target: 'LS_0', value: 1000 },
                            { source: 'All Samples', target: 'ULS_0', value: 3000 },

                            { source: 'LS_0', target: 'LS_1', value: 1000 },
                            { source: 'LS_0', target: 'NS_1', value: 50 },
                            { source: 'ULS_0', target: 'LS_1', value: 100 },
                            { source: 'ULS_0', target: 'ULS_1', value: 2900 },
                            { source: 'ULS_0', target: 'NS_1', value: 50 },

                            { source: 'LS_1', target: 'LS_2', value: 1100 },
                            { source: 'LS_1', target: 'NS_2', value: 50 },
                            { source: 'ULS_1', target: 'LS_2', value: 100 },
                            { source: 'ULS_1', target: 'ULS_2', value: 2800 },
                            { source: 'ULS_1', target: 'NS_2', value: 50 },
                            { source: 'NS_1', target: 'NS_2', value: 100 },

                            { source: 'LS_2', target: 'LS_3', value: 1200 },
                            { source: 'LS_2', target: 'NS_3', value: 50 },
                            { source: 'ULS_2', target: 'LS_3', value: 200 },
                            { source: 'ULS_2', target: 'ULS_3', value: 2600 },
                            { source: 'ULS_2', target: 'NS_3', value: 50 },
                            { source: 'NS_2', target: 'NS_3', value: 200 },

                            { source: 'LS_3', target: 'LS_4', value: 1400 },
                            { source: 'LS_3', target: 'NS_4', value: 50 },
                            { source: 'ULS_3', target: 'LS_4', value: 200 },
                            { source: 'ULS_3', target: 'ULS_4', value: 2400 },
                            { source: 'ULS_3', target: 'NS_4', value: 50 },
                            { source: 'NS_3', target: 'NS_4', value: 300 },

                            { source: 'LS_4', target: 'LS_5', value: 1200 },
                            { source: 'LS_4', target: 'NS_5', value: 50 },
                            { source: 'ULS_4', target: 'LS_5', value: 200 },
                            { source: 'ULS_4', target: 'ULS_5', value: 2200 },
                            { source: 'ULS_4', target: 'NS_5', value: 50 },
                            { source: 'NS_4', target: 'NS_5', value: 400 },

                        ],
                        // orient: 'vertical',
                        label: {
                            position: 'left'
                        },
                        lineStyle: {
                            color: 'source',
                            curveness: 0.5
                        },
                    }
                ]
            },
            confuseMatrixOption: {}

        }
    }
    componentDidMount() {
        this.drawMatric(17);
        console.log([[0, 0, 0.6], [0, 1, 0.7], [1, 1, 0.16], [1, 0, 0.45]].map(function (item) {
            return [item[1], item[0], item[2] || '-'];
        }))
    }
    drawMatric = (epoch) => {
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
                            [0, 0, (0.02 * epoch).toFixed(2)],
                            [0, 1, (0.03 * epoch).toFixed(2)],
                            [1, 1, (0.05 * epoch).toFixed(2)],
                            [1, 0, (0.04 * epoch).toFixed(2)]
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
    selectEpoch = (value) => {
        this.drawMatric(value);
    }
    drawChart = () => {
        const width = document.getElementById("confuseMatrix").clientWidth
        const height = document.getElementById("confuseMatrix").clientHeight
        const margin = { top: 2, right: 0, bottom: 20, left: 0 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        d3.select("#confuseMatrix").selectAll('svg').remove()
        const keys = ['TP', 'TN', 'FP', 'FN']
        const fillColor = ['#bdd8f1', "#679b6c70", "#f17d638c", "#4ac7d06e"]
        const strokeColor = ['#388ad6', "#679b6c", "#f17d63", "#4ac7d0"]

        // 初始化画布
        const mainGroup = d3.select("#confuseMatrix")
            .append('svg')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .attr("width", width)
            .attr('height', height);

        keys.forEach((k, v) => {
            var xScale = d3.scaleLinear();
            var yScale = d3.scaleLinear();
            switch (v) {
                case 0:
                    var x = 1, y = 1, z1 = 0, z2 = 0;
                    break;
                case 1:
                    var x = 2, y = 1, z1 = 10, z2 = 0;
                    break;
                case 2:
                    var x = 1, y = 2, z1 = 0, z2 = 10;
                    break;
                case 3:
                    var x = 2, y = 2, z1 = 10, z2 = 10;
                    break;
            }
            xScale.domain(d3.extent(data.map(d => d.epoch))).range([0, innerWidth / 3]).nice();
            yScale.domain(d3.extent(data.map(d => d[k]))).range([innerHeight / 3, 0]).nice();
            var xAxis = d3.axisBottom(xScale).ticks(0);
            var yAxis = d3.axisLeft(yScale).ticks(0);
            mainGroup.append('g').call(xAxis).attr('transform', `translate(${(x - 1) * innerWidth / 3 + z1}, ${y * innerHeight / 3 + z2})`);
            mainGroup.append('g').call(yAxis).attr('transform', `translate(${x * innerWidth / 3 + z1},${(y - 1) * innerHeight / 3 + z2})`);
            var area = d3.area()
                .x(d => xScale(d.epoch))
                .y0(innerHeight / 3)
                .y1(d => yScale(d[k]))
            // .curve(d3.curveMonotoneX);

            mainGroup.append('path')
                .datum(data)
                .attr('fill', fillColor[v])
                .attr('d', area)
                .on("mouseover", function (d) {
                    var str = k + " Value :\t"
                    data.forEach((key, value) => {
                        str = str + "Epoch" + value + ": " + key[k] + "\t"

                    })
                    d3.select("#tooltip1")
                        .style("left", d.layerX + 10 + "px")
                        .style("top", d.layerY - 50 + "px")
                        .select("#value")
                        .text(str) //Show the tooltip
                    d3.select("#tooltip1").classed("hidden", false);
                })
                .on("mouseout", function () {
                    d3.select("#tooltip1").classed("hidden", true);
                })
                .attr('stroke', strokeColor[v])
                .attr('stroke-width', 2)
                .attr('transform', `translate(${(x - 1) * innerWidth / 3 + z1}, ${(y - 1) * innerHeight / 3 + z2})`);
        })
        mainGroup.append("text")
            .text("LUAD")
            .attr('text-anchor', 'end') //文本末尾对其
            .attr('dy', '15rem') //沿y轴向右平移
            .attr('x', -20)
            .style('font-family', 'Arial')
            .attr('transform', 'rotate(-90)');//逆时针旋转90度;
        mainGroup.append("text")
            .text("LUSC")
            .attr('text-anchor', 'end') //文本末尾对其
            .attr('dy', '15rem') //沿y轴向右平移
            .attr('x', -80)
            .style('font-family', 'Arial')
            .attr('transform', 'rotate(-90)');//逆时针旋转90度;
        mainGroup.append('text')
            .attr("x", 10)
            .attr("y", 120)
            .style('font-family', 'Arial')
            .text("LUSC")
        mainGroup.append('text')
            .attr("x", 80)
            .attr("y", 120)
            .style('font-family', 'Arial')
            .text("LUSC")

    }
    render() {
        return (
            <>
                <Row gutter={5}>
                    <Col span={19} >
                        <Title level={5}>SanKey for Epoches:</Title>
                        <ReactECharts option={this.state.option} style={{ height: "16vh", width: "57vw" }} />
                    </Col>
                    <Col span={5} id="ConfusionChart" style={{ borderLeft: '3px solid rgba(240, 242, 245)' }} >
                        <ReactECharts option={this.state.confuseMatrixOption} style={{ height: "18vh", width: "14vw" }} />
                        <Row>
                            <Col span={1} />
                            <Col span={6}>
                                <Text type='secondary'>Epoch:</Text>
                            </Col>
                            <Col span={17}><Slider
                                included={false}
                                defaultValue={17}
                                min={0} max={17}
                                onChange={this.selectEpoch}
                            /></Col>
                        </Row>

                        {/* <div style={{height:40 }}></div>
                        <div id="confuseMatrix" style={{ height: "18vh" }}>

                        </div>
                        <div id="tooltip1" className='hidden' >
                            <p><span id="value" /></p>
                        </div> */}
                    </Col>
                </Row>

            </>
        )
    }
}

