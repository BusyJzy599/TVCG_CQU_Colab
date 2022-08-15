/*
 * @Date: 2022-04-17 18:27:09
 * @LastEditors: JZY
 * @LastEditTime: 2022-07-28 19:20:15
 * @FilePath: /visual/src/components/RightModule/index.jsx
 */

import React, { Component } from 'react'
import { Row, Col, Card, Typography, Spin, Image, Button, Divider, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';


const { Text, Title } = Typography;

const gridStyle = {
  textAlign: 'center',
  display: "block",
  height: '21vh',
  width: "50%",
};
export default class Com3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 1,
      choosePatches: props.choosePatches,
      optionLine: {
        title: {
          text: 'ACC & AUC',
          top:-5
        },
        grid: {
          left: '15%',
          top: 20,
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
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        yAxis: {
          min: 0.45,
          max: 1,
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
            data: [0.61, 0.62, 0.63, 0.71, 0.67, 0.61, 0.62, 0.63, 0.71, 0.83, 0.71, 0.67, 0.83, 0.85, 0.87, 0.89, 0.91]
          },
          {
            name: 'auc',
            type: 'line',
            showSymbol: false,
            data: [0.51, 0.52, 0.53, 0.61, 0.62, 0.63, 0.71, 0.61, 0.87, 0.93, 0.81, 0.87, 0.93, 0.85, 0.87, 0.86, 0.95]
          },
        ]
      }
    }
  }
  changeChoosePatches = (p) => {
    this.setState({
      choosePatches: p
    })
  }
  toGrid = () => {
    this.setState({ show: 1 })
  }
  toBase = () => {
    this.setState({ show: 0 })
  }
  chooseImg = (e) => {
    setTimeout(() => {
      document.getElementById("BarChart").classList.add("hidden")
      document.getElementById("ConfusionChart").classList.add("hidden")
      document.getElementById("right").classList.remove("ant-col-6")
      document.getElementById("right").classList.add("ant-col-0")
      document.getElementById("mainMap").classList.remove("ant-col-18")
      document.getElementById("mainMap").classList.add("ant-col-14")
      // document.getElementById("one").appendChild(document.getElementById("mapVision"))
      document.getElementById("mapVision").classList.remove("hidden")
      this.props.showMap()
      this.state.choosePatches.map((item, index) => { document.getElementById("childCard" + index).classList.add("hidden") })

      // this.setState({ hide: false, showMap: true })
      this.setState({ show: 2 })
    }, 0);
  }
  deleteImg = (index) => {
    var tags = this.state.choosePatches

    tags = tags.filter(item => item != index)

    setTimeout(() => {
      this.setState({
        choosePatches: tags
      })
      this.props.changeDeletePatches(tags);
    }, 0);
  }

  render() {
    return (
      <>
        <Card bordered={false} hoverable={true}>
          <Row gutter={[10, 10]}>

            <Col span={24} style={{ height: '68vh' }}>

              {
                <>
                  <Title level={4}>
                    {/* <Button type="text" icon={<ArrowLeftOutlined />} onClick={this.toBase}></Button> */}
                    &nbsp;Selected 6 Grids
                  </Title>
                  {
                    this.state.choosePatches.length == 0 ? <Empty style={{ marginTop: "30vh" }} /> :
                      this.state.choosePatches.map((item, index) => {

                        return <Card.Grid className='childCard' id={'childCard' + index} key={'childCard' + index} style={gridStyle} >
                          <Row gutter={[5, 10]}>
                            <Col span={24}>
                              <Image
                                width="75% "
                                src={"./data/1/v_" + item % 40 + "_" + item % 40 + ".png"}
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
              {/* {
                this.state.show == 2 ?  <p>123</p>: null
                // <MapVision hide={this.state.show != 2} back={this.getBack} load={this.setLoading} />
              } */}
            </Col>
            <Col span={24} style={{ borderTop: '3px solid rgba(240, 242, 245)' }}>
              <ReactECharts style={{ height: "20vh", width: "22vw" }} option={this.state.optionLine} />
            </Col>

          </Row>
        </Card>
      </>
    )
  }
}

