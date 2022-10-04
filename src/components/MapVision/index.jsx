/*
 * @Date: 2022-05-14 09:45:54
 * @LastEditors: JZY
 * @LastEditTime: 2022-10-04 11:40:51
 * @FilePath: /visual/src/components/MapVision/index.jsx
 */
import React, { Component } from 'react'
import * as d3 from "d3";
import { RedoOutlined, FilterOutlined, ArrowLeftOutlined, HeatMapOutlined, AimOutlined, MenuOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Button, Modal, Row, Col, Typography, Radio, Switch, Select, Drawer, Empty, Tag, Image, Descriptions, Card, Spin } from 'antd';
import ShowImg from './ShowImg';
const { Option } = Select;
// 常量设置
const { Title, Text } = Typography;
const xScale = d3.scaleLinear()
const yScale = d3.scaleLinear()
const maxValue = 20     // 缩放大小
const lineWidth = 0.2     // 分割线宽度
const rows = 73         //每行个数
const cols = 57         //每列个数
const imgSize = 10      //图片大小

const mapColors = ['#e7f1ff', '#b3d2ed', '#5ca6d4', '#1970ba', '#0c3b80', "#042950"];
const mapLevel = ['Postive', '0.25', '0.45', '0.60', '0.75', 'Negative']
const nosieColors = ['#c23531', '#91c7ae', '#1a61da']
//
var trans = { k: 1, x: 0, y: 0 }
var events = {}
var tap = 0
const children = [];
for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
        children.push(<Option key={i.toString() + "_" + j.toString()}>{(i < 10 ? "0" + i.toString() : i.toString()) + "_" + (j < 10 ? "0" + j.toString() : j.toString())}</Option>);
    }
}
const noiseChildren = [];
for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
        noiseChildren.push(<Option key={i.toString() + "_" + j.toString()}>{(i < 10 ? "0" + i.toString() : i.toString()) + "_" + (j < 10 ? "0" + j.toString() : j.toString())}</Option>);
    }
}


