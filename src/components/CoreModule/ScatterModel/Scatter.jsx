/*
 * @Date: 2022-05-26 22:06:56
 * @LastEditors: JZY
 * @LastEditTime: 2022-08-28 17:10:01
 * @FilePath: /visual/src/components/CoreModule/ScatterModel/Scatter.jsx
 */
import React, { Component } from 'react'
import * as d3 from "d3";
import ReactECharts from 'echarts-for-react';
import { Row, Col, Typography, Select, Radio, Slider } from 'antd';
import { FilterOutlined, UnorderedListOutlined, ColumnWidthOutlined, TagOutlined } from '@ant-design/icons';


const { Option } = Select;
const { Text } = Typography;
const legend_colors = ['#65a9cf', '#faad14de', '#870a24']
const colors = [[1, 169, 207], [250, 173, 20], [135, 10, 36]]
const grade = ['clean', 'noise', 'highly noise']
const epoches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
export default class Scatter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grade: -1,
            range: [0, 1],
            selectPatches: props.patches,
            X: -1,
            Y: -1,
            ImgId: -1,
            PatchId: -1,
            option: {
                grid: {
                    left: '40%',
                },
                yAxis: {
                    type: 'category',
                    data: ['Clean', 'Noise', 'H-Noise']
                },
                xAxis: {
                    type: "value"
                },
                series: [{
                    data: [3, 10, 4],
                    type: "bar"
                }]
            }
        }
    }

    onChangeEpoch = (value) => {
        console.log('changed', value);
    };
    changeScatter = () => {
        this.drawChart();
    }
    selectGrade = (index, e) => {
        if (index === this.state.grade)
            this.setState({ grade: -1 });
        else
            this.setState({ grade: index });
        this.drawChart();

    }
    selectRange = (value) => {

        this.setState({ range: value });
        this.drawChart();
    }
    componentDidMount() {
        this.props.onChildEvent(this)
        this.drawChart();
    }
    drawChart = () => {

        const width = document.getElementById(this.props.id).clientWidth
        const height = document.getElementById(this.props.id).clientHeight
        const margin = { top: 10, right: 8, bottom: 20, left: 30 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;


        d3.select("#" + this.props.id).selectAll('svg').remove()

        const svg = d3.select("#" + this.props.id)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
        const xScale = d3.scaleLinear()
        const yScale = d3.scaleLinear()
        xScale.domain([0, 1]).range([0, innerWidth]);
        yScale.domain([0, 1]).range([innerHeight, 0]);
        const yAxis = d3.axisLeft(yScale)
        const xAxis = d3.axisBottom(xScale)
        const mainGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

        mainGroup.append('g')
            .attr('id', 'xAxisGroup')
            .call(xAxis)
            .attr('transform', `translate(0, ${innerHeight})`);
        mainGroup.append('g')
            .attr('id', 'yAxisGroup')
            .call(yAxis);

        mainGroup.append("text")
            .attr("x", 3)
            .attr("y", 4)
            .style('font-family', 'Arial')
            .style('font-size', '18px')
            .text("Scatter for Patches:")
        if (this.props.id == "scatterLUSC")
            var path = "./data/data_heatmap.csv"
        else {
            var path = ""
        }
        var test_data = []
        var This = this
        drawCricle(path);

        function drawCricle(path, transform, k) {
            if (k == null)
                k = 1;
            if (transform == null)
                transform = ""
            d3.csv(path).then(data => {
                var r = This.state.range
                data.forEach((item) => {
                    var v = parseFloat(item['value'])
                    if (v >= r[0] && v <= r[1]) {
                        test_data.push([
                            parseFloat(item['x']),
                            parseFloat(item['y']),
                            parseInt(item['grade']),
                            parseInt(item['patch_id']),
                            parseInt(item['img_id']),
                            parseFloat(item['value'])

                        ])
                    }
                })
                // 圆点
                var scatter = mainGroup.append('g').attr('class', 'scatters')
                var scatterCmbo = scatter.selectAll('g').data(test_data).enter().append('g')
                var T = This
                var patch_id = This.props.patchId
                var img_id = This.props.imgId
                var p = This.props.selectedPatch
                var g = This.state.grade
                if (patch_id != -1 && img_id != -1)
                    var focus = 1
                else
                    var focus = 0
                if (g != -1) {
                    scatterCmbo.append('circle')
                        .attr('class', 'scatter')
                        .attr('d', d3.symbol().type(d3.symbolTriangle)())
                        .attr("cx", function (d, i) { return xScale(d[0]) })
                        .attr("cy", function (d, i) { return yScale(d[1]) })
                        //
                        .attr("xx", d => d[0])
                        .attr("yy", d => d[1])
                        .attr("patch_id", d => d[3])
                        .attr("img_id", d => d[4])
                        //
                        // .attr("fill", d => colors[d[2]])
                        .attr("fill", d => d3.rgb(colors[d[2]][0], colors[d[2]][1], colors[d[2]][2], d[5] + 0.1))
                        .attr('r', 2.5)
                        .attr("fill-opacity", function (d, i) {
                            if (g == d[2])
                                return "1"
                            else
                                return "0.1"
                        })
                        .on("mouseover", function (d) {
                            d3.select(this).classed("circle-hover", true);
                            T.setState({
                                X: this.getAttribute('xx'),
                                Y: this.getAttribute('yy'),
                                ImgId: this.getAttribute('img_id'),
                                PatchId: this.getAttribute('patch_id')
                            })
                            d3.select("#tooltipScatter")
                                .style("left", d.layerX + 10 + "px")
                                .style("top", d.layerY - 50 + "px")
                            d3.select("#tooltipScatter").classed("hidden", false);
                        })
                        .on("mouseout", function () {
                            d3.select(this).classed("circle-hover", false);
                            d3.select("#tooltipScatter").classed("hidden", true);
                        })
                        .on("click", function (d) {
                            T.props.changeBarRange(this.getAttribute("img_id"))
                        })
                        .attr("transform", transform);
                } else {
                    scatterCmbo.append('circle')
                        .attr('class', 'scatter')
                        .attr('d', d3.symbol().type(d3.symbolTriangle)())
                        .attr("cx", function (d, i) { return xScale(d[0]) })
                        .attr("cy", function (d, i) { return yScale(d[1]) })
                        //
                        .attr("xx", d => d[0])
                        .attr("yy", d => d[1])
                        .attr("patch_id", d => d[3])
                        .attr("img_id", d => d[4])
                        //
                        // .attr("fill", d => colors[d[2]])
                        .attr("fill", d => d3.rgb(colors[d[2]][0], colors[d[2]][1], colors[d[2]][2], d[5] + 0.1))
                        .attr('r', function (d, i) {
                            if (p != -1) {
                                if (p == d[3])
                                    return 3.5 / k
                                else
                                    return 2.5 / k
                            }
                            // else {
                            //     if ((d[3] == patch_id && d[4] == img_id))
                            //         return 3
                            //     else
                            //         return 2
                            // }

                        })
                        .attr("fill-opacity", function (d, i) {
                            if (p != -1) {
                                if (p == d[3])
                                    return "0.1"
                                else
                                    return "1"
                            }
                            // else {
                            //     if (focus) {
                            //         if ((d[3] == patch_id && d[4] == img_id))
                            //             return "1"
                            //         else
                            //             return "0.1"
                            //     } else
                            //         return "0.6"
                            // }
                        })
                        .on("mouseover", function (d) {
                            d3.select(this).classed("circle-hover", true);
                            T.setState({
                                X: this.getAttribute('xx'),
                                Y: this.getAttribute('yy'),
                                ImgId: this.getAttribute('img_id'),
                                PatchId: this.getAttribute('patch_id')
                            })
                            d3.select("#tooltipScatter")
                                .style("left", d.layerX + 10 + "px")
                                .style("top", d.layerY - 50 + "px")
                            d3.select("#tooltipScatter").classed("hidden", false);
                        })
                        .on("mouseout", function () {
                            d3.select(this).classed("circle-hover", false);
                            d3.select("#tooltipScatter").classed("hidden", true);
                        })
                        .on("click", function (d) {
                            T.props.changeBarRange(this.getAttribute("img_id"))
                        })
                        .attr("transform", transform);
                }
            })
        }

    }

    render() {
        return (
            <>
                <Col span={18}>
                    <div id="tooltipScatter" className='hidden' >
                        <Row>
                            <Col span={24}><Text type='secondary'>ImgId:&nbsp;{this.state.ImgId}</Text></Col>
                            <Col span={24}><Text type='secondary'>PatchId:&nbsp;{this.state.PatchId}</Text></Col>
                            <Col><Text type='secondary'>X:&nbsp;{this.state.X}</Text></Col>
                            <Col><Text type='secondary'>Y:&nbsp;{this.state.Y}</Text></Col>

                            <ReactECharts
                                option={this.state.option}
                                style={{ height: "10vh", width: "10vw" }} />
                        </Row>
                    </div>
                    <div id="scatterTip" style={{ left: "41.5vw" }}>
                        <Row gutter={[0, 10]}>
                            <Col span={24}>
                                <Text type="secondary"><TagOutlined />&nbsp;Epoch:&nbsp;</Text>
                            </Col>
                            <Select defaultValue="17"
                                onChange={this.onChangeEpoch}
                                style={{
                                    width: 100,
                                }}>
                                {
                                    epoches.map((item, index) => {
                                        return <Option value={item}>{item}</Option>
                                    })
                                }

                            </Select>

                            <Col span={24}>
                                <Text type="secondary"><UnorderedListOutlined />&nbsp;CC Grade:&nbsp;</Text>
                            </Col>

                            {
                                legend_colors.map((item, index) => {
                                    return <>
                                        <Col span={4}>
                                            <div style={{ width: 15, height: 15, backgroundColor: item }}
                                            //  onClick={this.selectGrade.bind(this, index)}
                                            ></div>
                                        </Col>
                                        <Col span={20}> <Text>{grade[index]}</Text></Col>
                                    </>
                                })
                            }
                            <Text type="secondary"><FilterOutlined />&nbsp;CC Grade:&nbsp;</Text>
                            <Col span={24}>
                                <Select defaultValue="-1"
                                    onChange={this.selectGrade}>
                                    <Option value="-1">All Sample</Option>
                                    <Option value="0">Clean</Option>
                                    <Option value="1">Nosie</Option>
                                    <Option value="2">Highly Noise</Option>

                                </Select>
                            </Col>
                            <Text type="secondary"><FilterOutlined />&nbsp;Category:&nbsp;</Text>
                            <Col span={24}>
                                <Radio.Group onChange={{}} defaultValue="All">
                                    <Radio.Button value="All">All</Radio.Button>
                                    <Radio.Button value="LUSC">LUSC</Radio.Button>
                                    <Radio.Button value="LUAD">LUAD</Radio.Button>
                                </Radio.Group>
                            </Col>
                            <Text type="secondary"><FilterOutlined />&nbsp;Noise Matrix:&nbsp;</Text>
                            <Col span={24}>
                                <Radio.Group onChange={{}} defaultValue="Fine">
                                    <Radio.Button value="O2U">O2U</Radio.Button>
                                    <Radio.Button value="Fine">Fine</Radio.Button>
                                </Radio.Group>
                            </Col>
                            <Text type="secondary"><ColumnWidthOutlined />&nbsp;Value Range:&nbsp;{this.state.range[0]}~{this.state.range[1]}</Text>
                            <Col span={24}>
                                <Slider range min={0} max={1} defaultValue={[0, 1]} step={0.01} onChange={this.selectRange} />
                            </Col>
                        </Row>
                    </div>
                    <div id={this.props.id}  className="scatterChart" >
                    </div>
                </Col>


            </>


        )
    }
}



