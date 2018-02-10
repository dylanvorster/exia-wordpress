import * as React from "react";
import {Application} from "../core/Application";
import {observer} from "mobx-react";
import * as _ from "lodash";
import {PostWidget} from "../widgets/PostWidget";
import {CenterPageWidget} from "../widgets/CenterPageWidget";

export interface CategoryPageProps {
    app: Application;
    category: string;
}

export interface CategoryPageState {
    page: number;
}

@observer
export class CategoryPage extends React.Component<CategoryPageProps, CategoryPageState> {

    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
    }


    componentDidMount() {
        this.props.app.wpStore.setCurrentPost(null);
        this.props.app.wpStore.loadCategoryPosts(this.props.category);
    }

    render() {
        return (
            <CenterPageWidget showMore={() => {
                this.setState({page: this.state.page + 1}, () => {
                    this.props.app.wpStore.loadCategoryPosts(this.props.category, this.state.page);
                })
            }} app={this.props.app} name={"Category: " + this.props.category}>
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