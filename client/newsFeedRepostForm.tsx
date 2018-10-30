import * as React from 'react';
import * as moment from 'moment';
import { INewsFeedPost, IRepost } from '../entities';

interface IRepostFormProps {
    newsFeedRepost: INewsFeedPost;
    repost: IRepost;
    onRepostChange: (fieldName: string, fieldValue: string) => void;
    onRepostSubmit: () => void;
}

const onChangeText = (props: IRepostFormProps) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onRepostChange(e.target.name, e.target.value);
}

export const NewsFeedRepostForm: React.StatelessComponent<IRepostFormProps> = (props) => {
    return (
        <React.Fragment>
            <form className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">
                        <span className="font-weight-light">Share a </span> Repost
                    </h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">×</button>
                </div>
                <div className="modal-body">
                    <div className="form-group" style={{ width: "100%" }}>
                        <textarea maxLength={4000} className="form-control"
                            name="feedText"
                            value={props.newsFeedRepost.feedText}
                            onChange={onChangeText(props)}
                            placeholder="Type something..."
                            style={{ height: "120px" }}>
                        </textarea>
                    </div>

                    {/* POST TO REPOST */}
                    <div className="form-group d-flex flex-column">
                        <h6 className="mb-2">Attached Post:</h6>
                        <div className="card align-self-center" style={{ width: "85%" }}>
                            <div className="card-body" style={{ width: "100%" }}>

                                {/* ATTACHMENT --> attachments/images will only be shown in a repost card IF reposting from original post */}
                                {props.repost.feedImgUrl &&
                                    <div className="ui-bordered">
                                        <a href="javascript:void(0)" className="ui-rect ui-bg-cover text-white" style={{ backgroundImage: `url(${props.repost.feedImgUrl})` }}></a>
                                    </div>
                                }

                                {/* REPOSTFROM TEXT*/}
                                <div className="card media align-items-start py-3">
                                    <div className="media-body ml-4" style={{ borderLeft: "solid #DCDCDC" }}>
                                        <div className="ml-2">
                                            <small><a href="javascript:void(0)" className="d-block text-dark">
                                                <strong>{props.repost.firstName} {props.repost.lastName}</strong>
                                            </a></small>
                                            <small>Posted {moment.utc(props.repost.createdDate).fromNow()}</small>
                                            <div><small className="text-light">{props.repost.feedText}</small></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="float-right">
                        <button type="button" className="btn btn-default waves-effect waves-float" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary waves-effect waves-float" data-dismiss="modal"
                            onClick={props.onRepostSubmit}
                            disabled={props.newsFeedRepost.feedText.length > 0 ? false : true}
                        >Share Post</button>
                    </div>
                </div>
            </form>
        </React.Fragment>
    )
}