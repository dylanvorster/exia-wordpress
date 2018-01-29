import * as React from "react";
import {Application} from "../core/Application";
import {observer} from "mobx-react";
import * as _ from "lodash";
import {PostWidget} from "../widgets/PostWidget";
import {CenterPageWidget} from "../widgets/CenterPageWidget";

export interface PostPageProps{
    app: Application;
    slug:string;
}

@observer
export class PostPage extends React.Component<PostPageProps>{

    constructor(props){
        super(props);
    }


    componentDidMount(){
        this.props.app.wpStore.loadPost(this.props.slug)
            .then((post) => {
                if(post){
                    this.props.app.wpStore.loadMedia(post);
                    this.props.app.wpStore.setCurrentPost(post);
                }
            })
    }

    render(){
        let post = this.props.app.wpStore.postBySlug(this.props.slug);
        return(
            <CenterPageWidget>
                {post && <PostWidget full={true} post={post} app={this.props.app} />}
            </CenterPageWidget>
        );
    }
}