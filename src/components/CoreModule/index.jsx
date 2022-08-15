/*
 * @Date: 2022-04-17 18:26:37
 * @LastEditors: JZY
 * @LastEditTime: 2022-07-28 11:43:36
 * @FilePath: /visual/src/components/CoreModule/index.jsx
 */
import React, { Component } from 'react'
import { Row, Col, Card, Typography, Spin, Image, Button, Timeline } from 'antd';
import ScatterModel from './ScatterModel';
import SankeyModel from './SankeyModel';

export default class CoreModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // activeTabKey: "Map",
            showIndex: 0,
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
        console.log("Core")
        this.scatterModelRef.changeDeletePatches(p)
    }
    changeChoosePatches = (p) => {
        this.setState({
            choosePatches: p
        });
        setTimeout(() => {
            this.props.changeChoosePatches(this.state.choosePatches);
        }, 0);
    }
    handleScatterModuleEvent = (ref) => {
        this.scatterModelRef = ref
      }
    render() {
        return (
            <>
                <Card
                    bordered={false}
                    hoverable={true}
                >
                    <Row>
                        <Col span={24} style={{ height: "68vh" }}>
                            <ScatterModel
                            onChildEvent={this.handleScatterModuleEvent} ref={this.scatterModelRef}
                             changeChoosePatches={this.changeChoosePatches} choosePatches={this.state.choosePatches} showIndex={this.state.showIndex} Patches={this.state.selectedPatches} getSelectPatches={this.getSelectPatches} />
                        </Col>
                        <Col span={24} style={{ height: "20vh" }}>
                            <SankeyModel />
                        </Col>
                    </Row>
                </Card>

            </>
        )

    }
}



