import React from "react";
import Style from './app.less'
import { HashRouter, Route, Routes } from "react-router-dom";
import { Index } from "@/views";
import { ErrorBoundary } from "@/error-boundary";

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <div className={Style.__main__view__}>
                <div className={Style.__main__header__}/>
                <HashRouter>
                    <div className={Style.__main__container__}>
                        <Routes>
                            <Route path={'*'} element={<Index/>}/>
                        </Routes>
                    </div>
                </HashRouter>
            </div>
        </ErrorBoundary>
    );
}

export default App