export default class MapVision extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            gridSize: 1,
            drawerVisible: false,
            confirmLoading: false,
            idx: -1,
            idy: -1,
            selectedIndex: null,
            option: {},
            option1: {
                grid: {
                    top: 0,
                    width: "80%",
                    bottom: 20
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#505765'
                        }
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: { onZero: false },
                        // prettier-ignore
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
                    }
                ],
                yAxis: [
                    {
                        name: 'O2U',
                        type: 'value',
                        min: 0,
                        max: 1
                    },
                    {
                        name: 'Fine',
                        nameLocation: 'start',
                        alignTicks: true,
                        type: 'value',
                        inverse: true,
                        min: 0,
                        max: 1
                    }
                ],
                series: [
                    {
                        name: 'O2U',
                        type: 'line',
                        areaStyle: {},
                        lineStyle: {
                            width: 1
                        },
                        showSymbol: false,
                        emphasis: {
                            focus: 'series'
                        },
                        markArea: {
                            silent: true,
                            itemStyle: {
                                opacity: 0.3,
                            },
                        },
                        data: [0.32, 0.2, 0.35, 0.32, 0.2, 0.45, 0.12, 0.52, 0.65, 0.72, 0.42, 0.35, 0.32, 0.42, 0.55, 0.61, 0.7, 0.61]
                    },
                    {
                        name: 'Fine',
                        type: 'line',
                        yAxisIndex: 1,
                        showSymbol: false,
                        areaStyle: {},
                        lineStyle: {
                            width: 1
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        markArea: {
                            silent: true,
                            itemStyle: {
                                opacity: 0.3
                            },
                        },
                        data: [0.22, 0.12, 0.35, 0.52, 0.2, 0.25, 0.34, 0.32, 0.45, 0.32, 0.42, 0.25, 0.22, 0.17, 0.26, 0.31, 0.11, 0.21]
                    }
                ]
            },
            load: true
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
        document.getElementById("right").classList.remove("ant-col-0")
        document.getElementById("right").classList.add("ant-col-6")
        document.getElementById("mainMap").classList.remove("ant-col-14")
        document.getElementById("mainMap").classList.add("ant-col-18")
        this.props.closeMap()
    }
    setIndex = (x, y) => {
        this.setState({
            idx: x,
            idy: y
        })
    }
    setVisible = async (args) => {
        await this.setState({
            option: {
                grid: {

                    left: 40,
                    right: 50,
                    bottom: 20,
                    top: 0
                },
                // title: {
                //     text: 'Noise Evaluation Metrics'
                // },
                yAxis: {
                    type: 'category',
                    data: ['O2U', 'Fine']
                },
                xAxis: {
                    type: 'value',
                    min: 0.0,
                    max: 1.0,
                    show: false,
                    splitLine: {     //网格线
                        "show": false
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                series: [{
                    data: [0.6, 0.45],
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
        this.setState({
            visible: args,
        })
    }

    changeGridSize = async (e) => {
        this.setState({
            gridSize: e.target.value
        });
        this.drawChart()
    }
    setConfirmLoading = (args) => {
        this.setState({
            confirmLoading: args
        })
    }
    showModal = () => {
        this.setVisible(true);
    };

    handleOk = () => {
        //   setModalText('The modal will be closed after two seconds');
        this.setConfirmLoading(true);
        setTimeout(() => {
            this.setVisible(false);
            this.setConfirmLoading(false);
        }, 2000);
    };

    handleCancel = () => {
        this.setVisible(false);
    };
    componentDidMount = async () => {
        await this.props.onChildEvent(this);
        this.drawChart();
        this.setState({
            load:false
        })

    }
    // click = (d) => {
    //     const width = document.getElementById("map").clientWidth
    //     const height = document.getElementById("map").clientHeight
    //     // 获取当前点击的坐标
    //     var xIndex = parseInt((d.offsetX - trans.x) / (width / (rows / trans.k)))
    //     var yIndex = parseInt((d.offsetY - trans.y) / (height / (cols / trans.k)))
    //     console.log(xIndex, yIndex)
    //     this.setIndex(xIndex, yIndex)
    //     this.setVisible(true)
    // }

    drawChart = () => {
        const colors = ['#e7f1ff', "#0c3b80"];
        const width = document.getElementById("map").clientWidth
        const height = document.getElementById("map").clientHeight
        const This = this
        xScale.domain([0, rows]).range([0, imgSize * rows]);
        yScale.domain([0, cols]).range([imgSize * cols, 0]);
        d3.select("#map").selectAll('svg').remove()

        // 初始化zoom
        const zoom = d3.zoom()
            .scaleExtent([1, maxValue])
            .translateExtent([[0, 0], [imgSize * rows, imgSize * cols]])
            .on("zoom", zoomed);
        // 热力图
        var colorScale = d3.scaleLinear()
            .domain([0, 1])
            .range(colors);
        // 初始化画布
        const mainGroup = d3.select("#map")
            .append('svg')
            .attr("width", width)
            .attr('height', height);
        // 绘制网格
        const grid = g => g
            .attr("stroke", "blue")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-width", lineWidth)
            .call(g => g.append("g")
                .selectAll("line")
                .data(xScale.ticks(rows))
                .join("line")
                .attr("x1", d => xScale(this.state.gridSize * d))
                .attr("x2", d => xScale(this.state.gridSize * d))
                .attr("y2", imgSize * cols))
            .call(g => g.append("g")
                .selectAll("line")
                .data(yScale.ticks(cols))
                .join("line")
                .attr("y1", d => yScale(this.state.gridSize * d))
                .attr("y2", d => yScale(this.state.gridSize * d))
                .attr("x2", imgSize * rows))

        // 绘图
        const imgs = mainGroup.selectAll("image").data([0]);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var path = "./data/test_data/x" + 5 * i + 1 + "_y" + 5 * j + 1 + "_class.png"
                d3.image(path).then(function (img) {
                }).catch(function (error) {
                    path = "./data/default.png"
                });
                imgs.enter()
                    .append("svg:image")
                    .attr("xlink:href", path)
                    .attr("row", i)
                    .attr("col", j)
                    .attr("x", imgSize * i)
                    .attr("y", imgSize * j)
                    .attr("width", imgSize - lineWidth)
            }
        }

        // 添加
        mainGroup.call(grid);
        mainGroup.call(zoom);
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
                d3.csv("./data/validIndex.csv").then(function (data) {
                    data.forEach(e => {
                        mainGroup.append('g')
                            .append('rect') //添加类型
                            .attr("x", imgSize * parseInt(e[0]) + margin)
                            .attr("y", imgSize * parseInt(e[1]) + margin)
                            .attr("width", imgSize - margin)
                            .attr("height", imgSize - margin)
                            .attr('fill', colorScale(parseFloat(e[2])))
                            .attr('opacity', 0.8)
                            .attr("transform", events.transform)
                    });
                })
                tap = 1;
            } else {
                mainGroup.selectAll("rect").remove()
                tap = 0
            }

        }
        function zoomed(event) {
            var margin = lineWidth
            if (event.transform.k > 25)
                margin = lineWidth * event.transform.k / 20
            mainGroup.selectAll("line").remove()
            mainGroup.selectAll("image").remove()
            const grid = g => g
                .attr("stroke", "blue")
                .attr("stroke-opacity", 0.5)
                .attr("stroke-width", margin)
                .call(g => g.append("g")
                    .selectAll("line")
                    .data(xScale.ticks(rows))
                    .join("line")
                    .attr("x1", d => xScale(This.state.gridSize * d))
                    .attr("x2", d => xScale(This.state.gridSize * d))
                    .attr("y2", imgSize * cols).attr("transform", event.transform))
                .call(g => g.append("g")
                    .selectAll("line")
                    .data(yScale.ticks(cols))
                    .join("line")
                    .attr("y1", d => yScale(This.state.gridSize * d))
                    .attr("y2", d => yScale(This.state.gridSize * d))
                    .attr("x2", imgSize * rows).attr("transform", event.transform));
            const imgs = mainGroup.selectAll("image").data([0]);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    var path = "./data/test_data/x" + 5 * i + 1 + "_y" + 5 * j + 1 + "_class.png"

                    d3.image(path).then(function (img) {
                    }).catch(function (error) {
                        path = "./data/default.png"
                    });
                    imgs.enter()
                        .append("svg:image")
                        .attr("xlink:href", path)
                        .attr("row", i)
                        .attr("col", j)
                        .attr("x", imgSize * i + margin)
                        .attr("y", imgSize * j + margin)
                        .attr("width", imgSize - margin)
                        // .attr("height", imgSize - margin)
                        .on("mouseover", function (d) {
                            d3.select(this)
                                .attr("width", imgSize * 1.2)
                                .attr("height", imgSize * 1.2)
                        })
                        .on("mouseout", function (d) {
                            d3.select(this).attr("width", imgSize - margin)
                                .attr("height", imgSize - margin)
                        })
                        .on("click", function (d) {
                            This.setIndex(this.getAttribute("row"), this.getAttribute("col"))
                            This.setVisible(true)
                        })
                        .attr("transform", event.transform);

                }
            }

            if (tap == 1) {
                mainGroup.selectAll("rect").remove();
                d3.csv("./data/validIndex.csv").then(function (data) {
                    mainGroup.selectAll("rect").remove();
                    data.forEach(e => {
                        mainGroup.append('g')
                            .append('rect') //添加类型
                            .attr("x", imgSize * parseInt(e[0]) + margin)
                            .attr("y", imgSize * parseInt(e[1]) + margin)
                            .attr("width", imgSize - margin)
                            .attr("height", imgSize - margin)
                            .attr('fill', colorScale(parseFloat(e[2])))
                            .attr('opacity', 0.8)
                            .attr("transform", events.transform)
                    });
                })
            }

            trans = event.transform
            events = event
            mainGroup.call(grid);

        }

    }

    render() {
        return (
            <>
                <Spin id="loading" size="large" spinning={this.state.load}>
                    <Card
                        bordered={false}
                        hoverable={true}
                    >
                        <Row hidden={this.props.hide} gutter={[5, 5]} >

                            <Col span={24}>
                                <div id='map' >

                                </div>
                            </Col>
                            <Col span={10}>
                                <Row gutter={[5, 10]}>
                                    <Col span={24}>
                                        <Title level={5}>
                                            <Button type="text" icon={<ArrowLeftOutlined />} onClick={this.getBack}></Button>
                                            &nbsp;Selected Image Show
                                        </Title>
                                    </Col>
                                    <Col span={1} />
                                    <Col span={22}>
                                        <Row gutter={[5, 10]}>
                                            <Col span={10}>
                                                <Text type="secondary"><AimOutlined />&nbsp;Refresh:</Text>
                                            </Col>
                                            <Col span={14}>
                                                <Button id='zoom_out' type="primary" shape="round" size="small" icon={<RedoOutlined />} ghost>Refresh</Button>
                                            </Col>
                                            <Col span={10}>
                                                <Text type="secondary"><HeatMapOutlined />&nbsp;HeatMap:</Text>
                                            </Col>
                                            <Col span={14}>
                                                <Switch id='zoom_change'
                                                    checkedChildren="HeatMap"
                                                    unCheckedChildren="Formally"
                                                />
                                            </Col>

                                            <Col span={24}>
                                                <Row gutter={5}>
                                                    {
                                                        mapColors.map((item, index) => {
                                                            return <>
                                                                <Col span={3} >
                                                                    <div style={{ width: 15, height: 15, backgroundColor: item }}></div>
                                                                </Col>
                                                                <Col span={9}> <Text>{mapLevel[index]}</Text></Col>
                                                            </>
                                                        })
                                                    }
                                                </Row>
                                            </Col>

                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={14}>
                                <Row gutter={[10, 10]}>

                                    {/* <Col span={24}>
                                        <Radio.Group onChange={{}} defaultValue="Fine">
                                            <Radio.Button value="O2U">O2U</Radio.Button>
                                            <Radio.Button value="Fine">Fine</Radio.Button>
                                        </Radio.Group>
                                    </Col> */}

                                    <Col span={18}>
                                        <Row gutter={[10, 10]}>
                                            <Col span={24}>
                                                <Text type="secondary"><AppstoreOutlined />&nbsp;Grid Size:</Text>
                                                <Radio.Group onChange={this.changeGridSize} value={this.state.gridSize}>
                                                    <Radio value={1}>1</Radio>
                                                    <Radio value={2}>2</Radio>
                                                    <Radio value={3}>3</Radio>
                                                    <Radio value={4}>4</Radio>
                                                </Radio.Group>
                                            </Col>
                                            <Col span={24}>
                                                <Text type="secondary"><MenuOutlined />&nbsp;Noise Sample List:</Text>
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

                            </Col>
                        </Row>
                    </Card>
                </Spin>

                <Modal
                    title={"Check: [" + this.state.idx + "," + this.state.idy + "]"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <ShowImg idx={this.state.idx} idy={this.state.idy} option={this.state.option} option1={this.state.option1} />

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

