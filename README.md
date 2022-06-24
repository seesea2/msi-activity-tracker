# client

It is set up using @vue/cli in folder 'client'.

# server

It is set up using NodeJS + typescript in folder 'server'.

## Production Deployment

```
npm install
change directory to client, execute: npm install
npm run build
change directory to server, execute: npm install
npm run build
```

## Project Development Setup

```
npm install
change directory to server, execute: npm install
change directory to client, execute: npm install
```

### Compiles and hot-reloads for development

```
npm run serve
visit website according to command line output, e.g. http://localhost:8081
```

### Compiles and minifies for production

```
npm run build
```


### send email feature

```
need to configure smtp info in file: ./server/src/cfg.js
```
