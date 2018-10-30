namespace Controllers
{
    [RoutePrefix("api/user/newsfeed/posts")]
    public class NewsFeedPostController : ApiController
    {
        // NOTE: interface implmentations omitted from sample
        private INewsFeedPostService _newsFeedPostService;
        private IUserService _userService;
        private int currentUserId;

        public NewsFeedPostController(INewsFeedPostService newsFeedPostService, IUserService userService)
        {
            _newsFeedPostService = newsFeedPostService;
            _userService = userService;
            currentUserId = _userService.GetCurrentUserId();
        }

        // retrieve post by id
        [Route("{id:int}"), HttpGet]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                ItemResponse<NewsFeedRepost> response = new ItemResponse<NewsFeedRepost>
                {
                    Item = _newsFeedPostService.ReadById(id)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // insert new post by current user
        [Route(), HttpPost]
        public IHttpActionResult Post(NewsFeedPostAddRequest model)
        {
            try
            {
                model.CreatedById = currentUserId;
                if (!ModelState.IsValid) return BadRequest(ModelState);
                ItemResponse<int> response = new ItemResponse<int>
                {
                    Item = _newsFeedPostService.Insert(model)
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