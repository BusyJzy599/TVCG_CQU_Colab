import React, { Component } from 'react'
import { Row, Col, Card, Typography, Spin, Image, Button, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MapVision from './MapVision';
import BarVision from './BarVision';


const { Text, Title } = Typography;
const imgs = [0, 1, 2, 3, 4, 5, 6, 7, 8]
const gridStyle = {
    textAlign: 'center',
    display: "block",
    height: '22vh'
};


export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            show: props.showIndex,
            selectedPatches:props.Patches
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    getSelectPatches=(p)=>{
        this.setState({
            selectedPatches:p
        })
    }
    toGrid = () => {
        this.setState({ show: 1 })
    }
    toBase = () => {
        this.setState({ show: 0 })
    }
    chooseImg = (e) => {
        this.setState({ loading: true })
        setTimeout(() => {
            // console.log(e.target.id);
            imgs.map((item, index) => { document.getElementById("childCard" + index).style.visibility = "hidden" })
            // this.setState({ hide: false, showMap: true })
            this.setState({ show: 2 })
        }, 0);
    }

    getBack = () => {
        // this.setState({ hide: true, showMap: false })
        this.setState({ show: 1 })
    }
    setLoading = () => {
        this.setState({ loading: false })
    }
    render() {
        return (
            // <Card bordered={false} hoverable={true}>
            <Row>
                <Spin size="large" spinning={this.state.loading}>
                    <Col span={24} style={{ height: '72vh' }}>
                        {
                            this.state.show == 0 ? <>
                                <BarVision getSelectPatches={this.getSelectPatches} patches={this.state.selectedPatches}/>
                                <br></br>
                                <Row gutter={[20]}>
                                    <Col span={19}></Col>
                                    <Col><Button type="primary" onClick={this.toGrid}>Click for More</Button></Col>
                                </Row>

                            </> : null
                        }
                        {
                            this.state.show == 1 ?
                                <>
                                    <Title level={4}>
                                        <Button type="text" icon={<ArrowLeftOutlined />} onClick={this.toBase}></Button>
                                        &nbsp;Selected 9 Grids
                                    </Title>
                                    {
                                        imgs.map((item, index) => {

                                            return <Card.Grid className='childCard' id={'childCard' + index} key={'childCard' + index} style={gridStyle} onClick={this.chooseImg}>
                                                <Row>
                                                    <Col span={16}>
                                                        <Image
                                                            width="72% "
                                                            src={"./data/1/v_" + index + "_" + index + ".png"}
                                                        />
                                                    </Col>
                                                    <Col span={8}>
                                                        <Text>Score:</Text>
                                                        <Text type="secondary">0.62</Text><br />
                                                        <Text>Rank:</Text>
                                                        <Text type="secondary">No.{index}</Text><br />
                                                        <Text type="secondary">......</Text>
                                                    </Col>
                                                </Row>

                                            </Card.Grid>

                                        })
                                    }</> : null
                        }
                        {
                            this.state.show == 2 ? <MapVision hide={this.state.show != 2} back={this.getBack} load={this.setLoading} /> : null
                        }
                    </Col>
                </Spin>
                <Divider />
                <Col span={24}>
                    <div>More functions are in the works ...</div>
                </Col>
            </Row>


            // </Card>
        )
    }
}
