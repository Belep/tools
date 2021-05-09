
import React, { Component } from 'react';
import { Input, Button, Row, Col } from 'antd';
import './App.css'
const { TextArea } = Input;

class SqlConvert extends Component {

    
    constructor() {
        super()
        this.state = {
            leftWidth: '45%',
            centerWidth: '10%',
            rightWidth: '45%',
            peddingRow: 15,
            paramRow: 7,
            resultRow: 25,
            peddingText: "",
            paramText: "",
            resultText: "",
            // 分隔符
            splitChar: ", ",
            // 占位符
            placeholder: "?",
            //需要添加双引号的数据类型
            stringChar: "(String)",
            // 左括号
            leftKh: "("
        }
    }

    doParseText = (sql, param) => {

        let paramData = param + ""
        let sqlData = sql + ""
        
        paramData.split(this.state.splitChar).forEach(e => {
            // 转换目标数据
            let leftIndex = e.indexOf(this.state.leftKh)
            let splitResult = e.substr(0, leftIndex)
            let lastStrIndex = e.lastIndexOf(this.state.stringChar)
            if (lastStrIndex >= 0) {
                splitResult = "\"" + splitResult + "\""
            }
            // 替换值
            sqlData = sqlData.replace(this.state.placeholder, splitResult)
        });
        this.setState({ resultText: sqlData })
    }

    doSqlChange = (sql) => {
        this.setState({ peddingText: sql })
    }

    doParamChange = (param) => {
        this.setState({ paramText: param })
    }

    render() {
        return (
            <div>
                {/* 一行三列 */}
                <Row justify="center">
                    <Col style={{ width: this.state.leftWidth }}>
                        <Row >
                            <Button type="text" style={{ width: '80%', fontWeight: "bold" }}>SQL</Button>
                        </Row>
                        <Row>
                            <TextArea
                                maxLength={5000}
                                style={{ width: '100%', resize: 'none' }}
                                placeholder="带有占位符的SQL"
                                showCount
                                rows={this.state.peddingRow}
                                onChange={e => this.doSqlChange(e.target.value)}
                            />
                        </Row>
                        <Row>
                            <Button
                                type="text"
                                style={{ width: '80%', fontWeight: "bold" }}
                            >参数</Button>
                        </Row>
                        <Row>
                            <TextArea
                                maxLength={5000}
                                style={{ width: '100%', resize: 'none' }}
                                placeholder="SQL参数"
                                showCount
                                rows={this.state.paramRow}
                                onChange={e => this.doParamChange(e.target.value)}
                            />
                        </Row>
                    </Col>
                    <Col style={{ width: this.state.centerWidth }}>
                        <Row align="middle" justify="center" style={{ height: "100%" }}>
                            <Button
                                type="primary"
                                style={{ width: '85%', fontWeight: "bold" }}
                                onClick={() => this.doParseText(this.state.peddingText, this.state.paramText)}
                            >&gt;&gt; 转换 &gt;&gt;</Button>
                        </Row>
                    </Col>
                    <Col style={{ width: this.state.rightWidth }}>
                        <Row align="middle" justify="center" style={{ height: "30px" }}>
                            <Button type="text" style={{ fontWeight: "bold" }}>结果</Button>
                        </Row>
                        <Row style={{ height: "100%" }}>
                            <TextArea
                                value={this.state.resultText}
                                maxLength={5000}
                                style={{ width: '100%', overflow: 'auto', resize: 'none' }}
                                placeholder="转换结果"
                                align='center'
                                rows={this.state.resultRow}
                                showCount
                            />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SqlConvert;