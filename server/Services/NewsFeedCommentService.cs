// NOTE: stored procs omitted from sample
namespace Services
{
    public class NewsFeedCommentService : BaseService, INewsFeedCommentService
    {
        public PostComments ReadAllById(int postId, int offset)
        {
            int cmtsCount = 0;
            PostComments data = new PostComments();
            List<NewsFeedCommentProfile> comments = new List<NewsFeedCommentProfile>();
            DataProvider.ExecuteCmd("dbo.NewsFeedComment_SelectAllByPostId",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@PostId", postId, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@Offset", offset, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@TotalCmts", 0, SqlDbType.Int, paramDirection: ParameterDirection.Output));
                },
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    if (resultSet == 0)
                        comments.Add(DataMapper<NewsFeedCommentProfile>.Instance.MapToObject(reader));
                },
                returnParameters: (SqlParameterCollection inputs) =>
                {
                    int.TryParse(inputs["@TotalCmts"].Value.ToString(), out cmtsCount);
                });
            data.TotalCmts = cmtsCount;
            data.Comments = comments;
            return data;
        }

        public int Insert(NewsFeedCommentAddRequest model)
        {
            int returnValue = 0;
            DataProvider.ExecuteNonQuery("dbo.NewsFeedComment_Insert",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@NewsFeedPostId", model.NewsFeedPostId, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@CommentText", model.CommentText, SqlDbType.NVarChar, 2000));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@CreatedById", model.CreatedById, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@Id", 0, SqlDbType.Int, paramDirection: ParameterDirection.Output));
                },
                returnParameters: (SqlParameterCollection inputs) =>
                {
                    int.TryParse(inputs["@Id"].Value.ToString(), out returnValue);
                });
            return returnValue;
        }
    }
}