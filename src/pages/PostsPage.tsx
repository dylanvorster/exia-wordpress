import * as React from "react";
import {observer} from "mobx-react";
import * as _ from "lodash";
import {PostWidget} from "../widgets/PostWidget";
import {PageProps} from "../core/Common";
import {CenterPageWidget} from "../widgets/CenterPageWidget";

export interface PostsPageProps extends PageProps{
}

@observer
export class PostsPage extends React.Component<PostsPageProps>{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.app.wpStore.setCurrentPost(null);
        this.props.app.wpStore.loadPosts();
    }

    render(){
        return(
            <CenterPageWidget app={this.props.app}>
                {
                    _.map(this.props.app.wpStore.posts.values(), (post) => {
                        return (
                            <PostWidget full={false} key={post.id} post={post} app={this.props.app} />
                        );
                    })
                }
            </CenterPageWidget>
        );
    }
}