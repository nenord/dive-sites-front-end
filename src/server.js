require('dotenv').config();

import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { json } from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';

const { PORT, NODE_ENV, API_URL } = process.env;
const dev = NODE_ENV === 'development';

const FileStore = new sessionFileStore(session);

polka() // You can also use Express
	.use(
		json(),
    	session({
			secret: 'SomeSecretStringThatIsNotInGithub',
			resave: true,
			saveUninitialized: true,
			cookie: {
				maxAge: 31536000
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
					API_URL: API_URL
				})
			}
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
