import * as React from "react";
import {Application} from "../core/Application";
import {observer} from "mobx-react";
import * as _ from "lodash";
import {PostWidget} from "../widgets/PostWidget";
import {CenterPageWidget} from "../widgets/CenterPageWidget";
import {PageProps} from "../core/Common";

export interface PostPageProps extends PageProps {
    app: Application;
    slug: string;
}

@observer
export class PostPage extends React.Component<PostPageProps> {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.app.wpStore.loadPost(this.props.slug)
            .then((post) => {
                if (post) {
                    this.props.app.wpStore.loadMedia(post);
                    this.props.app.wpStore.setCurrentPost(post);
                } else {
                    // try the page instead of the post
                    this.props.app.wpStore.loadPage(this.props.slug)
                        .then((page) => {
                            if (page) {
                                this.props.history.push('/page/' + this.props.slug);
                            }
                        })
                }
            })
    }

    render() {
        let post = this.props.app.wpStore.postBySlug(this.props.slug);

        return (
            <CenterPageWidget
                left={post && post.previous && post.previous.link}
                right={post && post.next && post.next.link} app={this.props.app}
            >
                {post && <PostWidget full={true} post={post} app={this.props.app}/>}
            </CenterPageWidget>
        );
    }
}