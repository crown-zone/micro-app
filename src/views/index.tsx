import { FC } from "react";

import Style from './style/index.less'
import { bootstrap } from "@/sandbox";

bootstrap()

// export const Index: FC = () => {
//     return <div className={Style.pluginContainer}>
//         {/*@ts-ignore*/}
//         <sandbox-container
//             style={{
//                 display: 'block',
//                 width: '100%',
//                 height: '100%',
//             }}
//             data-id='iframeXX'
//         />
//     </div>
// }

export const Index: FC = () => {
    return <div className={Style.pluginContainer}/>
}
