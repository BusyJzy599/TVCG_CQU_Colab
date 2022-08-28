/*
 * @Date: 2022-04-17 17:39:09
 * @LastEditors: JZY
 * @LastEditTime: 2022-08-28 18:18:01
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


const { Content, Sider, Header } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choosePatches: [],
    }
    this.RightModule = React.createRef();
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
    this.RightModule.current.changeChoosePatches(p);
  }
  showMap =  async() => {
    await this.mapChildRef.setState({
      load:true
    });
    this.mapChildRef.componentDidMount();
  }
  handleMapChildEvent = (ref) => {
    this.mapChildRef = ref
  }
  handleCoreModuleEvent = (ref) => {
    this.coreModuleRef = ref
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
                <Col span={18} id="mainMap">
                  <CoreModule
                    onChildEvent={this.handleCoreModuleEvent}
                    ref={this.coreModuleRef}
                    changeChoosePatches={this.changeChoosePatches}
                    choosePatches={this.state.choosePatches}
                    Patches={this.state.selectedPatches}
                  />
                </Col>
                <Col span={6} id="right">
                  <RightModule
                    showMap={this.showMap}
                    ref={this.RightModule}
                    changeDeletePatches={this.changeDeletePatches}
                    choosePatches={this.state.choosePatches}
                  />
                </Col>
                <Col span={10} className="hidden" id="mapVision">
                  <MapVision
                    onChildEvent={this.handleMapChildEvent}
                    ref={this.mapChildRef} />
                </Col>
              </Row>
            </Space>
          </Content>
        </Layout>
      </>
    )
  }
}


