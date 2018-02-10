import {Application} from "./Application";

export interface PageProps {
    app: Application;
    history: {
        push: (path: string) => any;
    }
}

export interface WPEntity {
    id: number;
}

export interface WPPost extends WPEntity {
    _embedded:{
        'wp:term':[
            WPCategory[],
            WPTag[]
        ];
        'wp:featuredmedia':WPMedia[];
    };
    slug: string;
    format: string;
    link: string;
    content: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    }
    featured_media: number;
    date: string;
    categories: number[];
    tags: number[];
    title: {
        rendered: string;
    };
    previous: {
        id: string;
        link: string;
    };
    next:{
        id: string;
        link: string;
    };
}

export interface WPCategory extends WPEntity {
    name: string;
    slug: string;
    count: number;
    link: string;
}

export interface WPTag extends WPEntity {
    name: string;
    slug: string;
    count: number;
    link: string;
}

export interface WPMedia extends WPEntity {
    source_url: string;
    media_details: {
        sizes: {
            [size: string]: {
                source_url: string;
                width: number;
                height: number;
            }
        }
    }
}