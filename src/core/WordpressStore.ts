import WPAPI = require( 'wpapi' );
import {ObservableMap, action, observable} from "mobx";
import {WPCategory, WPMedia, WPPost, WPTag} from "./Common";
import * as _ from "lodash";

/**
 * @author Dylan Vorster
 */
export class WordpressStore {

    api: any;
    posts: ObservableMap<WPPost>;
    categories: ObservableMap<WPCategory>;
    tags: ObservableMap<WPTag>;
    media: ObservableMap<WPMedia>;

    @observable
    currentPost: WPPost;

    constructor() {
        this.api = new WPAPI({endpoint: window.location.origin + '/wp-json'});
        this.posts = new ObservableMap();
        this.tags = new ObservableMap();
        this.categories = new ObservableMap();
        this.currentPost = null;
        this.media = new ObservableMap();
    }

    getFeatureImage(post): string {
        if (!post) {
            return;
        }

        // always try featured image first
        if (post.featured_media && this.media.has('' + post.featured_media)) {
            return this.media.get('' + post.featured_media).source_url;
        }

        // try linked images
        let media = this.mediaByPost(post);
        if (media.length > 0) {
            return _.first(media).source_url;
        }
    }

    setCurrentPost(post: WPPost) {
        this.currentPost = post;
    }

    run() {
        this.loadTags();
        this.loadCategories();
        this.loadPosts(1, 5);
    }

    categoriesByPost(post: WPPost): WPCategory[] {
        return _.filter(this.categories.values(), (cat) => {
            return post.categories.indexOf(cat.id) !== -1;
        });
    }

    categoryBySlug(name: string): WPCategory{
        return _.find(this.categories.values(),{slug: name});
    }

    tagBySlug(name: string): WPTag{
        return _.find(this.tags.values(),{slug: name});
    }

    tagsByPost(post: WPPost): WPTag[] {
        return _.filter(this.tags.values(), (tag) => {
            return post.tags.indexOf(tag.id) !== -1;
        });
    }

    postsByCategory(cat: WPCategory): WPPost[]{
        let posts = this.posts.values();
        if(!cat){
            return [];
        }
        return _.filter(posts, (post) => {
            return post.categories.indexOf(cat.id) !== -1;
        });
    }

    postsByTag(tag: WPTag): WPPost[]{
        let posts = this.posts.values();
        if(!tag){
            return [];
        }
        return _.filter(posts, (post) => {
            return post.tags.indexOf(tag.id) !== -1;
        });
    }

    postBySlug(slug: string): WPPost {
        return _.find(this.posts.values(), {slug: slug});
    }

    mediaByPost(post: WPPost): WPMedia[] {
        return _.filter(this.media.values(), {post: post.id});
    }

    mergeCategories(data: WPCategory[]) {
        _.forEach(data, (cat) => {
            this.categories.set('' + cat.id, cat);
        })
    }

    mergeMedia(data: WPMedia[]) {
        _.forEach(data, (media) => {
            this.media.set('' + media.id, media);
        })
    }

    mergeTags(data: WPTag[]) {
        _.forEach(data, (tag) => {
            this.tags.set('' + tag.id, tag);
        })
    }

    mergePosts(data: WPPost[]) {
        _.forEach(data, (post) => {
            if (post._embedded) {
                this.mergeMedia(post._embedded['wp:featuredmedia']);
                this.mergeCategories(post._embedded['wp:term'][0]);
                this.mergeTags(post._embedded['wp:term'][1]);
            }
            this.posts.set('' + post.id, post);
        })
    }

    loadFeatureImage(post: WPPost) {
        if (post.featured_media && !this.media.has('' + post.featured_media)) {
            return this.api.media().id(post.featured_media)
                .then((data: WPMedia) => {
                    this.media.set('' + data.id, data);
                })
        }
    }

    loadCategoryPosts(catSlug: string){ // rainworld :P
        let cat = this.categoryBySlug(catSlug);
        let promise = Promise.resolve(cat);
        if(!cat){
            promise = this.loadCategory(catSlug)
        }
        promise.then((tag: WPTag) => {
            this.api
                .posts()
                .order('desc')
                .orderby('date').param( 'categories', cat.id )
                .then((posts) => {
                    this.mergePosts(posts);
                })
        });
    }

    loadTagPosts(tagSlug: string){
        let tag = this.tagBySlug(tagSlug);
        let promise = Promise.resolve(tag);
        if(!tag){
            promise = this.loadTag(tagSlug)
        }
        promise.then((tag: WPTag) => {
            this.api
                .posts()
                .order('desc')
                .orderby('date').param( 'tags', tag.id )
                .then((posts) => {
                    this.mergePosts(posts);
                })
        });
    }

    loadMedia(post: WPPost) {
        this.api.media().parent(post.id).then(action((media: WPMedia[]) => {
            this.mergeMedia(media);
            this.loadFeatureImage(post);
        }))
    }

    loadPost(slug: string): Promise<WPPost> {
        return this.api.posts().slug(slug).embed()
            .then(action((data: WPPost[]) => {
                this.mergePosts(data);
                if (data.length > 0) {
                    return data[0];
                }
                return null;
            }))
    }

    loadPosts(page = 1, limit = 10) {
        return this.api
            .posts()
            .perPage(limit)
            .page(page)
            .order('desc')
            .orderby('date')
            .then(action((data: WPPost[]) => {
                this.mergePosts(data);
            }))
    }

    loadTag(slug: string): Promise<WPTag>{
        return this.api.tags().slug(slug).then((tags: WPTag[]) => {
            this.mergeTags(tags);
            return _.first(tags);
        });
    }

    loadTags() {
        this.api.tags()
            .then(action((data: WPTag[]) => {
                this.mergeTags(data);
            }))

    }

    loadCategories() {
        this.api.categories()
            .then(action((data: WPCategory[]) => {
                this.mergeCategories(data);
            }))
    }

    loadCategory(slug: string): Promise<WPCategory>{
        return this.api.categories().slug(slug).then((cats: WPCategory[]) => {
            this.mergeCategories(cats);
            return _.first(cats);
        });
    }

}