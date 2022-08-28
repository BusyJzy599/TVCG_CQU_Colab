/*
 * @Date: 2022-05-14 09:45:54
 * @LastEditors: JZY
 * @LastEditTime: 2022-08-28 18:06:20
 * @FilePath: /visual/src/components/CoreModule/0Map/MapVision.jsx
 */
import React, { Component } from 'react'
import * as d3 from "d3";
import { RedoOutlined, FilterOutlined, ArrowLeftOutlined, HeatMapOutlined, AimOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Modal, Row, Col, Typography, Space, Switch, Select, Drawer, Empty, Tag, Image, Descriptions, Badge } from 'antd';
import ShowImg from './ShowImg';
const { Option } = Select;
const children = [];
for (var i = 0; i < 40; i++) {
    for (var j = 0; j < 40; j++) {
        children.push(<Option key={i.toString() + "_" + j.toString()}>{(i < 10 ? "0" + i.toString() : i.toString()) + "_" + (j < 10 ? "0" + j.toString() : j.toString())}</Option>);
    }
}
const noiseChildren = [];
for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
        noiseChildren.push(<Option key={i.toString() + "_" + j.toString()}>{(i < 10 ? "0" + i.toString() : i.toString()) + "_" + (j < 10 ? "0" + j.toString() : j.toString())}</Option>);
    }
}
// 常量设置
const { Title, Text } = Typography;

const style = {
    height: '67vh',
    width: '67vh',
    // border: '1px solid rgba(0, 0, 0, 0.5)',
}
const toolStyle = {}
//


const xScale = d3.scaleLinear()
const yScale = d3.scaleLinear()
const maxValue = 40     // 网格分割数
const lineWidth = 1     // 分割线宽度

const rows = 40
const cols = 40

const mapColors = ['#870a24', '#dd7059', '#fcd7c1', '#d5e6f1', '#65a9cf', '#134d88']
const mapLevel = ['0.90  Negative', '0.75', '0.60', '0.45', '0.25', '0.10  Postive']
const nosieColors = ['#c23531', '#91c7ae', '#1a61da']
//
var trans = { k: 1, x: 0, y: 0 }
var events = {}
var tap = 0



