/*
 * @Date: 2022-05-26 22:06:56
 * @LastEditors: JZY
 * @LastEditTime: 2022-07-26 10:46:03
 * @FilePath: /visual/src/components/CoreModule/Scatter/Scatter.jsx
 */
import React, { Component } from 'react'
import * as d3 from "d3";
import { Row, Col, Typography, Select, Slider } from 'antd';
import { FilterOutlined, UnorderedListOutlined, ColumnWidthOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text, Title } = Typography;
const colors = ['#65a9cf', '#fcd7c1', '#870a24']
const grade = ['clean', 'noise', 'highly noise']
export default class Scatter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grade: -1,
            range: [0, 1]
        }
    }
    changeScatter = () => {
        this.drawChart();
    }
    selectGrade = (index, e) => {
        if (index == this.state.grade)
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
        const margin = { top: 10, right: 20, bottom: 20, left: 30 };
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
        if (this.props.id == "scatterLUSC")
            var path = "./data/data_heatmap.csv"
        else {
            var path = ""
        }
        var test_data = []
        d3.csv(path).then(data => {
            var r = this.state.range
            // data.forEach((item) => {
            //     var v=parseFloat(item['value'])
            //     if (v>=r[0]&&v<=r[1]) {
            //         test_data.push([
            //             parseFloat(item['x']),
            //             parseFloat(item['y']),
            //             parseInt(item['grade']),
            //             parseInt(item['patch_id']),
            //             parseInt(item['img_id']),

            //         ])
            //     }


            // })
            // 圆点
            var scatter = mainGroup.append('g').attr('class', 'scatters')
            var scatterCmbo = scatter.selectAll('g').data(test_data).enter().append('g')
            var patch_id = this.props.patchId
            var img_id = this.props.imgId
            var p = this.props.selectedPatch
            var g = this.state.grade
            if (patch_id != -1 && img_id != -1)
                var focus = 1
            else
                var focus = 0
            if (g != -1) {
                scatterCmbo.append('circle')
                    .attr('class', 'scatter')
                    // .attr('d', d3.symbol().type(d3.symbolCircle)())
                    .attr('d', d3.symbol().type(d3.symbolSquare)())
                    .attr("cx", function (d, i) { return xScale(d[0]) })
                    .attr("cy", function (d, i) { return yScale(d[1]) })
                    .attr("fill", d => colors[d[2]])
                    .attr('r', 2)
                    .attr("fill-opacity", function (d, i) {
                        if (g == d[2])
                            return "1"
                        else
                            return "0.1"
                    });
            } else {
                scatterCmbo.append('circle')
                    .attr('class', 'scatter')
                    .attr('d', d3.symbol().type(d3.symbolSquare)())
                    .attr("cx", function (d, i) { return xScale(d[0]) })
                    .attr("cy", function (d, i) { return yScale(d[1]) })
                    .attr("fill", d => colors[d[2]])
                    .attr('r', function (d, i) {
                        if (p != -1) {
                            if (p == d[3])
                                return 3
                            else
                                return 2
                        } else {
                            if ((d[3] == patch_id && d[4] == img_id))
                                return 3
                            else
                                return 2
                        }

                    })
                    .attr("fill-opacity", function (d, i) {
                        if (p != -1) {
                            if (p == d[3])
                                return "1"
                            else
                                return "0.1"
                        } else {
                            if (focus) {
                                if ((d[3] == patch_id && d[4] == img_id))
                                    return "1"
                                else
                                    return "0.1"
                            } else
                                return "0.6"
                        }
                    });

            }
        })

    }



    render() {
        return (
            <>
                <Col span={18}>
                    <div id={this.props.id} style={{ height: "50vh" }}>

                    </div>
                </Col>
                <Col span={6}>
                    <Row gutter={[0, 10]}>
                        <Col span={24}>
                            <Text type="secondary"><UnorderedListOutlined />&nbsp;CC Grade:&nbsp;</Text>
                        </Col>

                        {
                            colors.map((item, index) => {
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
                        <Text type="secondary"><FilterOutlined />&nbsp;Filter:&nbsp;</Text>
                        <Col span={24}>

                            <Select defaultValue="-1"
                                onChange={this.selectGrade}
                                style={{
                                    width: 120,
                                }}>
                                <Option value="-1">All Sample</Option>
                                <Option value="0">Clean</Option>
                                <Option value="1">Nosie</Option>
                                <Option value="2">Highly Noise</Option>

                            </Select>

                        </Col>
                        <Text type="secondary"><ColumnWidthOutlined />&nbsp;Value Range:&nbsp;{this.state.range[0]}~{this.state.range[1]}</Text>
                        <Col span={24}>
                            <Slider range min={0} max={1} defaultValue={[0, 1]} step={0.01} onChange={this.selectRange} />
                        </Col>
                    </Row>
                </Col>

            </>


        )
    }
}

