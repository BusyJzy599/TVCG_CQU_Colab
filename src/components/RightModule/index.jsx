/*
 * @Date: 2022-04-17 18:27:09
 * @LastEditors: JZY
 * @LastEditTime: 2022-10-04 11:39:16
 * @FilePath: /visual/src/components/RightModule/index.jsx
 */

import React, { Component } from 'react'
import * as d3 from "d3";
import { Row, Col, Card, Typography, Image, Button, Empty } from 'antd';
import ReactECharts from 'echarts-for-react';


const { Title } = Typography;
const path = "./data/ready/epoch_Data.csv"
export default class RightModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choosePatches: props.choosePatches,
      optionLine: {}
    }
  }
  componentDidMount = () => {
    this.props.onChildEvent(this);
    this.drawLineChart();
  }
  changeChoosePatches = (p) => {
    this.setState({
      choosePatches: p
    })
  }
  drawLineChart = async () => {
    var index = []
    var acc = []
    var auc = []
    await d3.csv(path).then(function (data) {
      data.forEach(e => {
        index.push(parseInt(e["epoch"]))
        acc.push(parseFloat(e["acc"]))
        auc.push(parseFloat(e["auc"]))
      })
    });
    this.setState({
      optionLine: {
        title: {
          text: 'ACC & AUC',
          top: -5
        },
        grid: {
          left: '10%',
          top: "10%",
          right: 0,
          bottom: 20
        },
        tooltip: {
          trigger: 'axis',
          position: function (point, params, dom, rect, size) {
            return [point[0] - 100, '0%']  //返回x、y（横向、纵向）两个点的位置
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: index
        },
        yAxis: {
          splitLine: {
            show: false
          },
          type: 'value'
        },
        series: [
          {
            name: 'acc',
            type: 'line',
            showSymbol: false,
            data: acc
          },
          {
            name: 'auc',
            type: 'line',
            showSymbol: false,
            data: auc
          },
        ]
      }
    })

  }
  // 
  chooseImg = async (e) => {
    await document.getElementById("right").classList.remove("ant-col-6")
    await document.getElementById("right").classList.add("ant-col-0")

    await document.getElementById("mainMap").classList.remove("ant-col-18")
    await document.getElementById("mainMap").classList.add("ant-col-14")
    await this.props.showMap()
    // await this.state.choosePatches.map((item, index) => { document.getElementById("childCard" + index).classList.add("hidden") })
  }
  deleteImg = async (index) => {
    var tags = this.state.choosePatches;
    tags = tags.filter(item => item != index);

    await this.setState({
      choosePatches: tags
    })
    this.props.changeDeletePatches(tags);
  }

  render() {
    return (
      <>
        <Card bordered={false} hoverable={true}>
          {
            this.props.mapValid ? null 
            : <Row gutter={[10, 10]}>

                <Col span={24} style={{ height: '68vh' }}>

                  {
                    <>
                      <Title level={4}>
                        {/* <Button type="text" icon={<ArrowLeftOutlined />} onClick={this.toBase}></Button> */}
                        &nbsp;Selected 6 Grids
                      </Title>
                      {
                        this.state.choosePatches.length === 0 ? <Empty style={{ marginTop: "30vh" }} /> :
                          this.state.choosePatches.map((item, index) => {

                            return <Card.Grid className='childCard' id={'childCard' + index} key={'childCard' + index}  >
                              <Row gutter={[5, 10]}>
                                <Col span={24}>
                                  <Image
                                    className='grid-img'
                                    src={"./data/test.png"}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Button type='primary' onClick={this.chooseImg} ghost>Check</Button></Col>
                                <Col span={12}>
                                  <Button type='danger' onClick={() => this.deleteImg(item)} ghost>Delete</Button>
                                </Col>
                              </Row>
                            </Card.Grid>

                          })
                      }</>
                  }
                </Col>
                <Col span={24} className="line-chart-box">
                  <ReactECharts className='line-chart' style={{ height: "20vh", width: "22vw" }} option={this.state.optionLine} />
                </Col>

              </Row>
          }

        </Card>
      </>
    )
  }
}

