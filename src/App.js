import { Tabs } from 'antd';
import SqlConvert from './SqlConvert';
import SqlToMd from './SqlToMd';
const { TabPane } = Tabs;

function App() {
  return (
    <Tabs type="card">
      <TabPane tab="SQL转换" key="1">
        <SqlConvert />
      </TabPane>
      <TabPane tab="SQL-TO-MD" key="2">
        <SqlToMd />
      </TabPane>
    </Tabs>
  );
}

export default App;
