import React from "react";

export class ErrorBoundary extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {hasError: false};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(errorInfo)
    }

    render() {
        return this.props.children;
    }
}
