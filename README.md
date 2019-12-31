# hellsupply

> Inhouse HELL ordering

## Start Docker

```
docker-compose down
docker-compose up -d
```

## Login with admin, admin into MongoDB
```
node login
```


## Build Setup

``` bash
# install dependencies
$ npm run install

# start MongoDB on port 31000
$ docker-compose up

# serve with hot reload at localhost:8787
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

Manually generating password: `node generatePasswordHash.js`

Example user with admin role (admin@admin.com:admin)
```
{
    firstName: 'It's A',
    lastName: 'Admin',
    email: 'admin@admin.com',
    password: '$2b$15$gHNKCQPydZ/R.ZH/nqOmm.zGalFn/UuYEV4tUkfsGHBpIgQx9tUyG',
    role: 'admin',
    active: true
}
```

Add demo product:
```nodejs
node demoProducts
```

Add demo users:
```nodejs
node demoProducts
```
