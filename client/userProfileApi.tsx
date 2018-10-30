import apiExecute from '../common/apiExecute';
import { INewsFeedPost, IRepost } from './entities/index';

const getPostById = (postId: number): Promise<IRepost> => { // to get repost
    return apiExecute(`/api/user/newsfeed/posts/${postId}`, 'GET', '')
        .then(response => {
            if (response.item) {
                return Promise.resolve(response.item);
            } else {
                return Promise.reject(response.item);
            }
        })
        .catch(err => Promise.reject(err));
};

const addNewsFeedPost = (model: any): Promise<INewsFeedPost> => {
    return apiExecute(`/api/user/newsfeed/posts`, 'POST', model)
        .then(response => {
            if (response.item) {
                return Promise.resolve(response.item);
            } else {
                return Promise.reject(response.item);
            }
        })
        .catch(err => Promise.reject(err));
}

const getAllCommentsByPost = (postId: number, offset: number): Promise<any> => {
    return apiExecute(`/api/user/newsfeed/comments/post/${postId}/${offset}`, 'GET', '')
        .then(response => {
            if (response.item) {
                return Promise.resolve(response.item);
            } else {
                return Promise.reject(response.item);
            }
        })
        .catch(err => Promise.reject(err));
}

const addPostComment = (model: any): Promise<number> => {
    return apiExecute(`/api/user/newsfeed/comments`, 'POST', model)
        .then(response => {
            if (response.item) {
                return Promise.resolve(response.item);
            } else {
                return Promise.reject(response.item);
            }
        })
        .catch(err => Promise.reject(err));
}

export const userProfileApi = {
    getPostById,
    addNewsFeedPost,
    getAllCommentsByPost,
    addPostComment
};