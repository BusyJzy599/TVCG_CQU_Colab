/*
 * @Date: 2022-04-18 00:21:54
 * @LastEditors: JZY
 * @LastEditTime: 2022-04-18 12:27:05
 * @FilePath: /visual/src/components/CardUtil/index.jsx
 */
import React, { Component } from 'react'
import { Switch } from 'antd';
import { Row, Col } from 'antd';
import { Menu, Dropdown } from 'antd';

const menu = (
    <Menu>
        <Menu.Item key="0">
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                Save
            </a>
        </Menu.Item>
        <Menu.Item key="1">
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                Share
            </a>
        </Menu.Item>
    </Menu>
);
export default class SaveAndReload extends Component {
    render() {
        return (
            <>
                <Row gutter={15}>
                <Col span={12}>
                        <Switch checkedChildren="U" unCheckedChildren="" defaultChecked  />
                    </Col>
                    <Col span={12}>
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{color:"azure"}}>
                                More
                            </a>
                        </Dropdown>
                    </Col>
                    
                </Row>

            </>
        )
    }
}