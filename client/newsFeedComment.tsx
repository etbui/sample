import * as React from 'react';
import * as moment from 'moment';
import { IPostComment } from '../entities';
import { Button } from '../../common/form';

interface IPostCommentProps {
    index: number;
    postId: number;
    commentsPost: IPostComment;
    onPostCommentChange: (fieldName: string, fieldValue: string, postId: number) => void;
    onSendComment: (index: number) => void;
    onLoadMoreCmts: (postId: number) => void;
}

const onChange = (props: IPostCommentProps) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onPostCommentChange(e.target.name, e.target.value, props.postId);
}

export const PostComment: React.StatelessComponent<IPostCommentProps> = (props) => {
    // will return a single comment
    const buildComment = (comment, index) => {
        return (
            <React.Fragment key={comment.id}>
                <div className="media py-1">
                    <img src={comment.avatarUrl} className="d-block ui-w-30 rounded-circle" />
                    <div className="media-body ml-3">
                        <div className="mb-1">
                            <div className="float-right text-muted small">{moment.utc(comment.createdDate).fromNow()}</div>
                            <span className="font-weight-semibold">{comment.name}</span>
                        </div>
                        {comment.commentText}
                    </div>
                </div>
                {index == props.commentsPost.comments.length - 1 ?
                    ''
                    : <hr className="border-light my-2" />
                }
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {/* display only if any comments related to this post */}
            {props.commentsPost.comments.length > 0 &&
                <div className="card-footer">
                    {props.commentsPost.comments.map(buildComment)}
                    {props.commentsPost.totalCmts > 2 && props.commentsPost.cmtDisplayCount < props.commentsPost.totalCmts
                        && <a href="javascript:void(0)" className="d-block text-center text-dark small font-weight-semibold py-1"
                            onClick={() => props.onLoadMoreCmts(props.postId)}>load more comments</a>
                    }
                </div>
            }
            <div className="card-footer py-2">
                <div className="input-group">
                    <textarea rows={2} maxLength={2000} className="form-control border-transparent pl-0"
                        name="cmtField"
                        value={props.commentsPost.cmtField}
                        onChange={onChange(props)}
                        placeholder="Write your comment...">
                    </textarea>
                    <div className="d-flex justify-content-center align-items-center input-group-append">
                        <div>
                            <Button
                                label="Share"
                                className="btn btn-primary waves-effect waves-float float-right"
                                onClick={() => props.onSendComment(props.postId)}
                                disabled={props.commentsPost.cmtField.length > 0 ? false : true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}