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
                    {this.getChildren()}
                </div>
                <div className="exia-centerpage__right">

                </div>
            </div>
        );
    }

    getChildren(){
        let children = this.props.children;
        if(React.Children.count(children) > 0){
            return children;
        }

        return (
            <div  className="exia-centerpage__nothing">
                <div  className="exia-centerpage__sad">:(</div>
                <div  className="exia-centerpage__text">looks like there is no content here</div>
            </div>
        );
    }
}