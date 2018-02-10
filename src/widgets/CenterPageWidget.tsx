import * as React from "react";
import {Application} from "../core/Application";
import {LoaderWidget} from "./LoaderWidget";
import {LinkWidget} from "./LinkWidget";
import {observer} from "mobx-react";

export interface CenterPageWidgetProps {
    name?: string;
    app: Application;
    left?: string;
    right?: string;
}

@observer
export class CenterPageWidget extends React.Component<CenterPageWidgetProps> {

    render() {
        return (
            <div className="exia-centerpage">
                {
                    this.props.left &&
                        <LinkWidget to={this.props.left}>
                            <div className="exia-centerpage__left">
                                <div className="fa fa-angle-left" />
                            </div>
                        </LinkWidget>
                }
                <div className="exia-centerpage__center">
                    {this.props.name && <div className="exia-centerpage__title">{this.props.name}</div>}
                    {this.getChildren()}
                </div>
                {
                    this.props.right &&
                        <LinkWidget to={this.props.right}>
                            <div className="exia-centerpage__right">
                                <div className="fa fa-angle-right" />
                            </div>
                        </LinkWidget>
                }
            </div>
        );
    }

    getChildren(){
        let children = this.props.children;
        if(React.Children.count(children) > 0){
            return children;
        }


        // show loader
        if(this.props.app.wpStore.loading){
            return (
                <div  className="exia-centerpage__loading">
                    <LoaderWidget />
                </div>
            )
        }

        // otherwise there is probably not
        return (
            <div  className="exia-centerpage__nothing">
                <div  className="exia-centerpage__sad">:(</div>
                <div  className="exia-centerpage__text">looks like there is no content here</div>
            </div>
        );
    }
}