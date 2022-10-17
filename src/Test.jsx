/*
 * @Date: 2022-05-14 09:45:54
 * @LastEditors: JZY
 * @LastEditTime: 2022-07-28 09:53:03
 * @FilePath: /visual/src/Test.jsx
 */
import React, { Component } from "react";
import * as d3 from "d3";
import {
  RedoOutlined,
  FilterOutlined,
  ArrowLeftOutlined,
  HeatMapOutlined,
  AimOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Space,
  Switch,
  Select,
  Drawer,
  Empty,
  Tag,
  Image,
  Descriptions,
  Card,
  Spin,
  Divider,
} from "antd";

export default class MapVision extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Divider orientation="left">Align Top</Divider>
        <Row justify="center" align="top">
          <Col span={4}>
            <div style={{ height: "10vh", background: "red" }}>col-4</div>
          </Col>
          <Col span={4}>
            <div style={{ height: "20vh", background: "blue" }}>col-4</div>
          </Col>
          <Col span={4}>
            <div style={{ height: "10vh", background: "red" }}>col-4</div>
          </Col>
          <Col span={4}>
            <div style={{ height: "20vh", background: "blue" }}>col-4</div>
          </Col>
        </Row>
      </>
    );
  }
}
