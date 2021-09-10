import fetch from "node-fetch";
import FormData from "form-data";

export async function post(req, res) {
  try {
    const { email, password } = req.body;

    var formdata = new FormData();
        formdata.append("username", email);
        formdata.append("password", password);
    
    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    const result = await fetch(`${process.env.API_URL}/token`, requestOptions)

    const parsed = await result.json();

    if (parsed.access_token) {
        req.session.access_token = parsed.access_token;
        res.end(JSON.stringify({ access_token: parsed.access_token }));
    }
    else {
        res.end(JSON.stringify({ detail: parsed.detail }));
    }
  } catch (error) {
    console.log(error.message)
    res.end(JSON.stringify({ detail: error.message }));
  }
}