/*
 * @Date: 2022-07-21 10:17:01
 * @LastEditors: JZY
 * @LastEditTime: 2022-08-28 18:37:28
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
        this.barChildRef.changeDeletePatches(p)
    }
    handleScatterChildEvent = (ref) => {
        this.scatterChildRef = ref
    }
    handleBarChildEvent = (ref) => {
        this.barChildRef = ref
    }
    onChange = async (e) => {
        await this.setState({
            chooseClass: e.target.value,
            scatter: "scatter" + e.target.value,
            selectedPatch: -1
        }
        );
        await this.drawChart(e.target.value);
        this.childRef.changeScatter()

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
                        <Scatter
                            id={this.state.scatter}
                            changeBarRange={this.changeBarRange}
                            onChildEvent={this.handleScatterChildEvent}
                            ref={this.scatterChildRef}
                            patchId={this.state.patcheId}
                            imgId={this.state.imgId} />
                    </Col>

                    <Col span={5} id="BarChart" >
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
