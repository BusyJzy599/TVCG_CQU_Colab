/*
 * @Date: 2022-05-31 10:47:38
 * @LastEditors: JZY
 * @LastEditTime: 2022-08-28 18:06:36
 * @FilePath: /visual/src/components/CoreModule/0Scatter/index.jsx
 */
import React, { Component } from 'react'
import * as d3 from "d3";
import { Row, Col, Radio, Typography, Spin } from 'antd';
import Scatter from './Scatter';

const { Text, Title } = Typography;
export default class HeatMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chooseClass: "LUSC",
            scatter: "scatterLUSC",
            patcheId: -1,
            imgId: -1,
            selectedPatch: -1,
            loading: true
        }
    }
    handleChildEvent = (ref) => {
        // 将子组件的实例存到 this.childRef 中, 这样整个父组件就能拿到
        this.childRef = ref
    }
    componentDidMount() {
        this.drawChart();
    }
    onChange = async (e) => {
        await this.setState({
            chooseClass: e.target.value,
            scatter: "scatter" + e.target.value,
            selectedPatch: -1
        }
        );
        await this.drawChart(e.target.value)
        this.childRef.changeScatter()

    };
    drawChart = (cl) => {
        var margin = { top: 5, right: 0, bottom: 50, left: 60 }
        var cellSize = 11;
        var colors = ['#e7f1ff', '#b3d2ed', '#5ca6d4', '#1970ba', '#0c3b80'];
        var patches = ['patch0',
            'patch1',
            'patch2',
            'patch3',
            'patch4',
            'patch5',
            'patch6',
            'patch7',
            'patch8',
            'patch9',
            'patch10',
            'patch11',
            'patch12',
            'patch13',
            'patch14',
            'patch15',
            'patch16',
            'patch17',
            'patch18',
            'patch19',
            'patch20',
            'patch21',
            'patch22',
            'patch23',
            'patch24',
            'patch25',
            'patch26',
            'patch27',
            'patch28',
            'patch29',
            'patch30',
            'patch31',
            'patch32',
            'patch33',
            'patch34',
            'patch35',
            'patch36',
            'patch37',
            'patch38',
            'patch39',
            'patch40',
            'patch41',
            'patch42',
            'patch43',
            'patch44',
            'patch45',
            'patch46',
            'patch47',
            'patch48',
            'patch49',
            'patch50',
            'patch51',
            'patch52',
            'patch53',
            'patch54',
            'patch55',
            'patch56',
            'patch57',
            'patch58',
            'patch59',
            'patch60',
            'patch61',
            'patch62',
            'patch63',
            'patch64',
            'patch65',
            'patch66',
            'patch67',
            'patch68',
            'patch69',
            'patch70',
            'patch71',
            'patch72',
            'patch73',
            'patch74',
            'patch75',
            'patch76',
            'patch77',
            'patch78',
            'patch79',
            'patch80',
            'patch81',
            'patch82',
            'patch83',
            'patch84',
            'patch85',
            'patch86',
            'patch87',
            'patch88',
            'patch89',
            'patch90',
            'patch91',
            'patch92',
            'patch93',
            'patch94',
            'patch95',
            'patch96',
            'patch97',
            'patch98',
            'patch99',
            'patch100',
            'patch101',
            'patch102',
            'patch103',
            'patch104',
            'patch105',
            'patch106',
            'patch107',
            'patch108',
            'patch109',
            'patch110',
            'patch111',
            'patch112',
            'patch113',
            'patch114',
            'patch115',
            'patch116',
            'patch117',
            'patch118',
            'patch119',
            'patch120',
            'patch121',
            'patch122',
            'patch123',
            'patch124',
            'patch125',
            'patch126',
            'patch127',
            'patch128',
            'patch129',
            'patch130',
            'patch131',
            'patch132',
            'patch133',
            'patch134',
            'patch135',
            'patch136',
            'patch137',
            'patch138',
            'patch139',
            'patch140',
            'patch141',
            'patch142',
            'patch143',
            'patch144',
            'patch145',
            'patch146',
            'patch147',
            'patch148',
            'patch149',
            'patch150',
            'patch151',
            'patch152',
            'patch153',
            'patch154',
            'patch155',
            'patch156',
            'patch157',
            'patch158',
            'patch159',
            'patch160',
            'patch161',
            'patch162',
            'patch163',
            'patch164',
            'patch165',
            'patch166',
            'patch167',
            'patch168',
            'patch169',
            'patch170',
            'patch171',
            'patch172',
            'patch173',
            'patch174',
            'patch175',
            'patch176',
            'patch177',
            'patch178',
            'patch179',
            'patch180',
            'patch181',
            'patch182',
            'patch183',
            'patch184',
            'patch185',
            'patch186',
            'patch187',
            'patch188',
            'patch189',
            'patch190',
            'patch191',
            'patch192',
            'patch193',
            'patch194',
            'patch195',
            'patch196',
            'patch197',
            'patch198',
            'patch199']
        var imgs = ['img_0',
            'img_1',
            'img_2',
            'img_3',
            'img_4',
            'img_5',
            'img_6',
            'img_7',
            'img_8',
            'img_9',
            'img_10',
            'img_11',
            'img_12',
            'img_13',
            'img_14',
            'img_15',
            'img_16',
            'img_17',
            'img_18',
            'img_19',
            'img_20',
            'img_21',
            'img_22',
            'img_23',
            'img_24',
            'img_25',
            'img_26',
            'img_27',
            'img_28',
            'img_29',
            'img_30',
            'img_31',
            'img_32',
            'img_33',
            'img_34',
            'img_35',
            'img_36',
            'img_37',
            'img_38',
            'img_39',
            'img_40',
            'img_41',
            'img_42',
            'img_43',
            'img_44',
            'img_45',
            'img_46',
            'img_47',
            'img_48',
            'img_49',
            'img_50',
            'img_51',
            'img_52',
            'img_53',
            'img_54',
            'img_55',
            'img_56',
            'img_57',
            'img_58',
            'img_59',
            'img_60',
            'img_61',
            'img_62',
            'img_63',
            'img_64',
            'img_65',
            'img_66',
            'img_67',
            'img_68',
            'img_69',
            'img_70',
            'img_71',
            'img_72',
            'img_73',
            'img_74',
            'img_75',
            'img_76',
            'img_77',
            'img_78',
            'img_79',
            'img_80',
            'img_81',
            'img_82',
            'img_83',
            'img_84',
            'img_85',
            'img_86',
            'img_87',
            'img_88',
            'img_89',
            'img_90',
            'img_91',
            'img_92',
            'img_93',
            'img_94',
            'img_95',
            'img_96',
            'img_97',
            'img_98',
            'img_99']
        var col_number = imgs.length;
        var row_number = patches.length;
        var width = cellSize * col_number
        var height = cellSize * row_number
        var legendElementWidth = cellSize * 2.5
        d3.select("#heatmap").selectAll("svg").remove()
        const svg = d3.select("#heatmap").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            ;

        if (cl == "LUSC") {
            var path = './data/data_heatmap.csv'
        } else {
            var path = './data/data_heatmap1.csv'
        }
        d3.csv(path).then(data => {
            var parent = this
            var colorScale = d3.scaleQuantile()
                .domain([0, 1])
                .range(colors);
            // 行
            svg.append("g")
                .selectAll(".patchesg")
                .data(patches)
                .enter()
                .append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("index", d => d)
                .attr("y", function (d, i) { return i * cellSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + cellSize / 2 + ")")
                .attr("class", function (d, i) { return "patches mono r" + i; })
                .on("mouseover", function (d) { d3.select(this).classed("text-hover", true); })
                .on("mouseout", function (d) { d3.select(this).classed("text-hover", false); })
                .on("click", function (d) {
                    if (d3.select(this).classed("text-selected") == false) {
                        d3.selectAll(".patches").classed("text-selected", false);
                        d3.select(this).classed("text-selected", true);
                        var index = this.getAttribute('index').split("patch")[1]
                    } else {
                        d3.select(this).classed("text-selected", false);
                        var index = -1
                    }
                    parent.setState({
                        selectedPatch: index,
                        patcheId: -1,
                        imgId: -1,
                    })
                    parent.childRef.changeScatter()
                })
            //列
            // svg.append("g")
            //     .selectAll(".imgsg")
            //     .data(imgs)
            //     .enter()
            //     .append("text")
            //     .text(function (d) { return d; })
            //     .attr("x", 0)
            //     .attr("y", function (d, i) { return i * cellSize; })
            //     .style("text-anchor", "left")
            //     .attr("transform", "translate(" + cellSize / 2 + ",-6) rotate (-90)")
            //     .attr("class", function (d, i) { return "imgs mono c" + i; })
            //     .on("mouseover", function (d) { d3.select(this).classed("text-hover", true); })
            //     .on("mouseout", function (d) { d3.select(this).classed("text-hover", false); });
            svg.append("g").attr("class", "g3")
                .selectAll(".cellg")
                .data(data, function (d) { return d.patch_id + ":" + d.img_id; })
                .enter()
                .append("rect")
                .attr("x", function (d) { return (d.img_id) * cellSize; })
                .attr("y", function (d) { return (d.patch_id) * cellSize; })
                .attr("row_id", d => d.patch_id)
                .attr("col_id", d => d.img_id)
                .attr("val", d => d.value)
                .attr("class", function (d) { return "cell cell-border cr" + (d.patch_id) + " cc" + (d.img_id); })
                .attr("width", cellSize)
                .attr("height", cellSize)
                .style("fill", function (d) { return colorScale(d.value); })
                .on("click", function (d) {

                    parent.setState({
                        patcheId: this.getAttribute('row_id'),
                        imgId: this.getAttribute('col_id')
                    })
                    parent.childRef.changeScatter()
                })
                .on("mouseover", function (d) {
                    //highlight text
                    d3.select(this).classed("cell-hover", true);
                    var rr = this.getAttribute('row_id');
                    var cc = this.getAttribute('col_id');
                    var vv = parseFloat(this.getAttribute('val')).toFixed(3)
                    d3.selectAll(".patches").classed("text-highlight", function (r, ri) { return ri == rr; });
                    d3.selectAll(".imgs").classed("text-highlight", function (c, ci) { return ci == cc; });
                    //Update the tooltip position and value
                    d3.select("#tooltip")
                        .style("left", (d.layerX + 10) + "px")
                        .style("top", (d.layerY + 10) + "px")
                        .select("#value")
                        .text("\tPatch:\t" + rr + "\tImg:\t" + cc + "\tValue:\t" + vv) //Show the tooltip
                    d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function () {
                    d3.select(this).classed("cell-hover", false);
                    d3.selectAll(".patches").classed("text-highlight", false);
                    d3.selectAll(".imgs").classed("text-highlight", false);
                    d3.select("#tooltip").classed("hidden", true);
                })
                ;

            var legend = svg.selectAll(".legend")
                .data([0, 0.2, 0.4, 0.6, 0.8, 1])
                .enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function (d, i) { return legendElementWidth * i + 300; })
                .attr("y", height + (cellSize * 2))
                .attr("width", legendElementWidth)
                .attr("height", cellSize)
                .style("fill", function (d, i) { return colors[i]; });

            legend.append("text")
                .attr("class", "mono")
                .text(function (d) { return d; })
                .attr("width", legendElementWidth)
                .attr("x", function (d, i) { return legendElementWidth * i + 300; })
                .attr("y", height + (cellSize * 4));


        })
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 1000);
    }


    render() {
        return (
            <>
                <Spin size="large" spinning={this.state.loading}>
                    <Row gutter={10}>
                        <Col span={24}>
                            <Title level={4}>Scatter for CC Grade:</Title>
                        </Col>
                        <Col span={24}>
                            <Row gutter={10}>
                                <Scatter id={this.state.scatter} onChildEvent={this.handleChildEvent} ref={this.childRef} patchId={this.state.patcheId} imgId={this.state.imgId} selectedPatch={this.state.selectedPatch} />
                            </Row>
                        </Col>
                        <Col span={24} >
                            <Title level={4}>HeatMap For each Patch:&nbsp;
                                <Radio.Group onChange={this.onChange} value={this.state.chooseClass}>
                                    <Radio value="LUSC">LUSC</Radio>
                                    <Radio value="LUAD">LUAD</Radio>
                                </Radio.Group>
                            </Title>
                            <div id="tooltip" className='hidden' >
                                <p><span id="value" /></p>
                            </div>
                            <div id='heatmap' style={{ height: '30vh', overflowY: 'auto', overflowX: 'auto', marginRight: 10 }}>

                            </div>
                        </Col>

                    </Row>
                </Spin>


            </>

        )
    }
}
