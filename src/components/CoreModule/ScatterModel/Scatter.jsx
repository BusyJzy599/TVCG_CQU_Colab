/*
 * @Date: 2022-05-26 22:06:56
 * @LastEditors: JZY
 * @LastEditTime: 2022-10-03 21:44:58
 * @FilePath: /visual/src/components/CoreModule/ScatterModel/Scatter.jsx
 */
import * as d3 from "d3";
import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react';
import { Row, Col, Typography, Select, Radio, Slider, Menu, Dropdown, Button } from 'antd';
import { FilterOutlined, UnorderedListOutlined, ColumnWidthOutlined, TagOutlined, DownOutlined } from '@ant-design/icons';
import "./index.css"

// global variable
const { Option } = Select;
const { Text } = Typography;
const legend_colors = ['#65a9cf', '#faad14de', '#870a24']
const grade = ['clean', 'noise', 'high noise']
const colors = [[1, 169, 207], [250, 173, 20], [135, 10, 36]]
const epoches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export default class Scatter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //
            grade: -1,  // 筛选等级
            category: -1,   // 筛选类别
            noise_matrix: "o2u",    // 筛选噪声指标
            range: [0, 1],  // 筛选噪声指标范围
            //x,y,imgid,patchid,category,value,grade0~2 number
            hover_data: [],
            //
            selectPatches: props.patches,
            option: {

            }
        }
    }
    componentDidMount() {
        this.props.onChildEvent(this)
        this.drawChart();
    }
    // 
    selectEpoch = (value) => {
        console.log('changed', value);
    };
    selectGrade = (index, e) => {
        this.setState({ grade: parseInt(index) });
        this.drawChart();
    }
    selectCategory = (index) => {
        this.setState({ category: parseInt(index.target.value) });
        this.drawChart();
    }
    selectNoiseMatrix = (index) => {
        this.setState({ noise_matrix: index.target.value });
        this.drawChart();
    }
    selectRange = (value) => {
        this.setState({ range: value });
        this.drawChart();
    }

    drawChart = () => {
        d3.select("#scatter").selectAll('svg').remove()
        const width = document.getElementById("scatter").clientWidth
        const height = document.getElementById("scatter").clientHeight


        const margin = { top: 10, right: 8, bottom: 20, left: 30 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        var This = this     // 
        const svg = d3.select("#scatter")
            .append('svg')
            .attr("preserveAspectRatio","xMinYMin meet")
            .attr('width', "100%")
            .attr('height', "100%")
        console.log(svg)
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

        drawCricle(process.env.REACT_APP_SAMPLE_DATA);

        function drawCricle(path) {
            var sample_data = []
            d3.csv(path).then(data => {
                var grade = This.state.grade
                var category = This.state.category
                var noise_matrix = This.state.noise_matrix
                var range = This.state.range
                data.forEach((item) => {
                    var score = parseFloat(item[noise_matrix])
                    var grade_ = grade >= 0 ? parseInt(item["grade"]) == grade : 1
                    var category_ = category >= 0 ? parseInt(item["class"]) == category : 1
                    if (grade_ && category_ && score > range[0] && score < range[1]) {
                        sample_data.push([
                            parseFloat(item['scatter_x']),
                            parseFloat(item['scatter_y']),
                            parseInt(item["grade"]),
                            parseInt(item['patch_id']),
                            parseInt(item['img_id']),
                            parseFloat(item[noise_matrix]),
                            parseInt(item["class"]),
                            parseInt(item["grade_0_num"]),
                            parseInt(item["grade_1_num"]),
                            parseInt(item["grade_2_num"]),

                        ])
                    }
                })
                // 圆点
                var scatter = mainGroup.append('g').attr('class', 'scatters')
                var scatterCmbo = scatter.selectAll('g').data(sample_data).enter().append('g')
                scatterCmbo.append('circle')
                    .attr('class', 'scatter')
                    .attr('d', d3.symbol().type(d3.symbolTriangle)())
                    .attr("cx", function (d, i) { return xScale(d[0]) })
                    .attr("cy", function (d, i) { return yScale(d[1]) })
                    // 属性
                    .attr("hover_data", d => d)
                    //
                    .attr("fill", d => d3.rgb(colors[d[2]][0], colors[d[2]][1], colors[d[2]][2], d[5] + 0.1))
                    .attr('r', 2.5)
                    .attr("fill-opacity", 1)
                    .on("mouseover", function (d) {
                        d3.select(this).classed("circle-hover", true);
                        var hd = this.getAttribute('hover_data').split(",")
                        This.setState({
                            hover_data: hd,
                            option: {
                                grid: {
                                    left: '50%',
                                },
                                yAxis: {
                                    type: 'category',
                                    data: ['clean', 'noise', 'high noise']
                                },
                                xAxis: {
                                    type: "value"
                                },
                                series: [{
                                    data: [hd[7], hd[8], hd[9]],
                                    type: "bar"
                                }]
                            }
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
                        This.props.changeBarRange(this.getAttribute("hover_data").split(",")[4])
                    });
            })
        }

    }

    render() {
        return (
            <>
                <Row id="scatterRow">
                    <Col span={24} id="scatter" className="scatterChart" >
                        <Row>
                            <Col offset={18} span={4}>
                            <Dropdown
                                // open={true}
                                // onOpenChange={{}}
                                // id="scatterTipBox"
                                trigger="click"
                                placement="bottom"
                                overlay={
                                    <Menu id="scatterTip">
                                        <Row gutter={[0, 8]}>
                                            <Col span={24}>
                                                <Text className="tooltipText" type="secondary"><TagOutlined />  Epoch:</Text>
                                            </Col>
                                            <Select defaultValue="17"
                                                onChange={this.selectEpoch}
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
                                                <Text className="tooltipText" type="secondary"><UnorderedListOutlined />CC Grade</Text>
                                            </Col>
                                            {
                                                legend_colors.map((item, index) => {
                                                    return <>
                                                        <Col span={4}>
                                                            <div style={{ width: 15, height: 15, backgroundColor: item }}></div>
                                                        </Col>
                                                        <Col span={20}> <Text>{grade[index]}</Text></Col>
                                                    </>
                                                })
                                            }
                                            <Col span={24}><Text className="tooltipText" type="secondary"><FilterOutlined />CC Grade:</Text></Col>
                                            <Col span={24}>
                                                <Select defaultValue="-1"
                                                    onChange={this.selectGrade}>
                                                    <Option value="-1">All Sample</Option>
                                                    <Option value="0">Clean</Option>
                                                    <Option value="1">Nosie</Option>
                                                    <Option value="2">High Noise</Option>
                                                </Select>
                                            </Col>
                                            <Col span={24}> <Text className="tooltipText" type="secondary"><FilterOutlined />Category:</Text></Col>
                                            <Col span={24}>
                                                <Radio.Group onChange={this.selectCategory} defaultValue="-1">
                                                    <Radio.Button value="-1">All</Radio.Button>
                                                    <Radio.Button value="0">LUSC</Radio.Button>
                                                    <Radio.Button value="1">LUAD</Radio.Button>
                                                </Radio.Group>
                                            </Col>
                                            <Col span={24}><Text className="tooltipText" type="secondary"><FilterOutlined />Noise Matrix:</Text></Col>
                                            <Col span={24}>
                                                <Radio.Group onChange={this.selectNoiseMatrix} defaultValue="o2u">
                                                    <Radio.Button value="o2u">O2U</Radio.Button>
                                                    <Radio.Button value="fine">Fine</Radio.Button>
                                                </Radio.Group>
                                            </Col>
                                            <Col span={24}><Text className="tooltipText" type="secondary"><ColumnWidthOutlined />Value Range:{this.state.range[0]}~{this.state.range[1]}</Text></Col>
                                            <Col span={24}>
                                                <Slider range min={0} max={1} defaultValue={[0, 1]} step={0.01} onChange={this.selectRange} />
                                            </Col>
                                        </Row>
                                    </Menu>
                                }
                            >
                                <Button  id="scatterTipBox">
                                Scatter for Patches Tool
                                </Button>
                               
                            </Dropdown>
                            </Col>
                          
                        </Row>
                    </Col>

                    <div id="tooltipScatter" className='hidden' >
                        <Row>
                            <Col span={24}><Text className="text_style" type='secondary' >ImgId:{this.state.hover_data[4]}</Text></Col>
                            <Col span={24}><Text className="text_style" type='secondary'>PatchId:{this.state.hover_data[3]}</Text></Col>
                            <Col><Text className="text_style" type='secondary'>X:{this.state.hover_data[0]}</Text></Col>
                            <Col><Text className="text_style" type='secondary'>Y:{this.state.hover_data[1]}</Text></Col>
                            <Col><Text className="text_style" type='secondary'>Value:{this.state.hover_data[5]}</Text></Col>

                            <ReactECharts
                                option={this.state.option}
                                style={{ height: "10vh", width: "10vw" }} />
                        </Row>
                    </div>



                </Row>



            </>


        )
    }
}


