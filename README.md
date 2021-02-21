# Daibh SSR front end

### Running the project

Run the api and postgis containers by:

```bash
docker-compose up -d db fast
```

Clone the repo and go into the folder

```bash
npm install
npm run dev
```

This will start the development server on [localhost:3000](http://localhost:3000) that should make api calls to local api form docker-compose.
