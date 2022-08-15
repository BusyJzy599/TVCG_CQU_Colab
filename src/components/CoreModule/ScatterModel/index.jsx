/*
 * @Date: 2022-07-21 10:17:01
 * @LastEditors: JZY
 * @LastEditTime: 2022-07-28 16:48:25
 * @FilePath: /visual/src/components/CoreModule/ScatterModel/index.jsx
 */

import React, { Component } from 'react'
import * as d3 from "d3";
import { Row, Col, Radio, Typography, Spin, List, Tag, Button } from 'antd';
import Scatter from './Scatter';
import Bar from './Bar';
const { Text, Title } = Typography;
export default class ScatterModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chooseClass: "LUSC",
            scatter: "scatterLUSC",
            patcheId: -1,
            imgId: -1,
            selectedPatch: -1,
            loading: true,
            choosePatches: props.choosePatches
        }
    }
    componentDidMount = () => {
        this.props.onChildEvent(this);
    }
    changeDeletePatches = (p) => {
        this.setState({
            choosePatches: p
        });
        console.log("Scatter")
        this.barChildRef.changeDeletePatches(p)
    }
    // 将子组件的实例存到 this.childRef 中, 这样整个父组件就能拿到
    handleScatterChildEvent = (ref) => {
        this.scatterChildRef = ref
    }
    handleBarChildEvent = (ref) => {
        this.barChildRef = ref
    }
    onChange = (e) => {
        this.setState({
            chooseClass: e.target.value,
            scatter: "scatter" + e.target.value,
            selectedPatch: -1
        }
        );
        this.drawChart(e.target.value)
        setTimeout(() => {
            this.childRef.changeScatter()
        }, 0);

    };
    changeBarRange = (id) => {
        this.barChildRef.changeBarRange(id)
    }
    changeChoosePatches = (p) => {
        this.setState({
            choosePatches: p
        });
        setTimeout(() => {
            this.props.changeChoosePatches(p);
        }, 0);
    }
    render() {
        return (
            <>
                <Row gutter={5}>
                    <Col span={19} >
                        {/* <div id="selectTip" style={{ left: "2.3vw", top: "58vh" }}>
                            <List
                                bordered
                                dataSource={[0]}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Row style={{ width: "58vw", height: "3vh" }}>
                                            <Col span={4}>
                                                <Typography.Text>
                                                    Choose Patches:
                                                </Typography.Text>
                                            </Col>
                                            <Col span={18}>
                                                {
                                                    this.state.selectedPatches.length == 0 ? <Typography.Text type="secondary">Please Choose 9 Patches...</Typography.Text> :
                                                        this.state.selectedPatches.map((item, index) => {
                                                            return <>
                                                                <Tag closable key={item}
                                                                    onClose={() => this.handleClose(item)}
                                                                >
                                                                    {item}
                                                                </Tag>
                                                            </>
                                                        })
                                                }

                                            </Col>
                                            <Col span={2}>
                                                <Button type='primary' onClick={this.test}>Select</Button>
                                            </Col>
                                        </Row>


                                    </List.Item>
                                )}
                            />
                        </div> */}
                        <Scatter id={this.state.scatter} changeBarRange={this.changeBarRange} onChildEvent={this.handleScatterChildEvent} ref={this.scatterChildRef} patchId={this.state.patcheId} imgId={this.state.imgId} />
                    </Col>
                    <Col span={5} id="BarChart" style={{borderLeft:'3px solid rgba(240, 242, 245)'}}>
                        <Bar  
                        changeChoosePatches={this.changeChoosePatches} 
                        choosePatches={this.state.choosePatches}
                         onChildEvent={this.handleBarChildEvent} 
                         ref={this.barChildRef} />
                    </Col>
                </Row>
            </>
        )
    }
}
