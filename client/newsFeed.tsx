import * as React from 'react';
import * as toastr from 'toastr';
import { connect } from 'react-redux';
import { IPostLikeComment, IRepost, IPostComment, INewsFeedPost } from '../entities';
import { userProfileApi } from './userProfileApi';
import { PostFooter, PostBody, PostHeader } from './newsFeedPost';
import { NewsFeedRepostForm } from './newsFeedRepostForm';
import { PostComment } from './newsFeedComment';

const mapStateToProps = (state) => ({
    currentUser: state.user
});

// list of posts/reposts are passed as props
interface INewsFeedProps {
    currentUser: any;
    newsFeedPosts: IPostLikeComment[];
    reposts: IRepost[];
    resetNewsFeed: () => void;
    onLikePostClicked: (postId: number, index: number) => void;
    onUnlikePostClicked: (postId: number, index: number) => void;
    redirectProfileClicked: (profileId: number) => void;
}

interface INewsFeedState {
    showRepostModal: boolean;
    repost: IRepost;
    newsFeedRepost: INewsFeedPost;
    commentsPosts: any;
}

class NewsFeed extends React.Component<INewsFeedProps, INewsFeedState> {
    constructor(props: INewsFeedProps) {
        super(props);
        this.state = {
            showRepostModal: false,
            commentsPosts: {},
            newsFeedRepost: {
                id: 0,
                feedText: "",
                feedImgUrl: "",
                feedRepostId: 0,
                createdById: 0,
                createdDate: new Date(),
                modifiedById: 0,
                modifiedDate: new Date()
            },
            repost: {
                postId: 0,
                profileId: 0,
                firstName: "",
                lastName: "",
                avatarUrl: "",
                feedText: "",
                feedImgUrl: "",
                createdDate: new Date()
            }
        };
    }

    getCommentsByPost = (postId: number) => {
        let postComments = { ...this.state.commentsPosts }, offset = 0;
        // if comments already shown, set offset to current count of displayed comments
        if (postComments[postId])
            offset = postComments[postId].cmtDisplayCount;
        userProfileApi.getAllCommentsByPost(postId, offset)
            .then(response => {
                let newPostCmts = {};
                if (offset === 0)
                    newPostCmts = this.insertCmtsItem(response, postId);
                else
                    newPostCmts = this.updateCmtsItem(response, postId);
                this.setState({ commentsPosts: newPostCmts });
            })
            .catch(err => toastr.error("Couldn't load comments for this post"));
    }

    // initializes/creates new comment item property with given post id as key
    insertCmtsItem = (data: IPostComment, postId: number) => {
        let cmts = { ...this.state.commentsPosts };
        let item = {
            [postId]: {
                comments: [].concat(data.comments),
                cmtDisplayCount: data.comments.length,
                totalCmts: data.totalCmts,
                cmtField: "",
                showCmts: true
            }
        }
        return Object.assign(cmts, item);
    }

    // updates existing comment item property with given post id as key
    updateCmtsItem = (data: IPostComment, postId: number) => {
        let cmts = { ...this.state.commentsPosts };
        cmts[postId] = {
            ...cmts[postId],
            comments: cmts[postId].comments.concat(data.comments),
            cmtDisplayCount: cmts[postId].cmtDisplayCount + data.comments.length,
            totalCmts: data.totalCmts
        }
        return cmts;
    }

    onCommentFieldChange = (fieldName: string, fieldValue: string, postId: number) => {
        let cmts = { ...this.state.commentsPosts };
        cmts[postId] = {
            ...cmts[postId],
            [fieldName]: fieldValue
        }
        this.setState({ commentsPosts: cmts });
    }

    onRepostChange = (fieldName: string, fieldValue: string) => {
        let nextState = {
            ...this.state,
            newsFeedRepost: {
                ...this.state.newsFeedRepost,
                [fieldName]: fieldValue,
            }
        };
        this.setState(nextState);
    }

