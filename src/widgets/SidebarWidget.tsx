import {Application} from "../core/Application";
import * as React from "react";
import * as _ from "lodash";
import {observer} from "mobx-react";
import {LinkWidget} from "./LinkWidget";
import {TagWidget} from "./TagWidget";

export interface SidebarWidgetProps{
    app: Application;
}

@observer
export class SidebarWidget extends React.Component<SidebarWidgetProps>{

    render(){

        let top = 0;
        let adminBar = document.querySelector('#wpadminbar');
        if(adminBar){
            top = adminBar.getBoundingClientRect().height;
        }

        return (
            <div className="exia-sidebar" style={{top: top}}>
                {
                    this.props.app.settings.customLogo &&
                    <LinkWidget to="/" >
                        <div className="exia-sidebar__custom-logo" style={{backgroundImage: 'url('+this.props.app.settings.customLogo+')'}} />
                    </LinkWidget>
                }
                <div className="exia-sidebar__section">
                    <div className="exia-sidebar__section-name">Categories</div>
                    {
                        _.map(this.props.app.wpStore.categories.values(),(cat) => {
                            return (
                                <LinkWidget  key={cat.id} to={cat.link} >
                                    <div key={cat.id} className="exia-sidebar__category">{cat.name}</div>
                                </LinkWidget>
                            );
                        })
                    }
                </div>

                <div className="exia-sidebar__section">
                    <div className="exia-sidebar__section-name">Tags</div>
                    <div className="exia-sidebar__tags">
                    {
                        _.map(_.take(_.orderBy(this.props.app.wpStore.tags.values(),['count'],['desc']), 20),(tag) => {
                            return (
                                <TagWidget key={tag.id} app={this.props.app} tag={tag} />
                            );
                        })
                    }
                    </div>
                </div>

                <div className="exia-sidebar__section">
                    <div className="exia-sidebar__section-name">Recent Posts</div>
                    {
                        _.map(_.take(this.props.app.wpStore.posts.values(), 5),(post) => {
                            return (
                                <LinkWidget  key={post.id} to={post.link} >
                                    <div className="exia-sidebar__post" dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                                </LinkWidget>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}