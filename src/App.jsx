/*
 * @Date: 2022-04-17 17:39:09
 * @LastEditors: JZY
 * @LastEditTime: 2022-10-04 11:34:12
 * @FilePath: /visual/src/App.jsx
 */
import './App.css';
import React, { Component } from 'react'
import {
  Row,
  Layout,
  Space,
  Col
} from 'antd';
// 导入组件
import CoreModule from './components/CoreModule'
import MapVision from './components/MapVision'
import RightModule from './components/RightModule'
import TopModule from './components/TopModule';


const { Content, Header } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choosePatches: [1,2],
      mapValid: false,
    }
  }
  changeDeletePatches = (p) => {
    this.setState({
      choosePatches: p
    });
    this.coreModuleRef.changeDeletePatches(p)
  }
  changeChoosePatches = (p) => {
    this.setState({
      choosePatches: p
    });
    this.RightModule.changeChoosePatches(p);
  }
  showMap = () => {
    this.setState({
      mapValid: true,

    })
  }
  closeMap = () => {
    this.setState({
      mapValid: false,
    })

  }

  handleMapChildEvent = (ref) => {
    this.mapChildRef = ref
  }
  handleCoreModuleEvent = (ref) => {
    this.coreModuleRef = ref
  }
  handleRightChildEvent = (ref) => {
    this.RightModule = ref
  }
  render() {
    return (
      <>
        <Layout>
          <Header className='headerModule'>
            <TopModule />
          </Header>
          <Content className="site-layout">
            <Space className='basic' direction="vertical" size="small">
              <Row gutter={[5, 5]} id="one">
                <Col span={this.state.mapValid ?14:18} id="mainMap">
                  <CoreModule
                    onChildEvent={this.handleCoreModuleEvent}
                    ref={this.coreModuleRef}

                    changeChoosePatches={this.changeChoosePatches}
                    choosePatches={this.state.choosePatches}
                    mapValid={this.state.mapValid}
                  />
                </Col>
                <Col span={this.state.mapValid ?0:6} id="right">
                  <RightModule
                    onChildEvent={this.handleRightChildEvent}
                    ref={this.RightModule}

                    showMap={this.showMap}
                    changeDeletePatches={this.changeDeletePatches}
                    choosePatches={this.state.choosePatches}
                    mapValid={this.state.mapValid}
                  />
                </Col>
                <Col span={10} id="mapVision">
                  {
                    this.state.mapValid ?
                      <MapVision
                        onChildEvent={this.handleMapChildEvent}
                        ref={this.mapChildRef}
                        closeMap={this.closeMap}
                      /> : null
                  }

                </Col>
              </Row>
            </Space>
          </Content>
        </Layout>
      </>
    )
  }
}


