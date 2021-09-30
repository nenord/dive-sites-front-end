export function post(req, res) {
    try {
        req.session.access_token = null;
        req.session.user_name = null;
        res.end(JSON.stringify({ detail: "User logged out!" }));
    } catch (error) {
        console.log(error.message)
        res.end(JSON.stringify({ detail: error.message }));
      }
}