namespace Controllers
{
    [RoutePrefix("api/user/newsfeed/comments")]
    public class NewsFeedCommentController : ApiController
    {
        // NOTE: interface implmentations omitted from sample
        private INewsFeedCommentService _newsFeedCommentService;
        private IUserService _userService;
        private int currentUserId;

        public NewsFeedCommentController(INewsFeedCommentService newsFeedCommentService, IUserService userService)
        {
            _newsFeedCommentService = newsFeedCommentService;
            _userService = userService;
            currentUserId = _userService.GetCurrentUserId();
        }

        // retrieve list of comments by post id
        [Route("post/{postId:int}/{offset:int}"), HttpGet]
        public IHttpActionResult GetAllById(int postId, int offset)
        {
            try
            {
                ItemResponse<PostComments> response = new ItemResponse<PostComments>
                {
                    Item = _newsFeedCommentService.ReadAllById(postId, offset)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // add new comment for post by current user
        [Route(), HttpPost]
        public IHttpActionResult Post(NewsFeedCommentAddRequest model)
        {
            try
            {
                model.CreatedById = currentUserId;
                if (!ModelState.IsValid) return BadRequest(ModelState);
                ItemResponse<int> response = new ItemResponse<int>
                {
                    Item = _newsFeedCommentService.Insert(model)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}