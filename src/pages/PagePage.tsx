import {Application} from "../core/Application";
import * as React from "react";
import {CenterPageWidget} from "../widgets/CenterPageWidget";
import {PostWidget} from "../widgets/PostWidget";

export interface PagePageProps{
    app: Application;
    page: string;
}

export class PagePage extends React.Component<PagePageProps>{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.app.wpStore.loadPage(this.props.page)
            .then((page) => {
                if(page){
                    this.props.app.wpStore.loadMedia(page);
                    this.props.app.wpStore.setCurrentPost(page);
                }
            })
    }

    render(){
        let page = this.props.app.wpStore.pageBySlug(this.props.page);
        return(
            <CenterPageWidget>
                {page && <PostWidget full={true} post={page} app={this.props.app} />}
            </CenterPageWidget>
        );
    }

}