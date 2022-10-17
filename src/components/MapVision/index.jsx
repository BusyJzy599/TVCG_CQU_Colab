import React, { Component } from 'react'
import * as d3 from "d3";
import ReactECharts from 'echarts-for-react';
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

export default class MapVision extends Component {
    constructor(props) {
        super(props);
        this.state = {
            heatEvent: null,
            heatMapType: "close",
            noiseChildren: [],
            index: [],

            load: true,
            visible: false,
            gridSize: 1,
            confirmLoading: false,
            barOption: {},
            areaOption: {},
            selectedPatch: {},  //选中数据
        };

    }
    noiseFilter = (value) => {
        var x_y = value.split("_")
        var x = (parseInt(x_y[0].split("x")[1]) - 1) / 50
        var y = (parseInt(x_y[1].split("y")[1]) - 1) / 50
        this.setIndex(parseInt(value.split('_')[0]), parseInt(value.split('_')[1]))
        this.setVisible(true)
    }
    closeMap = () => {
        this.props.closeMap()
    }
    setIndex = (x, y) => {
        this.setState({
            index: [x, y]
        })
    }
    setVisible = async (args) => {
        await this.setState({
            barOption: {
                grid: {

                    left: "20%",
                    right: "10%",
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
            },
            areaOption: {
                grid: {
                    top: 0,
                    left: "13%",
                    right: "13%",
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

    showModal = () => {
        this.setVisible(true);
    };
    setConfirmLoading = (args) => {
        this.setState({
            confirmLoading: args
        })
    }
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
            load: false
        })

    }

    drawChart = async () => {
        const colors = ['#e7f1ff', "#0c3b80"];
        const width = document.getElementById("map").clientWidth
        const height = document.getElementById("map").clientHeight
        const imgId = 1;
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
            .attr("preserveAspectRatio","xMinYMin meet")
            .attr('width', "100%")
            .attr('height', "100%")
        //导入数据
        var imgData = []
        var noiseChild = []
        await d3.csv(process.env.REACT_APP_SAMPLE_DATA).then(data => {
            data.forEach((item) => {
                if (parseInt(item["img_id"]) == imgId) {
                    imgData.push({
                        patch_id: parseInt(item["patch_id"]),
                        o2u: parseFloat(item["o2u"]),
                        grade: parseInt(item["grade"]),
                        fine: parseFloat(item["fine"]),
                        heat_score: parseFloat(item["heat_score"]),
                        file_name: (item["file_name"]),
                        noise: parseFloat(item["noise"]),
                        class: parseInt(item["class"]),
                    })
                    if (parseInt(item["noise"]) > 0)
                        noiseChild.push(
                            <Option key={(item["file_name"])}>
                                {(item["file_name"])}
                            </Option>);
                }

            })
            This.setState({
                noiseChildren: noiseChild
            })

        })

        // 添加
        mainGroup.call(zoom);
        drawGrid();
        drawPatches();
        // 恢复大小
        d3.select('#zoom_out').on('click', () => mainGroup.transition().call(zoom.transform, d3.zoomIdentity, [0, 0]));
        // 改变热力图
        d3.select('#zoom_change').on('change', toHeatMap);

        // 绘制网格
        function drawGrid(event) {
            mainGroup.selectAll("line").remove()
            var margin = lineWidth
            if (event != null && event.transform.k > 25)
                margin = lineWidth * event.transform.k / 20
            var grid = g => g
                .attr("stroke", "blue")
                .attr("stroke-opacity", 0.5)
                .attr("stroke-width", margin)
                .call(g => g.append("g")
                    .selectAll("line")
                    .data(xScale.ticks(rows))
                    .join("line")
                    .attr("x1", d => xScale(This.state.gridSize * d))
                    .attr("x2", d => xScale(This.state.gridSize * d))
                    .attr("y2", imgSize * cols).attr("transform", event == null ? null : event.transform))
                .call(g => g.append("g")
                    .selectAll("line")
                    .data(yScale.ticks(cols))
                    .join("line")
                    .attr("y1", d => yScale(This.state.gridSize * d))
                    .attr("y2", d => yScale(This.state.gridSize * d))
                    .attr("x2", imgSize * rows).attr("transform", event == null ? null : event.transform))
            mainGroup.call(grid);
        }
        // 绘图
        function drawPatches(event) {
            mainGroup.selectAll("image").remove()
            var margin = lineWidth
            if (event != null && event.transform.k > 25)
                margin = lineWidth * event.transform.k / 20

            const imgs = mainGroup.selectAll("image").data([0]);

            imgData.forEach((img) => {
                var x_y = img["file_name"].split("_")
                var x = (parseInt(x_y[0].split("x")[1]) - 1) / 50
                var y = (parseInt(x_y[1].split("y")[1]) - 1) / 50
                var path = "./data/test_data/" + img["file_name"];
                imgs.enter()
                    .append("svg:image")
                    .attr("xlink:href", path)
                    .attr("row", x)
                    .attr("col", y)
                    .attr("x", imgSize * x + margin)
                    .attr("y", imgSize * y + margin)
                    .attr("width", imgSize - lineWidth - margin)
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
                        //！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
                        // 点击选中要将选中的切片数据进行保存,state
                        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        This.setIndex(this.getAttribute("row"), this.getAttribute("col"))
                        This.setVisible(true)
                    })
                    .attr("transform", event == null ? null : event.transform);
            })
        }
        //绘制热力图
        function drawHeatMap() {
            if (This.state.heatMapType != "close") {

                mainGroup.selectAll("rect").remove()
                try {
                    var margin = lineWidth / This.state.heatEvent.transform.k;
                } catch (err) {
                    var margin = lineWidth;
                }
                setTimeout(() => {
                    imgData.forEach((img) => {
                        var x_y = img["file_name"].split("_")
                        var x = (parseInt(x_y[0].split("x")[1]) - 1) / 50
                        var y = (parseInt(x_y[1].split("y")[1]) - 1) / 50
                        mainGroup.append('g')
                            .append('rect') //添加类型
                            .attr("x", imgSize * x + margin)
                            .attr("y", imgSize * y + margin)
                            .attr("width", imgSize - margin)
                            .attr("height", imgSize - margin)
                            .attr('fill', colorScale(parseFloat(img[This.state.heatMapType])))
                            .attr('opacity', 0.5)
                            .attr("transform", This.state.heatEvent == null ? null : This.state.heatEvent.transform)
                    })
                }, 0);
            }

        }
        async function toHeatMap() {
            var type = document
                .getElementsByClassName("ant-radio-button-wrapper-checked")[0]
                .getElementsByTagName("span")[2]
                .textContent
            if (type != "close") {
                await This.setState({
                    // heatMapShow: true,
                    heatMapType: type
                })
                await drawHeatMap()
            } else {
                This.setState({
                    heatMapType: "close"
                })
                mainGroup.selectAll("rect").remove()
            }

        }
        function zoomed(event) {
            This.setState({
                heatEvent: event
            })
            drawGrid(event);
            drawPatches(event);
            drawHeatMap(event);
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
                        <Row gutter={[5, 5]} >

                            <Col span={24}>
                                <div id='map' >

                                </div>
                            </Col>
                            <Col span={12}>
                                <Row gutter={[5, 5]}>
                                    <Col span={24}>
                                        <Title level={5}>
                                            <Button type="text" icon={<ArrowLeftOutlined />} onClick={this.closeMap}></Button>
                                            &nbsp;Selected Image Show
                                        </Title>
                                    </Col>
                                    <Col span={8}>
                                        <Text type="secondary"><AimOutlined />&nbsp;Refresh:</Text>
                                    </Col>
                                    <Col span={14}>
                                        <Button id='zoom_out' type="primary" shape="round" size="small" icon={<RedoOutlined />} ghost>Refresh</Button>
                                    </Col>
                                    <Col span={24}>
                                        <Text type="secondary"><AppstoreOutlined />&nbsp;Grid Size:</Text>
                                    </Col>
                                    <Col offset={2} span={22}>
                                        <Radio.Group onChange={this.changeGridSize} value={this.state.gridSize}>
                                            <Radio value={1}>1</Radio>
                                            <Radio value={2}>2</Radio>
                                            <Radio value={3}>3</Radio>
                                            <Radio value={4}>4</Radio>
                                        </Radio.Group>
                                    </Col>
                                    <Col span={22}>
                                        <Text type="secondary"><MenuOutlined />&nbsp;Noise Sample List:</Text>
                                        <Select
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Check Noise"
                                            onChange={this.noiseFilter}
                                        >
                                            {this.state.noiseChildren}
                                        </Select>

                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row gutter={[10, 10]}>
                                    <Col span={22}>
                                        <Row gutter={[5, 10]}>
                                            <Col span={24}>
                                                <Text type="secondary"><HeatMapOutlined />&nbsp;HeatMap:</Text>
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
                                            <Col span={24}>
                                                <Radio.Group
                                                    id='zoom_change'
                                                    defaultValue="close">
                                                    <Radio.Button value="close">close</Radio.Button>
                                                    <Radio.Button value="heat">heat</Radio.Button>
                                                    <Radio.Button value="o2u">o2u</Radio.Button>
                                                    <Radio.Button value="fine">fine</Radio.Button>
                                                </Radio.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </Card>
                </Spin>

                <Modal
                    title={"Check Index:" + this.state.index}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Row gutter={[0, 10]} justify="space-around" align="middle">
                        <Col span={12} offset={1}>
                            <ShowImg index={this.state.index} />
                        </Col>
                        <Col span={10} offset={1}>
                            <Text type="secondary">Grad-Cam Image</Text>
                            <Image
                                fallback="data:image/png;base64,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"
                                src={""} />
                        </Col>
                        <Col span={24}>

                            <Descriptions layout="vertical" size='large' column={4} bordered>

                                <Descriptions.Item span={2} label="O2U$Fine Scores">
                                    <ReactECharts style={{ width: 190, height: 80 }} option={this.state.barOption} />
                                </Descriptions.Item>
                                <Descriptions.Item span={2} label="Epoch Changes">
                                    <ReactECharts style={{ width: 200, height: 110 }} option={this.state.areaOption} />

                                </Descriptions.Item>
                                <Descriptions.Item span={2} label="CC Grade">
                                    <Tag color="#fab52e"> Noise</Tag>
                                </Descriptions.Item>
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

                            </Descriptions>

                        </Col>

                    </Row>

                    {/* <Col>
                        <ReactECharts style={{ width: 245, height: 80 }} option={props.option} />
                    </Col>
                    <Col>
                        <ReactECharts style={{ width: 245, height: 110}} option={props.option1} />
                    </Col> */}

                </Modal>
            </>

        )
    }
}

