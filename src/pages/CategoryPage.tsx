import * as React from "react";
import {Application} from "../core/Application";
import {observer} from "mobx-react";
import * as _ from "lodash";
import {PostWidget} from "../widgets/PostWidget";
import {CenterPageWidget} from "../widgets/CenterPageWidget";

export interface TagPageProps {
    app: Application;
    category: string;
}

@observer
export class CategoryPage extends React.Component<TagPageProps> {

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.props.app.wpStore.setCurrentPost(null);
        this.props.app.wpStore.loadCategoryPosts(this.props.category);
    }

    render() {
        return (
            <CenterPageWidget name={"Category: " + this.props.category}>
                {
                    _.map(this.props.app.wpStore.postsByCategory(this.props.app.wpStore.categoryBySlug(this.props.category)), (post) => {
                        return (
                            <PostWidget full={false} key={post.id} post={post} app={this.props.app}/>
                        );
                    })
                }
            </CenterPageWidget>
        );
    }
}