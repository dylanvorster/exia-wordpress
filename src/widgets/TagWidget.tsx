import {WPTag} from "../core/Common";
import {LinkWidget} from "./LinkWidget";
import * as React from "react";
import {Application} from "../core/Application";
import {observer} from "mobx-react";

export interface TagWidgetProps{
    tag: WPTag;
    app: Application;
}

@observer
export class TagWidget extends React.Component<TagWidgetProps>{

    render(){

        let selected = false;
        let currentPost = this.props.app.wpStore.currentPost;
        if(currentPost && currentPost.tags.indexOf(this.props.tag.id) !== -1){
            selected = true;
        }

        return (
            <LinkWidget to={this.props.tag.link}>
                <div className={"exia-tag"+(selected?' exia-tag--selected':'')}>{this.props.tag.name}</div>
            </LinkWidget>
        );
    }

}