export default class MapVision extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            drawerVisible: false,
            confirmLoading: false,
            idx: -1,
            idy: -1,
            selectedIndex: null,
            option: {},

        };

    }
    noiseFilter = (value) => {
        var n = [parseInt(value.split('_')[0]), parseInt(value.split('_')[1])]
        this.setIndex(parseInt(value.split('_')[0]), parseInt(value.split('_')[1]))
        this.setVisible(true)
    }
    filter = (value) => {
        this.setState({
            selectedIndex: value,
        })

    }
    showDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    };

    closeDrawer = () => {
        this.setState({
            drawerVisible: false,
        });
    };

    getBack = () => {
        this.props.back();
    }
    setIndex = (x, y) => {
        this.setState({
            idx: x,
            idy: y
        })
    }
    setVisible = (args) => {
        this.setState({
            option: {
                grid: {
                    width: '70%',
                    left: 20,
                    bottom: 20,
                    containLabel: true
                },
                title: {
                    text: 'Noise Evaluation Metrics'
                },
                xAxis: {
                    type: 'category',
                    data: ['O2U', 'CC', 'Fine']
                },
                yAxis: {
                    type: 'value',
                    min: 0.0,
                    max: 1.0,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                series: [{
                    data: [0.6, 0.7, 0.45],
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                return nosieColors[params.dataIndex]
                            }
                        }
                    }

                }]
            }
        })
        setTimeout(() => {
            this.setState({
                visible: args,
            })
        }, 0);

    }
    setConfirmLoading = (args) => {
        this.setState({
            confirmLoading: args
        })
    }
    showModal = () => {
        this.setVisible(true);
    };

    handleOk = async () => {
        //   setModalText('The modal will be closed after two seconds');
        await this.setConfirmLoading(true);

        this.setVisible(false);
        this.setConfirmLoading(false);
    };

    handleCancel = () => {
        this.setVisible(false);
    };
    componentDidMount() {
        this.drawChart();
    }

    click = (d) => {
        const width = document.getElementById("map").clientWidth
        const height = document.getElementById("map").clientHeight
        // 获取当前点击的坐标
        var xIndex = parseInt((d.offsetX - trans.x) / (width / (maxValue / trans.k)))
        var yIndex = parseInt((d.offsetY - trans.y) / (height / (maxValue / trans.k)))
        console.log(xIndex, yIndex)
        this.setIndex(xIndex, yIndex)
        this.setVisible(true)
    }

    drawChart = () => {
        const width = document.getElementById("map").clientWidth
        const height = document.getElementById("map").clientHeight
        xScale.domain([0, maxValue]).range([0, width]);
        yScale.domain([0, maxValue]).range([height, 0]);
        d3.select("#map").selectAll('svg').remove()

        // 初始化zoom
        const zoom = d3.zoom()
            .scaleExtent([1, maxValue])
            .translateExtent([[0, 0], [width, height]])
            .on("zoom", zoomed);
        // 初始化画布
        const mainGroup = d3.select("#map")
            .append('svg')
            .attr("width", width)
            .attr('height', height);

        const grid = g => g
            .attr("stroke", "currentColor")
            .attr("stroke-opacity", 0.1)
            .attr("stroke-width", lineWidth)
            .call(g => g.append("g")
                .selectAll("line")
                .data(xScale.ticks(maxValue))
                .join("line")
                .attr("x1", d => xScale(d))
                .attr("x2", d => xScale(d))
                .attr("y2", height))
            .call(g => g.append("g")
                .selectAll("line")
                .data(yScale.ticks(maxValue))
                .join("line")
                .attr("y1", d => yScale(d))
                .attr("y2", d => yScale(d))
                .attr("x2", width));

        const imgs = mainGroup.selectAll("image").data([0]);
        for (var i = 0; i < 40; i++) {
            for (var j = 0; j < 40; j++) {
                imgs.enter()
                    .append("svg:image")
                    .attr("xlink:href", "./data/1/v_" + i + "_" + j + ".png")
                    .attr("x", width / maxValue * i)
                    .attr("y", height / maxValue * j)
                    .attr("width", width / maxValue - lineWidth)
                    .attr("height", height / maxValue - lineWidth)
            }
        }

        // 添加
        mainGroup.call(grid);
        mainGroup.call(zoom);
        mainGroup.on("click", this.click);


        // 恢复大小
        d3.select('#zoom_out').on('click', () => mainGroup.transition().call(zoom.transform, d3.zoomIdentity, [0, 0]));
        // 改变热力图
        d3.select('#zoom_change').on('click', toHeatMap);

        function toHeatMap() {
            if (tap == 0) {
                mainGroup.selectAll("rect").remove()
                try {
                    var margin = lineWidth / events.transform.k;
                } catch (err) {
                    var margin = lineWidth;
                }


                for (var i = 0; i < 40; i++) {
                    for (var j = 0; j < 40; j++) {

                        mainGroup.append('g')
                            .append('rect') //添加类型
                            .attr("x", width / maxValue * i + margin)
                            .attr("y", height / maxValue * j + margin)
                            .attr("width", width / maxValue - margin)
                            .attr("height", height / maxValue - margin)
                            .attr('fill', mapColors[i % 6])
                            .attr('opacity', 0.7)
                            .attr("transform", events.transform);
                    }
                }
                tap = 1;
            } else {
                mainGroup.selectAll("rect").remove()
                tap = 0
            }

        }
        function zoomed(event) {

            var margin = lineWidth / event.transform.k

            mainGroup.selectAll("line").remove()
            mainGroup.selectAll("image").remove()
            const grid = g => g
                .attr("stroke", "currentColor")
                .attr("stroke-opacity", 0.1)
                .attr("stroke-width", margin)
                .call(g => g.append("g")
                    .selectAll("line")
                    .data(xScale.ticks(maxValue))
                    .join("line")
                    .attr("x1", d => xScale(d))
                    .attr("x2", d => xScale(d))
                    .attr("y2", height).attr("transform", event.transform))
                .call(g => g.append("g")
                    .selectAll("line")
                    .data(yScale.ticks(maxValue))
                    .join("line")
                    .attr("y1", d => yScale(d))
                    .attr("y2", d => yScale(d))
                    .attr("x2", width).attr("transform", event.transform));
            const imgs = mainGroup.selectAll("image").data([0]);
            for (var i = 0; i < 40; i++) {
                for (var j = 0; j < 40; j++) {
                    imgs.enter()
                        .append("svg:image")
                        .attr("xlink:href", "./data/1/v_" + i + "_" + j + ".png")
                        .attr("x", width / maxValue * i + margin)
                        .attr("y", height / maxValue * j + margin)
                        .attr("width", width / maxValue - margin)
                        .attr("height", height / maxValue - margin)
                        .on("mouseover", function (d) {
                            d3.select(this)
                                .attr("width", width / maxValue)
                                .attr("height", height / maxValue)
                        })
                        .on("mouseout", function (d) {
                            d3.select(this).attr("width", width / maxValue - margin)
                                .attr("height", height / maxValue - margin)
                        })
                        .attr("transform", event.transform);
                }
            }
            mainGroup.selectAll("rect").remove()
            if (tap == 1) {
                for (var i = 0; i < 40; i++) {
                    for (var j = 0; j < 40; j++) {

                        mainGroup.append('g')
                            .append('rect') //添加类型
                            .attr("x", width / maxValue * i + margin)
                            .attr("y", height / maxValue * j + margin)
                            .attr("width", width / maxValue - margin)
                            .attr("height", height / maxValue - margin)
                            .attr('fill', mapColors[i % 6])
                            .attr('opacity', 0.7)
                            .attr("transform", event.transform);
                    }
                }
            }

            trans = event.transform
            events = event
            mainGroup.call(grid);

        }
        setTimeout(() => {
            this.props.load();
        }, 0);

    }

    render() {
        return (
            <>
                <Row hidden={this.props.hide} style={toolStyle}>
                    <Col span={24}>
                        <Title level={4}>
                            <Button type="text" icon={<ArrowLeftOutlined />} onClick={this.getBack}></Button>
                            &nbsp;Selected Image Show
                        </Title>
                    </Col>
                    <Col>
                        <div id='map' style={style}>

                        </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={6}>
                        <Row gutter={[0, 10]}>
                            <Col span={24}>
                                <Space>
                                    <Text type="secondary"><AimOutlined />&nbsp;Refresh:</Text>
                                    <Button id='zoom_out' type="primary" shape="round" size="small" icon={<RedoOutlined />} ghost></Button>
                                </Space>
                            </Col>
                            <Col span={24}>
                                <Space>
                                    <Text type="secondary"><HeatMapOutlined />&nbsp;HeatMap:</Text>
                                    <Switch id='zoom_change'
                                        checkedChildren="HeatMap"
                                        unCheckedChildren="Formally"
                                    />
                                </Space>
                            </Col>

                            <Col span={24}>
                                <Row>
                                    {
                                        mapColors.map((item, index) => {
                                            return <>
                                                <Col span={2}></Col>
                                                <Col span={3} >
                                                    <div style={{ width: 15, height: 15, backgroundColor: item }}></div>
                                                </Col>
                                                <Col span={19}> <Text>{mapLevel[index]}</Text></Col>
                                            </>
                                        })
                                    }
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Text type="secondary"><MenuOutlined />&nbsp;Noise Sample List:</Text>
                            </Col>
                            <Col span={24} id='noiseSample'>
                                <Select
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Check Noise"
                                    onChange={this.noiseFilter}
                                >
                                    {noiseChildren}
                                </Select>
                            </Col>
                            <Col span={24}>
                                <Text type="secondary"><FilterOutlined />&nbsp;Filter:</Text>
                            </Col>
                            <Col span={24}>
                                <Select
                                    // mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Select Patch"
                                    onChange={this.filter}
                                >
                                    {children}
                                </Select>
                            </Col>
                            <Col span={24}>
                                <Button type="primary" block ghost onClick={this.showDrawer}>Rectify</Button>
                            </Col>

                        </Row>

                    </Col>
                </Row>

                <Modal
                    title={"Check: [" + this.state.idx + "," + this.state.idy + "]"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <ShowImg idx={this.state.idx} idy={this.state.idy} option={this.state.option} />

                </Modal>
                <Drawer
                    title="Rectify the Selected Patches"
                    placement='right'
                    width="30vw"
                    onClose={this.closeDrawer}
                    visible={this.state.drawerVisible}
                >

                    {
                        this.state.selectedIndex == null ? <Empty description="No Selected Path" />
                            : <Row>
                                <Col span={1} />
                                <Col>
                                    <Descriptions layout="vertical" size='large' column={4} bordered>
                                        <Descriptions.Item label="Image(256*256)" span={2}> <Image
                                            width="20vh"
                                            src={"./data/1/v_" + (this.state.selectedIndex) + ".png"} /></Descriptions.Item>
                                        <Descriptions.Item label="Grad-Cam" span={2}> <Image
                                            width="20vh"
                                            src={"./data/1/v_" + (this.state.selectedIndex) + ".png"} /></Descriptions.Item>
                                        <Descriptions.Item span={2} label="Index">{this.state.selectedIndex}</Descriptions.Item>
                                        <Descriptions.Item span={2} label="Class">
                                            <Select
                                                style={{ width: '100%' }}
                                                placeholder="select one class"
                                                defaultValue='LUSC'
                                                optionLabelProp="label"
                                            >
                                                <Option value="LUSC" label="LUSC">
                                                    <div className="demo-option-label-item">
                                                        <Tag color="green"> LUSC</Tag>

                                                    </div>
                                                </Option>
                                                <Option value="LUAD" label="LUAD">
                                                    <div className="demo-option-label-item">
                                                        <Tag color="cyan"> LUAD</Tag>

                                                    </div>
                                                </Option>
                                            </Select>
                                        </Descriptions.Item>
                                        <Descriptions.Item span={4} label="Noise Scores">
                                            {
                                                nosieColors.map((item, index) => {
                                                    return <Tag color={item}>O2U: 0.6</Tag>
                                                })
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item span={4} label="Option">
                                            <Button type="primary" block ghost onClick={this.closeDrawer}>Save & Submit</Button>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>
                    }
                </Drawer>

            </>

        )
    }
}

