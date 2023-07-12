import React from 'react';
import { createRoot } from 'react-dom/client';
import moment from 'moment';
import { ConfigProvider } from "antd";
import zhCN from 'antd/es/locale/zh_CN'
import App from "@/app";

import './environment'
import './style.less';

moment.locale('zh-cn');

// 勿删，目前来看 message组件需要此配置
ConfigProvider.config({
    prefixCls: 'main'
})

const container = document.querySelector('#react-main');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
    <React.StrictMode>
        <ConfigProvider
            locale={zhCN}
            prefixCls={'main'}>
            <App/>
        </ConfigProvider>
    </React.StrictMode>
);
