/*
 * @Date: 2022-07-21 10:17:01
 * @LastEditors: JZY
 * @LastEditTime: 2022-10-04 11:40:28
 * @FilePath: /visual/src/components/CoreModule/ScatterModel/index.jsx
 */

import React, { Component } from 'react'
import { Row, Col } from 'antd';
import Scatter from './Scatter';
import Bar from './Bar';
export default class ScatterModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        this.barChildRef.changeDeletePatches(p)
    }
    handleScatterChildEvent = (ref) => {
        this.scatterChildRef = ref
    }
    handleBarChildEvent = (ref) => {
        this.barChildRef = ref
    }

    changeBarRange = (id) => {
        this.barChildRef.changeBarRange(id)
    }
    changeChoosePatches = async (p) => {
        this.setState({
            choosePatches: p
        });
        this.props.changeChoosePatches(p);
    }
    render() {
        return (
            <>
                <Row gutter={5}>
                    <Col span={this.props.mapValid ? 24 : 19}>
                        <Scatter
                            changeBarRange={this.changeBarRange}
                            onChildEvent={this.handleScatterChildEvent}
                            ref={this.scatterChildRef}
                            patchId={this.state.patcheId}
                            imgId={this.state.imgId} />
                    </Col>

                    <Col span={5} id="BarChart" >
                        {
                            this.props.mapValid ? null : <Bar
                                changeChoosePatches={this.changeChoosePatches}
                                choosePatches={this.state.choosePatches}
                                onChildEvent={this.handleBarChildEvent}
                                ref={this.barChildRef} />
                        }

                    </Col>


                </Row>
            </>
        )
    }
}
