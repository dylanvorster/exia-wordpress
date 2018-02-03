import * as React from "react";

export interface CenterPageWidgetProps {
    name?: string;
}

export class CenterPageWidget extends React.Component<CenterPageWidgetProps> {

    render() {
        return (
            <div className="exia-centerpage">
                <div className="exia-centerpage__left">

                </div>
                <div className="exia-centerpage__center">
                    {this.props.name && <div className="exia-centerpage__title">{this.props.name}</div>}
                    {this.props.children}
                </div>
                <div className="exia-centerpage__right">

                </div>
            </div>
        );
    }
}