// NOTE: stored procs omitted from sample
namespace Services
{
    public class NewsFeedPostService : BaseService, INewsFeedPostService
    {
        public NewsFeedRepost ReadById(int id)
        {
            NewsFeedRepost newsFeedPostTable = new NewsFeedRepost();
            DataProvider.ExecuteCmd("dbo.NewsFeedPost_SelectById",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.AddWithValue("@Id", id);
                },
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    newsFeedPostTable = DataMapper<NewsFeedRepost>.Instance.MapToObject(reader);
                });
            return newsFeedPostTable;
        }

        public int Insert(NewsFeedPostAddRequest model)
        {
            int returnValue = 0;
            DataProvider.ExecuteNonQuery("dbo.NewsFeedPost_Insert",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@FeedText", model.FeedText, SqlDbType.NVarChar, -1)); // max
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@FeedImgUrl", model.FeedImgUrl, SqlDbType.NVarChar, 256));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@FeedRepostId", model.FeedRepostId, SqlDbType.Int));
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