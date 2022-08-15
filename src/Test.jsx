/*
 * @Date: 2022-05-14 09:45:54
 * @LastEditors: JZY
 * @LastEditTime: 2022-07-28 09:53:03
 * @FilePath: /visual/src/Test.jsx
 */
import React, { Component } from 'react'
import * as d3 from "d3";
import { RedoOutlined, FilterOutlined, ArrowLeftOutlined, HeatMapOutlined, AimOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Modal, Row, Col, Typography, Space, Switch, Select, Drawer, Empty, Tag, Image, Descriptions, Card, Spin } from 'antd';
import { image } from 'd3';

const { Option } = Select;
// 常量设置
const { Title, Text } = Typography;

const style = {
  height: '80vh',
  width: '60vw',
  border: '1px solid rgba(0, 0, 0, 0.5)',
}
const toolStyle = {
  padding: -10
}
//

const xScale = d3.scaleLinear()
const yScale = d3.scaleLinear()
const maxValue = 40     // 网格分割数
const lineWidth = 0.3     // 分割线宽度

const rows = 73
const cols = 57
const imgSize = 10

const mapColors = ['#870a24', '#dd7059', '#fcd7c1', '#d5e6f1', '#65a9cf', '#134d88']
const mapLevel = ['0.90  Negative', '0.75', '0.60', '0.45', '0.25', '0.10  Postive']
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
      drawerVisible: false,
      confirmLoading: false,
      idx: -1,
      idy: -1,
      selectedIndex: null,
      option: {},
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
    document.getElementById("BarChart").classList.remove("hidden")
    document.getElementById("confuseMatrix").classList.remove("hidden")
    document.getElementById("right").classList.remove("ant-col-0")
    document.getElementById("right").classList.add("ant-col-6")
    document.getElementById("mainMap").classList.remove("ant-col-14")
    document.getElementById("mainMap").classList.add("ant-col-18")
    document.getElementById("mapVision").classList.remove("ant-col-10")

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
  componentDidMount() {
    this.drawChart();
    if (window.location.hash.split('/')[1] == undefined || window.location.hash.split('/')[1] == "") {
      setTimeout(() => {
        this.setState({
          load: false
        })
      }, 0);

    }


  }
  click = (d) => {
    const width = document.getElementById("map").clientWidth
    const height = document.getElementById("map").clientHeight
    // 获取当前点击的坐标
    var xIndex = parseInt((d.offsetX - trans.x) / (width / (rows / trans.k)))
    var yIndex = parseInt((d.offsetY - trans.y) / (height / (cols / trans.k)))
    console.log(xIndex, yIndex)
    this.setIndex(xIndex, yIndex)
    this.setVisible(true)
  }

  drawChart = () => {
    const width = document.getElementById("map").clientWidth
    const height = document.getElementById("map").clientHeight
    xScale.domain([0, rows]).range([0, imgSize * rows]);
    yScale.domain([0, cols]).range([imgSize * cols, 0]);
    d3.select("#map").selectAll('svg').remove()

    // 初始化zoom
    const zoom = d3.zoom()
      .scaleExtent([1, maxValue])
      // .translateExtent([[0, 0], [width, height]])
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
        .data(xScale.ticks(rows))
        .join("line")
        .attr("x1", d => xScale(d))
        .attr("x2", d => xScale(d))
        .attr("y2", imgSize * cols))
      .call(g => g.append("g")
        .selectAll("line")
        .data(yScale.ticks(cols))
        .join("line")
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
        .attr("x2", imgSize * rows))


    const imgs = mainGroup.selectAll("image").data([0]);
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        var path = "./data/2/x" + 5 * i + 1 + "_y" + 5 * j + 1 + "_class.png"
        d3.image(path).then(function (img) {
        }).catch(function (error) {
          path = "./data/default.png"
        });
        imgs.enter()
          .append("svg:image")
          .attr("xlink:href", path)
          .attr("x", imgSize * i)
          .attr("y", imgSize * j)
          .attr("width", imgSize - lineWidth)

      }
    }
    // 添加
    mainGroup.call(grid);
    mainGroup.call(zoom);
    mainGroup.on("click", this.click);
    mainGroup.transition().duration(1000).call(
        zoom.transform,
        d3.zoomIdentity.translate(-(rows/2),-(cols/2))
    );

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


        for (var i = 0; i < rows; i++) {
          for (var j = 0; j < cols; j++) {
            mainGroup.append('g')
              .append('rect') //添加类型
              .attr("x", imgSize * i + margin)
              .attr("y", imgSize * j + margin)
              .attr("width", imgSize - margin)
              .attr("height", imgSize - margin)
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
          .data(xScale.ticks(rows))
          .join("line")
          .attr("x1", d => xScale(d))
          .attr("x2", d => xScale(d))
          .attr("y2", imgSize * cols).attr("transform", event.transform))
        .call(g => g.append("g")
          .selectAll("line")
          .data(yScale.ticks(cols))
          .join("line")
          .attr("y1", d => yScale(d))
          .attr("y2", d => yScale(d))
          .attr("x2", imgSize * rows).attr("transform", event.transform));
      const imgs = mainGroup.selectAll("image").data([0]);
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {

          var path = "./data/2/x" + 5 * i + 1 + "_y" + 5 * j + 1 + "_class.png"
          
          d3.image(path).then(function (img) {
          }).catch(function (error) {
            path = "./data/default.png"
          });
          imgs.enter()
          .append("svg:image")
          .attr("xlink:href", path)
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
          .attr("transform", event.transform);



        }
      }
      mainGroup.selectAll("rect").remove()
      if (tap == 1) {
        for (var i = 0; i < rows; i++) {
          for (var j = 0; j < cols; j++) {
            mainGroup.append('g')
              .append('rect') //添加类型
              .attr("x", imgSize * i + margin)
              .attr("y", imgSize * j + margin)
              .attr("width", imgSize - margin)
              .attr("height", imgSize - margin)
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

  }

  render() {
    return (
      <>
        <Spin size="large" spinning={this.state.load}>
          <Card
            bordered={false}
            hoverable={true}
          >

            <Row hidden={this.props.hide} style={toolStyle} gutter={[10, 5]} >
              <Col span={24}>
                <Title level={5}>
                  <Button type="text" icon={<ArrowLeftOutlined />} onClick={this.getBack}></Button>
                  &nbsp;Selected Image Show
                </Title>
              </Col>
              <Col span={24}>
                <div id='map' style={style}>

                </div>
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
          {/* <ShowImg idx={this.state.idx} idy={this.state.idy} option={this.state.option} /> */}

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

