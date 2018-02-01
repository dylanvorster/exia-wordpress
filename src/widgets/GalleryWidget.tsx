import * as React from "react";
import {Application} from "../core/Application";
import {observer} from "mobx-react";
import * as _ from "lodash";

var Masonry = require('react-masonry-component');

export interface GalleryWidgetProps {
    app: Application;
    images: { [id: string]: {large: string, medium: string} };
    light: boolean;
}

export interface GalleryWidgetState {
}

@observer
export class GalleryWidget extends React.Component<GalleryWidgetProps, GalleryWidgetState> {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let i = -1;
        return (
            <Masonry options={{transitionDuration: '0s'}} className={"exia-gallery"+(this.props.light?' exia-gallery--light':'')}>
                {
                    _.map(this.props.images, (image, id) => {
                        i++;
                        let index = i +0;
                        return (
                            <img onClick={() => {
                                this.props.app.galleryImages = _.map(this.props.images,'large');
                                this.props.app.gallerySelectedImage = index;
                            }} key={id}
                                 className={"exia-gallery__image"}
                                 src={image.large}/>
                        );
                    })
                }
            </Masonry>
        );
    }
}