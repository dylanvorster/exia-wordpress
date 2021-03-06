import * as React from "react";
import {Application} from "../core/Application";
import {observer} from "mobx-react";
import * as _ from "lodash";
import {PostWidget} from "../widgets/PostWidget";
import {CenterPageWidget} from "../widgets/CenterPageWidget";

export interface TagPageProps {
    app: Application;
    tag: string;
}

export interface TagPageState {
    page: number;
}

@observer
export class TagPage extends React.Component<TagPageProps, TagPageState> {

    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
    }


    componentDidMount() {
        this.props.app.wpStore.setCurrentPost(null);
        this.props.app.wpStore.loadTagPosts(this.props.tag);
    }

    render() {
        return (
            <CenterPageWidget showMore={() => {
                this.setState({page: this.state.page + 1}, () => {
                    this.props.app.wpStore.loadTagPosts(this.props.tag, this.state.page);
                })
            }} app={this.props.app} name={"Tag: " + this.props.tag}>
                {
                    _.map(this.props.app.wpStore.postsByTag(this.props.app.wpStore.tagBySlug(this.props.tag)), (post) => {
                        return (
                            <PostWidget full={false} key={post.id} post={post} app={this.props.app}/>
                        );
                    })
                }
            </CenterPageWidget>
        );
    }
}