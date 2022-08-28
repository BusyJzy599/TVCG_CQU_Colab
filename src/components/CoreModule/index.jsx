/*
 * @Date: 2022-04-17 18:26:37
 * @LastEditors: JZY
 * @LastEditTime: 2022-08-28 18:05:21
 * @FilePath: /visual/src/components/CoreModule/index.jsx
 */
import React, { Component } from 'react'
import { Row, Col, Card } from 'antd';
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
    changeChoosePatches = async (p) => {
        await this.setState({
            choosePatches: p
        });
        this.props.changeChoosePatches(this.state.choosePatches);
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
                        <Col className='row_1' span={24}>
                            <ScatterModel
                                onChildEvent={this.handleScatterModuleEvent}
                                ref={this.scatterModelRef}
                                changeChoosePatches={this.changeChoosePatches}
                                choosePatches={this.state.choosePatches}
                                showIndex={this.state.showIndex}
                                Patches={this.state.selectedPatches}
                                getSelectPatches={this.getSelectPatches} />
                        </Col>
                        <Col className='row_2' span={24}>
                            <SankeyModel />
                        </Col>
                    </Row>
                </Card>

            </>
        )

    }
}



