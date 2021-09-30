require('dotenv').config();

import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { json } from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';

const { PORT, NODE_ENV, API_URL, SESSION_SECRET } = process.env;
const dev = NODE_ENV === 'development';

const FileStore = new sessionFileStore(session);

polka() // You can also use Express
	.use(
		json(),
    	session({
			secret: SESSION_SECRET,
			resave: true,
			saveUninitialized: true,
			cookie: {
				maxAge: 300000
			},
      		store: new FileStore({
        		path: `.sessions`
      		})
    	}),
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			session: (req, res) => {
				return ({
					access_token: req.session.access_token,
					user_name: req.session.user_name,
					API_URL: API_URL
				})
			}
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
