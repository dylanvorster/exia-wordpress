import * as React from "react";
import {WPPost} from "../core/Common";
import {Application} from "../core/Application";
import * as _ from "lodash";
import {TagWidget} from "./TagWidget";
import {observer} from "mobx-react";
import {LinkWidget} from "./LinkWidget";
import * as moment from "moment";
import * as ReactDOM from "react-dom";
import {GalleryWidget} from "./GalleryWidget";


export interface PostWidgetProps{
    post: WPPost;
    app: Application;
    full: boolean;
}

@observer
export class PostWidget extends React.Component<PostWidgetProps>{

    ref: HTMLDivElement;
    portals: JSX.Element[];

    constructor(props){
        super(props);
        this.portals = [];
    }

    getContent(){
        let content = {__html: this.props.post.excerpt.rendered};
        if(this.props.full){
            content = {__html: this.props.post.content.rendered};
        }

        return (
            <div ref={(ref) => {
                this.ref = ref;
            }} className="exia-post__content" dangerouslySetInnerHTML={content} />
        );
    }

    componentDidMount(){

        let featured = this.props.app.wpStore.getFeatureImage(this.props.post);
        if(!featured){
            this.props.app.wpStore.loadFeatureImage(this.props.post);
        }

        // setup the gallery portals
        let galleries = this.ref.querySelectorAll('.exia-gallery-placeholder');
        for (var i = 0; i < galleries.length; i++) {
            let gallery = galleries[i];

            // get all the images
            let images = gallery.querySelectorAll('[data-id]');
            let imagePayload = {};
            for (var j = 0; j < images.length; j++) {
                imagePayload[images[j].getAttribute('data-id')] = {
                    medium: images[j].getAttribute('data-medium'),
                    large: images[j].getAttribute('data-large'),
                };
            }

            this.portals.push(ReactDOM.createPortal(<GalleryWidget light={gallery.getAttribute('data-light') === 'true'} app={this.props.app} images={imagePayload} />, gallery));
        }
        this.forceUpdate();
    }

    render(){
        let featured = this.props.app.wpStore.getFeatureImage(this.props.post);
        return (
            <div className="exia-post">
                {
                    this.portals
                }
                {
                     this.props.post.featured_media > 0 && <div onClick={() => {
                         this.props.app.galleryImages = [featured];
                         this.props.app.gallerySelectedImage = 0;
                     }} className="exia-post__featured" style={{backgroundImage: 'url('+featured+')'}} />
                }
                <div className="exia-post__top">
                    <div className="exia-post__meta">
                        <div className="exia-post__categories">
                            {
                                _.map(this.props.app.wpStore.categoriesByPost(this.props.post), (cat) => {
                                    return (
                                        <LinkWidget to={cat.link}>
                                            <div key={cat.id} className="exia-post__category">{cat.name}</div>
                                        </LinkWidget>
                                    );
                                })
                            }
                        </div>
                        <div className="exia-post__date">
                            {
                                moment(this.props.post.date).fromNow()
                            }
                        </div>
                        <div className="exia-post__tags">
                            {
                               _.map(this.props.app.wpStore.tagsByPost(this.props.post), (tag) => {
                                   return (
                                       <TagWidget key={tag.id} app={this.props.app} tag={tag}/>
                                   );
                               })
                            }
                        </div>
                    </div>
                    <LinkWidget to={this.props.post.link}>
                        <div className="exia-post__title" dangerouslySetInnerHTML={{__html: this.props.post.title.rendered}} />
                    </LinkWidget>
                </div>
                {
                    this.getContent()
                }
                <div className="exia-post__bottom">
                </div>
            </div>
        );
    }

}