    onCommentsClicked = (postId: number) => {
        let postComments = { ...this.state.commentsPosts };
        if (!postComments[postId]) {
            this.getCommentsByPost(postId);
        }
        else {
            if (postComments[postId].showCmts) {
                postComments[postId].showCmts = false;
                this.setState({ commentsPosts: postComments });
            } else {
                postComments[postId].showCmts = true;
                this.setState({ commentsPosts: postComments });
            }
        }
    }

    // retrieves post info to populate/display modal with repost form
    onRepostClicked = (postId: number) => {
        let nextState = {
            ...this.state,
            newsFeedRepost: {
                ...this.state.newsFeedRepost,
                feedText: "",
                feedRepostId: postId
            }
        }
        this.setState(nextState);
        userProfileApi.getPostById(postId)
            .then(response => this.setState({ repost: response, showRepostModal: true }))
            .catch(err => toastr.error("Something went wrong... Could not load post."));
    }

    onCommentSubmit = (postId: number) => {
        userProfileApi.addPostComment({ commentText: this.state.commentsPosts[postId].cmtField, newsFeedPostId: postId })
            .then(response => {
                let cmts = { ...this.state.commentsPosts };
                cmts[postId] = { ...cmts[postId], cmtField: "" };
                toastr.success("Successfully added comment");
                this.setState({ commentsPosts: cmts }, () => this.getCommentsByPost(postId))
            })
            .catch(err => toastr.error("Something went wrong... Could not upload comment"));
    }

    onRepostSubmit = () => {
        userProfileApi.addNewsFeedPost(this.state.newsFeedRepost)
            .then(response => {
                let resetPost = { ...this.state.newsFeedRepost, feedText: "", feedRepostId: 0 };
                this.setState({ newsFeedRepost: resetPost, commentsPosts: {} }, () => {
                    toastr.success("Successfully shared your post.");
                    this.props.resetNewsFeed();
                });
            })
            .catch(err => toastr.error("Something went wrong... Could not upload post."));
    }

    onLoadMoreCmts = (postId: number) => this.getCommentsByPost(postId);

    render() {
        return (
            <React.Fragment>
                <div className="modal fade" id="modal-repost">
                    <div className="modal-dialog">
                        {this.state.showRepostModal &&
                            <NewsFeedRepostForm
                                newsFeedRepost={this.state.newsFeedRepost}
                                repost={this.state.repost}
                                onRepostChange={this.onRepostChange}
                                onRepostSubmit={this.onRepostSubmit}
                            />
                        }
                    </div>
                </div>

                {this.props.newsFeedPosts.map((post, index) => {
                    return (
                        <div className="card mb-4" key={index}>
                            <PostHeader
                                index={index}
                                postId={post.id}
                                postAuthorId={post.createdById}
                                profileId={post.profileId}
                                avatar={post.avatarUrl}
                                name={post.name}
                                postedDate={post.createdDate}
                                currentUserId={this.props.currentUser.id}
                                redirectToProfile={this.props.redirectProfileClicked}
                            />
                            <PostBody
                                // {...this.props}
                                postText={post.feedText}
                                postImgUrl={post.feedImgUrl}
                                repostId={post.feedRepostId}
                                reposts={this.props.reposts}
                                redirectToProfile={this.props.redirectProfileClicked}
                                index={index}
                            />
                            <PostFooter
                                index={index}
                                postId={post.id}
                                didUserLike={post.didUserLike}
                                likes={post.likesCount}
                                comments={post.commentsCount}
                                likePost={this.props.onLikePostClicked}
                                unlikePost={this.props.onUnlikePostClicked}
                                repostClicked={this.onRepostClicked}
                                onCommentClick={this.onCommentsClicked}
                            />
                            {this.state.commentsPosts[post.id] &&
                                <PostComment
                                    index={index}
                                    postId={post.id}
                                    commentsPost={this.state.commentsPosts[post.id]}
                                    onPostCommentChange={this.onCommentFieldChange}
                                    onSendComment={this.onCommentSubmit}
                                    onLoadMoreCmts={this.onLoadMoreCmts}
                                />
                            }
                        </div>
                    )
                })}
            </React.Fragment>
        )
    }
}

export default connect(mapStateToProps)(NewsFeed);