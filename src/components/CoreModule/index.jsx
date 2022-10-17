/*
 * @Date: 2022-04-17 18:26:37
 * @LastEditors: JZY
 * @LastEditTime: 2022-10-04 11:37:48
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
                                mapValid={this.props.mapValid} />
                        </Col>
                        <Col className='row_2' span={24}>
                            <SankeyModel mapValid={this.props.mapValid} />
                        </Col>
                    </Row>
                </Card>

            </>
        )

    }
}



