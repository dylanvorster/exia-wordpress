import * as React from "react";
import {PostsPage} from "../pages/PostsPage";
import {Switch, Route} from "react-router-dom";
import {PostPage} from "../pages/PostPage";
import {PagePage} from "../pages/PagePage";
import {SidebarWidget} from "./SidebarWidget";
import {observer} from "mobx-react";
import {Application} from "../core/Application";
import {withRouter} from "react-router";
import {ModalGalleryWidget} from "./ModalGalleryWidget";
import {TagPage} from "../pages/TagPage";
import {CategoryPage} from "../pages/CategoryPage";

export interface BodyWidgetProps {
    app: Application;
}

export interface BodyWidgetState {
    showMenu: boolean;
}

@observer
class BodyWidget extends React.Component<BodyWidgetProps, BodyWidgetState> {

    constructor(props: BodyWidgetProps) {
        super(props);
        this.state = {
            showMenu: false
        };
    }

    generateRoute(path: string, page: any) {
        return (
            <Route exact={true} path={path} render={(match: any) => {
                return React.createElement(page, {
                    ...match.match.params,
                    location: match.location,
                    history: match.history,
                    key: JSON.stringify(match.match.params),
                    app: this.props.app
                })
            }}/>
        );
    }


    render() {
        let top = 0;
        let adminBar = document.querySelector('#wpadminbar');
        if (adminBar) {
            top = adminBar.getBoundingClientRect().height;
        }

        let style = {};
        let image = this.props.app.wpStore.getFeatureImage(this.props.app.wpStore.currentPost);
        if (image) {
            style['backgroundImage'] = 'url(' + image + ')';
        }

        return (
            <Switch>
                <div className="exia-body">
                    <div onClick={() => {
                        this.setState({showMenu: !this.state.showMenu});
                    }} className="exia-body__mobile-menu">
                        <i className={"fa " + (this.state.showMenu ? 'fa-close' : 'fa-bars')}/>
                    </div>
                    <div className="exia-body__back" style={style}/>
                    <div className="exia-body__front" style={{top: top}}>
                        <SidebarWidget
                            pressed={() => {
                                if (this.state.showMenu) {
                                    this.setState({showMenu: false});
                                }
                            }}
                            show={this.state.showMenu}
                            app={this.props.app}
                        />
                        {this.generateRoute('/', PostsPage)}
                        {this.generateRoute('/:slug', PostPage)}
                        {this.generateRoute('/page/:page', PagePage)}
                        {this.generateRoute('/:year/:month/:day/:slug', PostPage)}
                        {this.generateRoute('/tag/:tag', TagPage)}
                        {this.generateRoute('/category/:category', CategoryPage)}
                    </div>
                    {
                        this.props.app.galleryImages.length > 0 &&
                        <ModalGalleryWidget app={this.props.app}/>
                    }
                </div>
            </Switch>
        );
    }
}

export default withRouter(BodyWidget as any);